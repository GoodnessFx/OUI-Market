// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OuiScore
 * @author Oui Market
 * @notice On-chain reputation system for Oui Market campus students.
 *         Scores are minted by authorized contracts only — never by users directly.
 *         Composable: any external contract can read scores and gate access.
 * @dev    No user can inflate their own score. Only whitelisted contracts write.
 *         All score math uses integer arithmetic scaled to avoid floating point.
 */
contract OuiScore is Ownable {

    // ─────────────────────────────────────────────────────────────
    // TYPES
    // ─────────────────────────────────────────────────────────────

    enum Tier { STARTER, BRONZE, GOLD, DIAMOND }

    struct StudentProfile {
        uint256 completionScore;   // tasks completed as doer
        uint256 completionTotal;   // tasks accepted as doer (denominator)
        uint256 paymentScore;      // tasks paid on time as poster
        uint256 paymentTotal;      // tasks posted (denominator)
        uint256 ratingTotal;       // sum of all 1-5 ratings received
        uint256 ratingCount;       // number of ratings received
        uint256 disputesLost;      // disputes lost (hurts score)
        uint256 disputesTotal;     // total disputes involved in
        uint256 referrals;         // verified referrals
        uint256 totalScore;        // composite 0–1000
        Tier    tier;
        bool    exists;
    }

    // ─────────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────────

    mapping(address => StudentProfile) private _profiles;
    mapping(address => bool) public authorizedContracts;

    // ─────────────────────────────────────────────────────────────
    // EVENTS
    // ─────────────────────────────────────────────────────────────

    event ScoreUpdated(address indexed student, uint256 newScore, Tier newTier);
    event ScorePenalized(address indexed student, uint256 newScore, Tier newTier);
    event ContractAuthorized(address indexed contractAddress);
    event ContractDeauthorized(address indexed contractAddress);

    // ─────────────────────────────────────────────────────────────
    // MODIFIERS
    // ─────────────────────────────────────────────────────────────

    modifier onlyAuthorized() {
        require(authorizedContracts[msg.sender], "OuiScore: caller not authorized");
        _;
    }

    // ─────────────────────────────────────────────────────────────
    // CONSTRUCTOR
    // ─────────────────────────────────────────────────────────────

    constructor() Ownable(msg.sender) {}

    // ─────────────────────────────────────────────────────────────
    // AUTHORIZATION — owner only
    // ─────────────────────────────────────────────────────────────

    /**
     * @notice Authorize a contract to write scores (e.g. OuiEscrow)
     * @param contractAddress Address of contract to authorize
     */
    function authorizeContract(address contractAddress) external onlyOwner {
        require(contractAddress != address(0), "OuiScore: zero address");
        authorizedContracts[contractAddress] = true;
        emit ContractAuthorized(contractAddress);
    }

    /**
     * @notice Revoke a contract's write access
     * @param contractAddress Address to deauthorize
     */
    function deauthorizeContract(address contractAddress) external onlyOwner {
        authorizedContracts[contractAddress] = false;
        emit ContractDeauthorized(contractAddress);
    }

    // ─────────────────────────────────────────────────────────────
    // INTERNAL — profile init
    // ─────────────────────────────────────────────────────────────

    function _ensureProfile(address student) internal {
        if (!_profiles[student].exists) {
            _profiles[student].exists = true;
            _profiles[student].tier = Tier.STARTER;
        }
    }

    // ─────────────────────────────────────────────────────────────
    // SCORE MUTATION — authorized contracts only
    // ─────────────────────────────────────────────────────────────

    /**
     * @notice Record a successful task completion for the doer
     * @param student Address of the student who completed the task
     */
    function incrementCompletion(address student) external onlyAuthorized {
        _ensureProfile(student);
        _profiles[student].completionScore += 1;
        _profiles[student].completionTotal += 1;
        _recalculate(student);
        emit ScoreUpdated(student, _profiles[student].totalScore, _profiles[student].tier);
    }

    /**
     * @notice Record a task acceptance (denominator for completion rate)
     * @param student Address of the student who accepted a task
     */
    function incrementAcceptance(address student) external onlyAuthorized {
        _ensureProfile(student);
        _profiles[student].completionTotal += 1;
        _recalculate(student);
        emit ScoreUpdated(student, _profiles[student].totalScore, _profiles[student].tier);
    }

    /**
     * @notice Record an on-time payment for the poster
     * @param student Address of the student who posted and paid
     */
    function incrementPayment(address student) external onlyAuthorized {
        _ensureProfile(student);
        _profiles[student].paymentScore += 1;
        _profiles[student].paymentTotal += 1;
        _recalculate(student);
        emit ScoreUpdated(student, _profiles[student].totalScore, _profiles[student].tier);
    }

    /**
     * @notice Submit a 1–5 star rating for a student
     * @param student Address being rated
     * @param rating  Rating value between 1 and 5 inclusive
     */
    function submitRating(address student, uint8 rating) external onlyAuthorized {
        require(rating >= 1 && rating <= 5, "OuiScore: rating must be 1-5");
        _ensureProfile(student);
        _profiles[student].ratingTotal += rating;
        _profiles[student].ratingCount += 1;
        _recalculate(student);
        emit ScoreUpdated(student, _profiles[student].totalScore, _profiles[student].tier);
    }

    /**
     * @notice Penalize a student for losing a dispute
     * @param student Address of the student who lost
     */
    function penalizeDispute(address student) external onlyAuthorized {
        _ensureProfile(student);
        _profiles[student].disputesLost += 1;
        _profiles[student].disputesTotal += 1;
        _recalculate(student);
        emit ScorePenalized(student, _profiles[student].totalScore, _profiles[student].tier);
    }

    /**
     * @notice Record a dispute involvement (win or loss — for rate denominator)
     * @param student Address involved in dispute
     */
    function incrementDisputeTotal(address student) external onlyAuthorized {
        _ensureProfile(student);
        _profiles[student].disputesTotal += 1;
        // No recalc needed — disputesTotal alone doesn't change score
    }

    /**
     * @notice Record a verified referral
     * @param referrer Address who made the referral
     */
    function addReferral(address referrer) external onlyAuthorized {
        _ensureProfile(referrer);
        // Cap referral bonus at 50 to prevent farming
        if (_profiles[referrer].referrals < 50) {
            _profiles[referrer].referrals += 1;
        }
        _recalculate(referrer);
        emit ScoreUpdated(referrer, _profiles[referrer].totalScore, _profiles[referrer].tier);
    }

    // ─────────────────────────────────────────────────────────────
    // INTERNAL — score recalculation
    // ─────────────────────────────────────────────────────────────

    /**
     * @dev Recalculate composite score and update tier.
     *
     *  Formula (all sub-scores normalized to 0-100 before weighting):
     *
     *  completionRate   = completionScore / completionTotal  * 100   (30% weight → ×300)
     *  paymentRate      = paymentScore    / paymentTotal     * 100   (25% weight → ×250)
     *  avgRating        = ratingTotal     / ratingCount      * 20    (20% weight → ×200, since max rating=5, ×20 gives 100)
     *  disputePenalty   = (1 - disputesLost/disputesTotal)   * 100   (15% weight → ×150, inverse)
     *  referralScore    = min(referrals, 50)                 * 2     (10% weight → ×100, cap at 50 refs = 100 pts)
     *
     *  totalScore = (cR*300 + pR*250 + aR*200 + dP*150 + rS*100) / 1000
     *
     *  Integer math: multiply numerators first, divide last. No floats.
     */
    function _recalculate(address student) internal {
        StudentProfile storage p = _profiles[student];

        uint256 cR = p.completionTotal > 0
            ? (p.completionScore * 100) / p.completionTotal
            : 0;

        uint256 pR = p.paymentTotal > 0
            ? (p.paymentScore * 100) / p.paymentTotal
            : 0;

        // avgRating normalized: (ratingTotal / ratingCount) * 20
        // ratingTotal / ratingCount gives 1-5, * 20 gives 20-100
        uint256 aR = p.ratingCount > 0
            ? (p.ratingTotal * 20) / p.ratingCount
            : 50; // default 50 for new users (neutral)

        // disputePenalty: inverse of loss rate
        uint256 dP = p.disputesTotal > 0
            ? ((p.disputesTotal - p.disputesLost) * 100) / p.disputesTotal
            : 100; // default 100 (no disputes = perfect)

        // referralScore: each referral = 2 points, max 50 referrals = 100 points
        uint256 rS = p.referrals * 2;
        if (rS > 100) rS = 100;

        uint256 raw = (cR * 300) + (pR * 250) + (aR * 200) + (dP * 150) + (rS * 100);
        p.totalScore = raw / 1000;

        // Tier assignment
        if (p.totalScore >= 800) {
            p.tier = Tier.DIAMOND;
        } else if (p.totalScore >= 600) {
            p.tier = Tier.GOLD;
        } else if (p.totalScore >= 400) {
            p.tier = Tier.BRONZE;
        } else {
            p.tier = Tier.STARTER;
        }
    }

    // ─────────────────────────────────────────────────────────────
    // VIEW FUNCTIONS — public, anyone can read
    // ─────────────────────────────────────────────────────────────

    /**
     * @notice Get a student's composite score
     * @param student Address to query
     * @return Composite score 0–1000
     */
    function getScore(address student) external view returns (uint256) {
        return _profiles[student].totalScore;
    }

    /**
     * @notice Get a student's tier
     * @param student Address to query
     * @return Tier enum value
     */
    function getTier(address student) external view returns (Tier) {
        return _profiles[student].tier;
    }

    /**
     * @notice Check if a student meets a minimum tier requirement
     * @param student  Address to check
     * @param required Minimum tier required
     * @return True if student's tier >= required tier
     */
    function meetsThreshold(address student, Tier required) external view returns (bool) {
        return uint8(_profiles[student].tier) >= uint8(required);
    }

    /**
     * @notice Get a student's full profile
     * @param student Address to query
     */
    function getProfile(address student) external view returns (
        uint256 completionScore,
        uint256 completionTotal,
        uint256 paymentScore,
        uint256 paymentTotal,
        uint256 ratingTotal,
        uint256 ratingCount,
        uint256 disputesLost,
        uint256 referrals,
        uint256 totalScore,
        Tier    tier
    ) {
        StudentProfile storage p = _profiles[student];
        return (
            p.completionScore,
            p.completionTotal,
            p.paymentScore,
            p.paymentTotal,
            p.ratingTotal,
            p.ratingCount,
            p.disputesLost,
            p.referrals,
            p.totalScore,
            p.tier
        );
    }
}
