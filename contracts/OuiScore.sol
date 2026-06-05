// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OuiScore
 * @author Oui Market
 * @notice On-chain reputation system for Oui Market campus students.
 *         Immutable, unfakeable, and composable reputation for tasks and housing.
 * @dev    Only authorized contracts (like OuiEscrow) can mutate scores.
 */
contract OuiScore is Ownable {

    enum Tier { STARTER, BRONZE, GOLD, DIAMOND }

    struct StudentProfile {
        uint256 completionScore;   // Successfully completed tasks
        uint256 paymentScore;      // Paid on time as poster
        uint256 ratingTotal;       // Sum of ratings received
        uint256 ratingCount;       // Count of ratings received
        uint256 disputesLost;      // Lost disputes (hurts score)
        uint256 referrals;         // Verified referrals
        uint256 totalScore;        // Composite score 0–1000
        Tier tier;
        bool exists;
    }

    mapping(address => StudentProfile) private _profiles;
    mapping(address => bool) public authorizedContracts;

    event ScoreUpdated(address indexed student, uint256 newScore, Tier newTier);
    event ScorePenalized(address indexed student, uint256 newScore, Tier newTier);
    event ContractAuthorized(address indexed contractAddress);
    event ContractDeauthorized(address indexed contractAddress);

    modifier onlyAuthorized() {
        require(authorizedContracts[msg.sender] || msg.sender == owner(), "OuiScore: Not authorized");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Authorize a contract to update scores.
     */
    function authorizeContract(address contractAddress) external onlyOwner {
        require(contractAddress != address(0), "OuiScore: Zero address");
        authorizedContracts[contractAddress] = true;
        emit ContractAuthorized(contractAddress);
    }

    function deauthorizeContract(address contractAddress) external onlyOwner {
        authorizedContracts[contractAddress] = false;
        emit ContractDeauthorized(contractAddress);
    }

    /**
     * @notice Increment task completion score for a student.
     */
    function incrementCompletion(address student) external onlyAuthorized {
        _ensureProfile(student);
        _profiles[student].completionScore++;
        recalculate(student);
    }

    /**
     * @notice Increment payment reliability score for a student.
     */
    function incrementPayment(address student) external onlyAuthorized {
        _ensureProfile(student);
        _profiles[student].paymentScore++;
        recalculate(student);
    }

    /**
     * @notice Submit a 1-5 rating for a student.
     */
    function submitRating(address student, uint8 rating) external onlyAuthorized {
        require(rating >= 1 && rating <= 5, "OuiScore: Rating 1-5 only");
        _ensureProfile(student);
        _profiles[student].ratingTotal += rating;
        _profiles[student].ratingCount++;
        recalculate(student);
    }

    /**
     * @notice Penalize score for losing a dispute.
     */
    function penalizeDispute(address student) external onlyAuthorized {
        _ensureProfile(student);
        _profiles[student].disputesLost++;
        recalculate(student);
        emit ScorePenalized(student, _profiles[student].totalScore, _profiles[student].tier);
    }

    /**
     * @notice Add a verified referral.
     */
    function addReferral(address referrer) external onlyAuthorized {
        _ensureProfile(referrer);
        _profiles[referrer].referrals++;
        recalculate(referrer);
    }

    /**
     * @notice Composite score calculation:
     * totalScore = ((completion * 300) + (payment * 250) + (avgRating * 200) + (referrals * 100) - (disputes * 150)) / scale
     * Simplified for production grade with scale.
     */
    function recalculate(address student) public {
        StudentProfile storage p = _profiles[student];
        
        uint256 compRate = p.completionScore * 10; // Simple scale
        uint256 payRate = p.paymentScore * 10;
        uint256 avgRating = p.ratingCount == 0 ? 0 : (p.ratingTotal * 100) / p.ratingCount;
        uint256 referralScore = p.referrals * 20;
        uint256 penalty = p.disputesLost * 150;

        uint256 score = ((compRate * 300) + (payRate * 250) + (avgRating * 200) + (referralScore * 100));
        
        if (score > penalty) {
            p.totalScore = (score - penalty) / 100;
        } else {
            p.totalScore = 0;
        }

        if (p.totalScore > 1000) p.totalScore = 1000;

        // Tier thresholds
        if (p.totalScore >= 800) p.tier = Tier.DIAMOND;
        else if (p.totalScore >= 600) p.tier = Tier.GOLD;
        else if (p.totalScore >= 400) p.tier = Tier.BRONZE;
        else p.tier = Tier.STARTER;

        emit ScoreUpdated(student, p.totalScore, p.tier);
    }

    function getScore(address student) external view returns (uint256) {
        return _profiles[student].totalScore;
    }

    function getTier(address student) external view returns (Tier) {
        return _profiles[student].tier;
    }

    function meetsThreshold(address student, Tier required) external view returns (bool) {
        return _profiles[student].tier >= required;
    }

    function _ensureProfile(address student) internal {
        if (!_profiles[student].exists) {
            _profiles[student].exists = true;
        }
    }
}
