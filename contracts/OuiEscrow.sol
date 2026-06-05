// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./OuiScore.sol";

/**
 * @title OuiEscrow
 * @author Oui Market
 * @notice Trustless escrow for campus tasks using cNGN.
 * @dev    Implements community-led dispute resolution and auto-release.
 */
contract OuiEscrow is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    enum State { OPEN, LOCKED, SUBMITTED, APPROVED, DISPUTED, RESOLVED, REFUNDED }

    struct Task {
        uint256 taskId;
        address poster;
        address doer;
        uint256 amount;
        uint256 platformFee;
        uint256 escrowFee;
        uint256 deadline;
        State state;
        uint256 submissionTime;
        uint8 disputeVotesFor;
        uint8 disputeVotesAgainst;
        mapping(address => bool) hasVoted;
        uint8 totalVotes;
    }

    IERC20 public immutable cNGN;
    OuiScore public immutable ouiScore;
    address public platformTreasury;
    uint256 public taskCounter;

    uint256 public constant DISPUTE_FEE = 500 * 10**18; // 500 cNGN
    uint256 public constant ARBITER_REWARD = 100 * 10**18; // 100 cNGN

    mapping(uint256 => Task) public tasks;

    event TaskCreated(uint256 indexed taskId, address indexed poster, uint256 amount);
    event TaskAccepted(uint256 indexed taskId, address indexed doer);
    event WorkSubmitted(uint256 indexed taskId);
    event WorkApproved(uint256 indexed taskId);
    event AutoReleased(uint256 indexed taskId);
    event Refunded(uint256 indexed taskId);
    event DisputeRaised(uint256 indexed taskId, address indexed raiser);
    event DisputeResolved(uint256 indexed taskId, bool releasedToDoer);

    constructor(address _cNGN, address _ouiScore, address _treasury) Ownable(msg.sender) {
        cNGN = IERC20(_cNGN);
        ouiScore = OuiScore(_ouiScore);
        platformTreasury = _treasury;
    }

    /**
     * @notice Create a new task and lock funds.
     */
    function createTask(uint256 amount, uint256 durationInSeconds) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        
        uint256 pFee = (amount * 80) / 1000; // 8%
        uint256 eFee = (amount * 15) / 1000; // 1.5%
        uint256 totalNeeded = amount + eFee;

        taskCounter++;
        Task storage newTask = tasks[taskCounter];
        newTask.taskId = taskCounter;
        newTask.poster = msg.sender;
        newTask.amount = amount;
        newTask.platformFee = pFee;
        newTask.escrowFee = eFee;
        newTask.deadline = block.timestamp + durationInSeconds;
        newTask.state = State.OPEN;

        cNGN.safeTransferFrom(msg.sender, address(this), totalNeeded);
        
        emit TaskCreated(taskCounter, msg.sender, amount);
    }

    /**
     * @notice Accept an open task.
     */
    function acceptTask(uint256 taskId) external {
        Task storage task = tasks[taskId];
        require(task.state == State.OPEN, "Task not open");
        require(msg.sender != task.poster, "Poster cannot accept own task");

        task.doer = msg.sender;
        task.state = State.LOCKED;
        
        emit TaskAccepted(taskId, msg.sender);
    }

    /**
     * @notice Submit work for a locked task.
     */
    function submitWork(uint256 taskId) external {
        Task storage task = tasks[taskId];
        require(task.state == State.LOCKED, "Task not locked");
        require(msg.sender == task.doer, "Only doer can submit");

        task.state = State.SUBMITTED;
        task.submissionTime = block.timestamp;
        
        emit WorkSubmitted(taskId);
    }

    /**
     * @notice Approve work and release payment.
     */
    function approveWork(uint256 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        require(task.state == State.SUBMITTED, "Not submitted");
        require(msg.sender == task.poster, "Only poster can approve");

        _releaseFunds(taskId, true);
        
        emit WorkApproved(taskId);
    }

    /**
     * @notice Auto-release funds after 48h of submission.
     */
    function autoRelease(uint256 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        require(task.state == State.SUBMITTED, "Not submitted");
        require(block.timestamp >= task.submissionTime + 48 hours, "48h not passed");

        _releaseFunds(taskId, true);
        
        emit AutoReleased(taskId);
    }

    /**
     * @notice Claim refund if deadline missed.
     */
    function claimRefund(uint256 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        require(msg.sender == task.poster, "Only poster");
        require(block.timestamp > task.deadline, "Deadline not passed");
        require(task.state == State.OPEN || task.state == State.LOCKED, "Cannot refund");

        if (task.state == State.LOCKED) {
            ouiScore.penalizeDispute(task.doer);
        }

        task.state = State.REFUNDED;
        cNGN.safeTransfer(task.poster, task.amount + task.escrowFee);
        
        emit Refunded(taskId);
    }

    /**
     * @notice Raise a dispute and pay dispute fee.
     */
    function raiseDispute(uint256 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        require(task.state == State.SUBMITTED, "Not submitted");
        require(msg.sender == task.poster || msg.sender == task.doer, "Only participants");

        task.state = State.DISPUTED;
        cNGN.safeTransferFrom(msg.sender, address(this), DISPUTE_FEE);
        
        emit DisputeRaised(taskId, msg.sender);
    }

    /**
     * @notice Cast a vote on a dispute (Diamond tier only).
     */
    function castDisputeVote(uint256 taskId, bool releaseToDoer) external {
        Task storage task = tasks[taskId];
        require(task.state == State.DISPUTED, "Not in dispute");
        require(ouiScore.meetsThreshold(msg.sender, OuiScore.Tier.DIAMOND), "Not Diamond tier");
        require(!task.hasVoted[msg.sender], "Already voted");
        require(task.totalVotes < 5, "Voting closed");

        task.hasVoted[msg.sender] = true;
        task.totalVotes++;

        if (releaseToDoer) {
            task.disputeVotesFor++;
        } else {
            task.disputeVotesAgainst++;
        }

        // Pay arbiter immediately from treasury (requires treasury approval or contract balance)
        cNGN.safeTransferFrom(platformTreasury, msg.sender, ARBITER_REWARD);

        if (task.totalVotes == 5) {
            _resolveDispute(taskId);
        }
    }

    function _resolveDispute(uint256 taskId) internal {
        Task storage task = tasks[taskId];
        bool toDoer = task.disputeVotesFor > task.disputeVotesAgainst;
        
        task.state = State.RESOLVED;
        
        if (toDoer) {
            uint256 payout = task.amount - task.platformFee;
            cNGN.safeTransfer(task.doer, payout + DISPUTE_FEE);
            cNGN.safeTransfer(platformTreasury, task.platformFee + task.escrowFee);
            ouiScore.penalizeDispute(task.poster);
            ouiScore.incrementCompletion(task.doer);
        } else {
            cNGN.safeTransfer(task.poster, task.amount + task.escrowFee + DISPUTE_FEE);
            ouiScore.penalizeDispute(task.doer);
            ouiScore.incrementPayment(task.poster);
        }

        emit DisputeResolved(taskId, toDoer);
    }

    function _releaseFunds(uint256 taskId, bool success) internal {
        Task storage task = tasks[taskId];
        task.state = State.APPROVED;
        
        uint256 payout = task.amount - task.platformFee;
        cNGN.safeTransfer(task.doer, payout);
        cNGN.safeTransfer(platformTreasury, task.platformFee + task.escrowFee);
        
        ouiScore.incrementCompletion(task.doer);
        ouiScore.incrementPayment(task.poster);
    }

    function setTreasury(address _newTreasury) external onlyOwner {
        platformTreasury = _newTreasury;
    }
}
