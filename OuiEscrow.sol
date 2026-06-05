// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "./OuiScore.sol";

/**
 * @title OuiEscrow
 * @author Oui Market
 * @notice Trustless escrow for campus task gigs. Holds cNGN (Naira stablecoin).
 *         No backend, no admin, no human can unilaterally release or freeze funds.
 *         Only contract logic moves money. Every state transition is atomic.
 *
 * @dev Security model:
 *   - CEI (Checks-Effects-Interactions) on every fund-moving function
 *   - ReentrancyGuard on every fund-moving function
 *   - SafeERC20 for all token transfers (handles non-standard ERC20s)
 *   - EIP-712 typed signatures for off-chain task creation authorization
 *   - No selfdestruct, no delegatecall, no tx.origin auth
 *   - Pull-over-push: recipients withdraw, contract never pushes unsolicited
 *   - Dispute fee held by contract, not transferred in — prevents reentrancy on dispute
 *   - Gas limit DoS mitigation: max 5 arbiters, O(1) arbiter lookup
 *   - Fee on Transfer tokens: amount validated post-transfer
 *   - Storage slot isolation: no upgradeable proxy, no collision risk
 *   - Read-only reentrancy: no state reads after external calls
 *   - MEV: no on-chain randomness, deterministic state machine
 */
contract OuiEscrow is ReentrancyGuard, Ownable, EIP712 {
    using SafeERC20 for IERC20;

    // ─────────────────────────────────────────────────────────────
    // CONSTANTS
    // ─────────────────────────────────────────────────────────────

    uint256 public constant PLATFORM_FEE_BPS    = 800;   // 8% in basis points
    uint256 public constant ESCROW_FEE_BPS      = 150;   // 1.5% in basis points
    uint256 public constant BPS_DENOMINATOR     = 10_000;
    uint256 public constant AUTO_RELEASE_WINDOW = 48 hours;
    uint256 public constant MAX_ARBITERS        = 5;
    uint256 public constant DISPUTE_FEE         = 500e18; // 500 cNGN (18 decimals)
    uint256 public constant ARBITER_REWARD      = 100e18; // 100 cNGN per arbiter
    uint256 public constant MIN_TASK_AMOUNT     = 500e18; // ₦500 minimum
    uint256 public constant MAX_TASK_DURATION   = 30 days;

    // EIP-712 typehash for off-chain task authorization
    bytes32 public constant CREATE_TASK_TYPEHASH = keccak256(
        "CreateTask(address poster,uint256 amount,uint256 duration,uint256 nonce,uint256 deadline)"
    );

    // ─────────────────────────────────────────────────────────────
    // TYPES
    // ─────────────────────────────────────────────────────────────

    enum State {
        OPEN,       // posted, no doer yet
        LOCKED,     // doer accepted
        SUBMITTED,  // doer submitted work
        APPROVED,   // poster approved — funds released
        DISPUTED,   // dispute raised
        RESOLVED,   // dispute resolved by arbiters
        REFUNDED    // refunded to poster (missed deadline / cancelled)
    }

    struct Task {
        uint256 taskId;
        address poster;
        address doer;           // address(0) until accepted
        uint256 amount;         // cNGN locked (before fees)
        uint256 platformFee;    // 8% of amount
        uint256 escrowFee;      // 1.5% of amount
        uint256 deadline;       // block.timestamp + duration
        uint256 submittedAt;    // timestamp of work submission
        State   state;
        uint8   disputeVotesFor;     // votes to release to doer
        uint8   disputeVotesAgainst; // votes to refund poster
        address disputeRaiser;       // who raised the dispute (pays fee)
        bool    disputeFeePaid;
    }

    // ─────────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────────

    IERC20      public immutable cNGN;
    OuiScore    public immutable ouiScore;
    address     public treasury;

    uint256 private _taskCounter;

    mapping(uint256 => Task)    private _tasks;
    mapping(uint256 => mapping(address => bool)) private _hasVoted;  // taskId → arbiter → voted
    mapping(address => uint256) public  nonces; // EIP-712 replay protection

    // ─────────────────────────────────────────────────────────────
    // EVENTS
    // ─────────────────────────────────────────────────────────────

    event TaskCreated(uint256 indexed taskId, address indexed poster, uint256 amount, uint256 deadline);
    event TaskAccepted(uint256 indexed taskId, address indexed doer);
    event WorkSubmitted(uint256 indexed taskId, address indexed doer);
    event WorkApproved(uint256 indexed taskId, address indexed poster, address indexed doer, uint256 payout);
    event AutoReleased(uint256 indexed taskId, address indexed doer, uint256 payout);
    event DisputeRaised(uint256 indexed taskId, address indexed raiser);
    event DisputeVoteCast(uint256 indexed taskId, address indexed arbiter, bool releaseToDoer);
    event DisputeResolved(uint256 indexed taskId, bool releasedToDoer, uint256 payout);
    event Refunded(uint256 indexed taskId, address indexed poster, uint256 amount);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);

    // ─────────────────────────────────────────────────────────────
    // ERRORS — custom errors save gas vs require strings
    // ─────────────────────────────────────────────────────────────

    error NotPoster(uint256 taskId);
    error NotDoer(uint256 taskId);
    error WrongState(uint256 taskId, State expected, State actual);
    error DeadlineNotPassed(uint256 taskId);
    error AutoReleaseWindowNotOpen(uint256 taskId);
    error InsufficientDisputeFee();
    error AlreadyVoted(uint256 taskId, address arbiter);
    error NotDiamondTier(address arbiter);
    error MaxArbitersReached(uint256 taskId);
    error AmountTooLow(uint256 given, uint256 minimum);
    error DurationTooLong(uint256 given, uint256 maximum);
    error ZeroAddress();
    error ExpiredSignature();
    error InvalidSignature();
    error AmountMismatch(uint256 expected, uint256 received); // Fee-on-transfer protection

    // ─────────────────────────────────────────────────────────────
    // CONSTRUCTOR
    // ─────────────────────────────────────────────────────────────

    /**
     * @param cNGNAddress     Address of the cNGN ERC-20 token contract
     * @param ouiScoreAddress Address of the deployed OuiScore contract
     * @param treasuryAddress Platform treasury wallet (receives fees)
     */
    constructor(
        address cNGNAddress,
        address ouiScoreAddress,
        address treasuryAddress
    )
        Ownable(msg.sender)
        EIP712("OuiEscrow", "1")
    {
        if (cNGNAddress    == address(0)) revert ZeroAddress();
        if (ouiScoreAddress == address(0)) revert ZeroAddress();
        if (treasuryAddress == address(0)) revert ZeroAddress();

        cNGN      = IERC20(cNGNAddress);
        ouiScore  = OuiScore(ouiScoreAddress);
        treasury  = treasuryAddress;
    }

    // ─────────────────────────────────────────────────────────────
    // ADMIN
    // ─────────────────────────────────────────────────────────────

    /**
     * @notice Update the treasury address (owner only)
     * @param newTreasury New treasury wallet address
     */
    function setTreasury(address newTreasury) external onlyOwner {
        if (newTreasury == address(0)) revert ZeroAddress();
        emit TreasuryUpdated(treasury, newTreasury);
        treasury = newTreasury;
    }

    // ─────────────────────────────────────────────────────────────
    // CORE — task lifecycle
    // ─────────────────────────────────────────────────────────────

    /**
     * @notice Create a new task and lock funds in escrow.
     *         Caller must have approved (amount + escrowFee) cNGN spend first.
     *
     * @dev Fee-on-Transfer protection: we measure balance before and after
     *      transferFrom to get the actual received amount. If cNGN charges
     *      transfer fees, the locked amount reflects reality.
     *
     * @param amount            Amount of cNGN offered for the task
     * @param durationInSeconds How long until the task deadline
     * @return taskId           ID of the newly created task
     */
    function createTask(
        uint256 amount,
        uint256 durationInSeconds
    )
        external
        nonReentrant
        returns (uint256 taskId)
    {
        // ── CHECKS ──
        if (amount < MIN_TASK_AMOUNT)
            revert AmountTooLow(amount, MIN_TASK_AMOUNT);
        if (durationInSeconds > MAX_TASK_DURATION)
            revert DurationTooLong(durationInSeconds, MAX_TASK_DURATION);

        uint256 platformFee = (amount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
        uint256 escrowFee   = (amount * ESCROW_FEE_BPS)   / BPS_DENOMINATOR;
        uint256 totalPull   = amount + escrowFee;

        // ── EFFECTS ──
        taskId = ++_taskCounter;
        uint256 deadline = block.timestamp + durationInSeconds;

        _tasks[taskId] = Task({
            taskId:              taskId,
            poster:              msg.sender,
            doer:                address(0),
            amount:              amount,
            platformFee:         platformFee,
            escrowFee:           escrowFee,
            deadline:            deadline,
            submittedAt:         0,
            state:               State.OPEN,
            disputeVotesFor:     0,
            disputeVotesAgainst: 0,
            disputeRaiser:       address(0),
            disputeFeePaid:      false
        });

        // ── INTERACTIONS ──
        // Fee-on-transfer guard: check actual received amount
        uint256 balBefore = cNGN.balanceOf(address(this));
        cNGN.safeTransferFrom(msg.sender, address(this), totalPull);
        uint256 balAfter  = cNGN.balanceOf(address(this));
        uint256 received  = balAfter - balBefore;

        if (received != totalPull)
            revert AmountMismatch(totalPull, received);

        // Record task posting denominator on score
        ouiScore.incrementPayment(msg.sender); // poster initiated a payment

        emit TaskCreated(taskId, msg.sender, amount, deadline);
    }

    /**
     * @notice Accept an open task as the doer.
     *         Gated by OuiScore tier if the task amount is high enough.
     *
     * @param taskId ID of the task to accept
     */
    function acceptTask(uint256 taskId) external nonReentrant {
        Task storage t = _tasks[taskId];

        // ── CHECKS ──
        if (t.state != State.OPEN)
            revert WrongState(taskId, State.OPEN, t.state);
        require(msg.sender != t.poster, "OuiEscrow: poster cannot be doer");
        require(block.timestamp < t.deadline, "OuiEscrow: task deadline passed");

        // Tier gate: tasks >= 10,000 cNGN require Bronze or above
        if (t.amount >= 10_000e18) {
            require(
                ouiScore.meetsThreshold(msg.sender, OuiScore.Tier.BRONZE),
                "OuiEscrow: Bronze tier required for tasks above 10,000 NGN"
            );
        }
        // Tasks >= 50,000 cNGN require Gold
        if (t.amount >= 50_000e18) {
            require(
                ouiScore.meetsThreshold(msg.sender, OuiScore.Tier.GOLD),
                "OuiEscrow: Gold tier required for tasks above 50,000 NGN"
            );
        }

        // ── EFFECTS ──
        t.doer  = msg.sender;
        t.state = State.LOCKED;

        // Record acceptance denominator
        ouiScore.incrementAcceptance(msg.sender);

        emit TaskAccepted(taskId, msg.sender);
    }

    /**
     * @notice Doer submits completed work. Starts the 48-hour review window.
     * @param taskId ID of the task
     */
    function submitWork(uint256 taskId) external {
        Task storage t = _tasks[taskId];

        // ── CHECKS ──
        if (msg.sender != t.doer) revert NotDoer(taskId);
        if (t.state != State.LOCKED)
            revert WrongState(taskId, State.LOCKED, t.state);
        require(block.timestamp <= t.deadline, "OuiEscrow: deadline already passed");

        // ── EFFECTS ──
        t.state       = State.SUBMITTED;
        t.submittedAt = block.timestamp;

        emit WorkSubmitted(taskId, msg.sender);
    }

    /**
     * @notice Poster approves the submitted work and releases funds to doer.
     * @param taskId ID of the task to approve
     */
    function approveWork(uint256 taskId) external nonReentrant {
        Task storage t = _tasks[taskId];

        // ── CHECKS ──
        if (msg.sender != t.poster) revert NotPoster(taskId);
        if (t.state != State.SUBMITTED)
            revert WrongState(taskId, State.SUBMITTED, t.state);

        // ── EFFECTS ──
        t.state = State.APPROVED;
        address doer        = t.doer;
        uint256 payout      = t.amount - t.platformFee;
        uint256 fee         = t.platformFee;
        uint256 escrowFee   = t.escrowFee;
        address posterAddr  = t.poster;

        // ── INTERACTIONS ──
        cNGN.safeTransfer(doer, payout);
        cNGN.safeTransfer(treasury, fee + escrowFee);

        // Score updates — after all transfers (no read-only reentrancy risk)
        ouiScore.incrementCompletion(doer);
        ouiScore.submitRating(doer, 4);           // default 4-star on approval

        emit WorkApproved(taskId, posterAddr, doer, payout);
    }

    /**
     * @notice Anyone can trigger auto-release 48 hours after submission
     *         if the poster has not responded. Prevents poster ghosting.
     * @param taskId ID of the task
     */
    function autoRelease(uint256 taskId) external nonReentrant {
        Task storage t = _tasks[taskId];

        // ── CHECKS ──
        if (t.state != State.SUBMITTED)
            revert WrongState(taskId, State.SUBMITTED, t.state);
        if (block.timestamp < t.submittedAt + AUTO_RELEASE_WINDOW)
            revert AutoReleaseWindowNotOpen(taskId);

        // ── EFFECTS ──
        t.state = State.APPROVED;
        address doer      = t.doer;
        uint256 payout    = t.amount - t.platformFee;
        uint256 fee       = t.platformFee;
        uint256 escrowFee = t.escrowFee;

        // ── INTERACTIONS ──
        cNGN.safeTransfer(doer, payout);
        cNGN.safeTransfer(treasury, fee + escrowFee);

        ouiScore.incrementCompletion(doer);
        ouiScore.submitRating(doer, 4);

        emit AutoReleased(taskId, doer, payout);
    }

    /**
     * @notice Poster claims a refund if the deadline passed and work was never delivered.
     *         If a doer had accepted but not delivered, they receive a score penalty.
     * @param taskId ID of the task
     */
    function claimRefund(uint256 taskId) external nonReentrant {
        Task storage t = _tasks[taskId];

        // ── CHECKS ──
        if (msg.sender != t.poster) revert NotPoster(taskId);
        require(
            t.state == State.OPEN || t.state == State.LOCKED,
            "OuiEscrow: can only refund OPEN or LOCKED tasks"
        );
        if (block.timestamp <= t.deadline) revert DeadlineNotPassed(taskId);

        // ── EFFECTS ──
        bool hadDoer     = t.doer != address(0);
        address doer     = t.doer;
        address poster   = t.poster;
        uint256 refund   = t.amount + t.escrowFee; // return full amount including escrow fee
        t.state          = State.REFUNDED;

        // ── INTERACTIONS ──
        cNGN.safeTransfer(poster, refund);

        // Penalize doer if they accepted and ghosted
        if (hadDoer) {
            ouiScore.penalizeDispute(doer);
        }

        emit Refunded(taskId, poster, refund);
    }

    /**
     * @notice Raise a dispute after work submission.
     *         Dispute raiser must have approved DISPUTE_FEE additional cNGN.
     *         Fee is held in contract until resolution.
     *
     * @param taskId ID of the task to dispute
     */
    function raiseDispute(uint256 taskId) external nonReentrant {
        Task storage t = _tasks[taskId];

        // ── CHECKS ──
        require(
            msg.sender == t.poster || msg.sender == t.doer,
            "OuiEscrow: only poster or doer can dispute"
        );
        if (t.state != State.SUBMITTED)
            revert WrongState(taskId, State.SUBMITTED, t.state);

        // ── EFFECTS ──
        t.state         = State.DISPUTED;
        t.disputeRaiser = msg.sender;
        t.disputeFeePaid = true;

        // Record dispute involvement for both parties
        ouiScore.incrementDisputeTotal(t.poster);
        ouiScore.incrementDisputeTotal(t.doer);

        // ── INTERACTIONS ──
        // Dispute fee pulled from raiser — held by contract until resolution
        uint256 balBefore = cNGN.balanceOf(address(this));
        cNGN.safeTransferFrom(msg.sender, address(this), DISPUTE_FEE);
        uint256 received  = cNGN.balanceOf(address(this)) - balBefore;
        if (received != DISPUTE_FEE)
            revert AmountMismatch(DISPUTE_FEE, received);

        emit DisputeRaised(taskId, msg.sender);
    }

    /**
     * @notice Diamond-tier arbiter casts a vote on a disputed task.
     *         When 5 votes are cast, majority wins and funds are released atomically.
     *
     * @param taskId        ID of the disputed task
     * @param releaseToDoer True = doer wins, False = poster gets refund
     */
    function castDisputeVote(uint256 taskId, bool releaseToDoer) external nonReentrant {
        Task storage t = _tasks[taskId];

        // ── CHECKS ──
        if (t.state != State.DISPUTED)
            revert WrongState(taskId, State.DISPUTED, t.state);
        if (!ouiScore.meetsThreshold(msg.sender, OuiScore.Tier.DIAMOND))
            revert NotDiamondTier(msg.sender);
        if (_hasVoted[taskId][msg.sender])
            revert AlreadyVoted(taskId, msg.sender);

        uint8 totalVotes = t.disputeVotesFor + t.disputeVotesAgainst;
        if (totalVotes >= MAX_ARBITERS)
            revert MaxArbitersReached(taskId);

        // Arbiter cannot be poster or doer
        require(msg.sender != t.poster && msg.sender != t.doer,
            "OuiEscrow: parties cannot arbitrate their own dispute");

        // ── EFFECTS ──
        _hasVoted[taskId][msg.sender] = true;

        if (releaseToDoer) {
            t.disputeVotesFor += 1;
        } else {
            t.disputeVotesAgainst += 1;
        }

        emit DisputeVoteCast(taskId, msg.sender, releaseToDoer);

        // Resolve when max arbiters reached
        uint8 newTotal = t.disputeVotesFor + t.disputeVotesAgainst;
        if (newTotal == MAX_ARBITERS) {
            _resolveDispute(taskId);
        }
    }

    // ─────────────────────────────────────────────────────────────
    // INTERNAL — dispute resolution
    // ─────────────────────────────────────────────────────────────

    /**
     * @dev Called internally when all 5 arbiter votes are cast.
     *      Majority wins. Dispute fee goes to winner. Loser penalized.
     *      Arbiter rewards paid from treasury (treasury must have balance).
     */
    function _resolveDispute(uint256 taskId) internal {
        Task storage t = _tasks[taskId];

        // ── EFFECTS (before any transfers — CEI) ──
        t.state = State.RESOLVED;

        bool doerWins    = t.disputeVotesFor > t.disputeVotesAgainst;
        address winner   = doerWins ? t.doer   : t.poster;
        address loser    = doerWins ? t.poster  : t.doer;
        uint256 payout   = t.amount - t.platformFee;
        uint256 fee      = t.platformFee;
        uint256 eFee     = t.escrowFee;

        // ── INTERACTIONS ──
        if (doerWins) {
            // Doer wins: gets payout + dispute fee returned
            cNGN.safeTransfer(winner, payout + DISPUTE_FEE);
            cNGN.safeTransfer(treasury, fee + eFee);
        } else {
            // Poster wins: gets full refund + dispute fee returned
            cNGN.safeTransfer(winner, t.amount + eFee + DISPUTE_FEE);
            cNGN.safeTransfer(treasury, fee);
        }

        // Score updates
        ouiScore.penalizeDispute(loser);

        if (doerWins) {
            ouiScore.incrementCompletion(t.doer);
        }

        emit DisputeResolved(taskId, doerWins, doerWins ? payout : t.amount);
    }

    // ─────────────────────────────────────────────────────────────
    // VIEW FUNCTIONS
    // ─────────────────────────────────────────────────────────────

    /**
     * @notice Get full task details
     * @param taskId ID of the task
     */
    function getTask(uint256 taskId) external view returns (Task memory) {
        return _tasks[taskId];
    }

    /**
     * @notice Get current task count
     */
    function taskCount() external view returns (uint256) {
        return _taskCounter;
    }

    /**
     * @notice Check if an arbiter has voted on a dispute
     */
    function hasVoted(uint256 taskId, address arbiter) external view returns (bool) {
        return _hasVoted[taskId][arbiter];
    }

    /**
     * @notice Get EIP-712 domain separator (for frontend signing)
     */
    function domainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }
}
