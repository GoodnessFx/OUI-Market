# OUI Market — The Campus Economy Protocol

OUI Market is a professional-grade, Web3-powered marketplace designed specifically for Nigerian university students. It combines traditional e-commerce (Jumia style) with a trustless service economy (Fiverr style) and secure housing deposits.

## 🏗 Architecture

The platform operates on a "Dual-Layer" architecture:
1.  **Invisible Web3 Layer**: Smart contracts on Base/Polygon handle value and trust.
2.  **Professional Fintech Layer**: Traditional UI/UX with card payments and simple login.

### Core Smart Contracts
- **OuiScore.sol**: An on-chain reputation system. It records completion rates, payment reliability, and student ratings. This score is immutable and can be used by external protocols (like hostel owners) to verify student trustworthiness.
- **OuiEscrow.sol**: A non-custodial escrow contract that holds cNGN (Naira stablecoin). It features:
    - **Community Arbitration**: Disputes are resolved by "Diamond Tier" students (highest reputation).
    - **Auto-Release**: Prevents ghosting by automatically releasing funds 48h after submission if no response is received.
    - **Safety Fees**: Minimal fees to maintain the protocol and reward community arbiters.

## 🛡 Security First
- **Non-Custodial**: No admin or backend can touch student funds. Only contract logic moves money.
- **CEI Pattern**: All contracts follow the Checks-Effects-Interactions pattern to prevent reentrancy.
- **SafeERC20**: Uses OpenZeppelin's SafeERC20 to handle all Naira token transfers safely.

## 💳 Account Abstraction (Invisible Blockchain)
OUI Market uses ERC-4337 to make blockchain invisible:
- **Social Login**: Students sign up with Google or Phone (via Privy/Web3Auth).
- **Gas Sponsorship**: The OUI Paymaster covers all gas fees. Students pay 0 gas.
- **Fiat Bridge**: Card payments via Paystack are instantly converted to cNGN and deposited into the student's smart wallet.

## 🚀 Deployment

1.  Configure `.env` using `.env.example`.
2.  Deploy protocol:
    ```bash
    npx hardhat run scripts/deploy.js --network base_mainnet
    ```

## 🛠 Tech Stack
- **Frontend**: React + Tailwind + Framer Motion
- **Smart Contracts**: Solidity + Hardhat
- **Chain**: Base (Primary) / Polygon
- **Wallet**: ERC-4337 Smart Accounts
- **Payments**: Paystack (Fiat In/Out)
