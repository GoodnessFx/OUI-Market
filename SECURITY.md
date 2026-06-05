# OuiEscrow — Security Architecture

## Every attack vector. What it is. How we stop it.

This document explains every serious smart contract vulnerability class and exactly how OuiEscrow and OuiScore are hardened against each one. Read this before touching the contracts in production.

---

## 1. EIP-712 — Typed Structured Data Signing

### What it is
When a user signs something off-chain (like authorising a transaction before it hits the blockchain), naive implementations just sign a raw hash. The problem: a malicious app can show you "Sign to log in" but actually get you to sign a transaction that drains your wallet. You never know what you're actually signing.

EIP-712 solves this by defining a **typed, human-readable signature format**. The signature includes the contract name, version, chain ID, and contract address — so a signature made for OuiEscrow on Base cannot be replayed on a different chain, a different contract, or a different version.

### How we stop it
```solidity
// Our contract inherits EIP712 from OpenZeppelin
constructor(...) EIP712("OuiEscrow", "1") { }

// The typehash commits to every field — nothing can be swapped
bytes32 public constant CREATE_TASK_TYPEHASH = keccak256(
    "CreateTask(address poster,uint256 amount,uint256 duration,uint256 nonce,uint256 deadline)"
);
```

Every off-chain signature includes:
- **Domain separator**: chain ID + contract address + name + version — replay across chains impossible
- **Nonce**: increments per user — replay of the same signature impossible
- **Deadline**: signature expires — stale signature attacks impossible
- **Typed fields**: frontend wallets like MetaMask show humans exactly what they're signing

If a signature was made for testnet, it cannot be used on mainnet. If it was used once, it cannot be used again. If it expired, it is dead.

---

## 2. Fee on Transfer Tokens

### What it is
Some ERC-20 tokens secretly deduct a fee during transfer. If you call `token.transferFrom(user, contract, 1000)`, the contract might only receive 990 because the token took 10 as a fee. If your contract records that 1000 was locked but only 990 arrived, the accounting is broken. An attacker can exploit this to drain funds from other users.

cNGN does not currently have transfer fees, but this is still guarded because:
1. cNGN could be upgraded
2. Anyone might fork this contract for a token that does charge fees
3. It's a zero-cost protection

### How we stop it
```solidity
// Balance check before and after every transferFrom
uint256 balBefore = cNGN.balanceOf(address(this));
cNGN.safeTransferFrom(msg.sender, address(this), totalPull);
uint256 balAfter  = cNGN.balanceOf(address(this));
uint256 received  = balAfter - balBefore;

// Hard revert if what arrived doesn't match what was asked
if (received != totalPull)
    revert AmountMismatch(totalPull, received);
```

The task amount locked in state is only ever what we actually received. No assumptions. No trust.

---

## 3. Reentrancy — Standard and Read-Only

### What standard reentrancy is
The most famous DeFi attack. Contract A calls Contract B (like a token transfer). Before Contract A finishes, Contract B calls back into Contract A again — while Contract A's state is still mid-update. The attacker drains funds in a loop before the balance is set to zero.

The DAO hack (2016, $60M lost) was reentrancy. Cream Finance (2021, $130M). It keeps happening.

### What read-only reentrancy is
A newer, subtler variant. Contract B doesn't need to write anything — it just reads Contract A's state during the reentrant call. If Contract A hasn't updated its state yet (because the interaction happened before the effect), Contract B reads a stale inflated balance and makes decisions based on lies.

### How we stop both
**ReentrancyGuard on every fund-moving function:**
```solidity
function approveWork(uint256 taskId) external nonReentrant { ... }
function claimRefund(uint256 taskId) external nonReentrant { ... }
function castDisputeVote(uint256 taskId, ...) external nonReentrant { ... }
```

**CEI pattern (Checks → Effects → Interactions) strictly enforced:**
```solidity
function approveWork(uint256 taskId) external nonReentrant {
    // CHECKS — all require/revert first
    if (msg.sender != t.poster) revert NotPoster(taskId);
    if (t.state != State.SUBMITTED) revert WrongState(...);

    // EFFECTS — state updated BEFORE any external call
    t.state = State.APPROVED;
    uint256 payout = t.amount - t.platformFee;

    // INTERACTIONS — money moves last
    cNGN.safeTransfer(doer, payout);
    cNGN.safeTransfer(treasury, fee);
}
```

By the time any external call (token transfer) happens, the contract state already reflects the final result. A reentrant call would see `State.APPROVED` and revert on any state check. The loop is broken before it starts.

No state is read after an external call, eliminating read-only reentrancy risk.

---

## 4. Liquidation Cascades

### What it is
In DeFi protocols with price-dependent collateral, a price drop triggers liquidations, which drop the price further, which triggers more liquidations — a death spiral. Borrow protocols (Compound, Aave) are exposed to this. Amplified in thin liquidity markets.

### Why we're immune
OuiEscrow is not a lending protocol. There is no collateral, no liquidation mechanism, no price oracle, and no leverage. Funds locked in escrow are fixed amounts of cNGN committed at task creation time. They cannot be liquidated. The only ways funds move are:
- Poster approves → doer gets paid
- Auto-release fires → doer gets paid
- Deadline passes with no delivery → poster refunded
- Dispute resolved by arbiters → winner paid

None of these paths are price-dependent. No cascade is possible.

What we do guard against in the cNGN context: if cNGN itself depegs from Naira, users bear that FX risk. This is disclosed in the README. The contract's accounting in cNGN units remains correct regardless.

---

## 5. Sequencer Failures (L2-specific)

### What it is
On Layer 2 chains like Base and Polygon, transactions don't go directly to Ethereum. They go through a **sequencer** — a centralized server that orders transactions before posting them to L1. If the sequencer goes down, transactions can't be submitted. If it comes back with a long backlog, time-sensitive operations (like deadline checks) can behave unexpectedly because `block.timestamp` on L2 depends on the sequencer's clock.

An attacker can exploit this: if they know the sequencer is about to go down, they can submit a task with a very short deadline, let the sequencer downtime cause the deadline to pass, and then claim a refund on a task a doer legitimately completed.

### How we stop it
**Minimum task duration**: There is no minimum enforced in the contract currently for the lowest tier — this should be set to at least 1 hour in production to prevent microsecond deadline games.

**Grace period on deadlines**: The `claimRefund` function only allows refund if the deadline has passed. On Base/Polygon, if the sequencer has been down, the L2 block timestamp lags. This actually protects doers — the deadline appears not to have passed even if real-world time says it has.

**For production**: Integrate Chainlink's L2 Sequencer Uptime Feed on Base:
```solidity
// Add to constructor and claimRefund
AggregatorV2V3Interface internal sequencerUptimeFeed;

function _checkSequencer() internal view {
    (, int256 answer, uint256 startedAt,,) = sequencerUptimeFeed.latestRoundData();
    require(answer == 0, "Sequencer is down");
    require(block.timestamp - startedAt > GRACE_PERIOD, "Sequencer grace period active");
}
```

This is flagged for v2.

---

## 6. Storage Collision

### What it is
In upgradeable proxy contracts, the proxy and the implementation contract share storage slots. If a new implementation adds a variable in the same slot as the proxy's `_implementation` address, writing to that variable overwrites the proxy's logic address and bricks the contract permanently. Multiple major hacks have happened this way.

### Why we're immune
**OuiEscrow and OuiScore are not upgradeable proxies.** There is no `delegatecall`. There is no proxy pattern. Each contract is deployed once, is final, and owns its own storage layout completely.

This is a deliberate architectural decision. Upgradeability introduces complexity and centralization risk. If bugs are found, a new contract is deployed and the old one is deprecated. Users are migrated with a clear migration path.

The tradeoff: no silent fixes. Every change is transparent and requires user action. For a trust-based system, this is the right tradeoff.

---

## 7. Read-Only Reentrancy

### What it is
A specific reentrancy variant where an attacker doesn't need write access to cause damage. During a callback from Contract A's token transfer, the attacker's Contract B calls a `view` function on Contract A. If Contract A hasn't finished updating its state, the view function returns stale data. Contract B uses that stale data (like an inflated balance) to make a malicious decision in another protocol.

This affected Curve Finance and other protocols that used pool balances as price oracles mid-execution.

### How we stop it
The protection comes from strict CEI. By the time any `safeTransfer` or `safeTransferFrom` is called in OuiEscrow, all state changes are already finalized. A reentrant `getTask()` call would read the already-updated `State.APPROVED` (or whatever final state), not a stale intermediate state.

```solidity
// State is APPROVED before transfer
t.state = State.APPROVED;   // ← state written here

// Only now does external call happen
cNGN.safeTransfer(doer, payout);   // ← any reentrancy reads APPROVED, not SUBMITTED
```

No OuiEscrow view function returns information that could be used to extract value in a read-only reentrancy attack, because there's nothing to extract — we don't offer flash loans, don't use our own balances as collateral, and don't integrate with any protocol that would.

---

## 8. Gas Limit DoS

### What it is
An attacker engineers a transaction that runs out of gas, or crafts inputs that make a function consume unbounded gas, preventing legitimate users from completing operations. Two common forms:

**Unbounded loops**: A function iterates over an array that an attacker can grow to an arbitrary size (by adding entries). Each call to that function costs more gas until it hits the block gas limit and reverts for everyone.

**Forced failure via gas griefing**: An attacker sends a small amount of gas to a contract that passes calls to a sub-contract. The sub-contract runs out of gas and reverts, causing the parent to revert too — even if the parent had enough gas.

### How we stop it

**No unbounded loops**: The only loop-adjacent structure in OuiEscrow is the arbiter voting mechanism. It is capped at exactly 5 arbiters by a constant:
```solidity
uint256 public constant MAX_ARBITERS = 5;

if (totalVotes >= MAX_ARBITERS) revert MaxArbitersReached(taskId);
```

Dispute resolution is O(1). No matter how many tasks exist, resolution always costs a fixed amount of gas.

**O(1) arbiter lookup**: Voted-status is tracked in a nested mapping, not an array. Checking if an arbiter has voted is a single `SLOAD`, not a loop.
```solidity
mapping(uint256 => mapping(address => bool)) private _hasVoted;
// O(1) read and write
```

**No external calls in loops**: Every external call (token transfer, score update) is a single standalone call. No arrays of recipients.

**Custom errors over require strings**: Custom errors (`revert NotPoster(taskId)`) cost less gas than string require statements, reducing the risk of gas exhaustion on legitimate transactions.

---

## 9. MEV and Randomness

### What it is
**MEV (Miner/Maximal Extractable Value)**: Block producers (validators/miners) can see all pending transactions in the mempool before they're included in a block. They can reorder, insert, or censor transactions to extract value. Front-running (inserting a buy before a large purchase), sandwich attacks (buy before + sell after a large swap), and back-running are all MEV forms.

**On-chain randomness**: Using `block.timestamp`, `block.number`, `blockhash`, or similar for randomness is insecure because validators can manipulate these values within limits, and MEV bots can simulate outcomes before committing.

### Why MEV is minimal here
OuiEscrow is a **bilateral escrow**, not an AMM or order book. There is no price to front-run. There is no slippage to exploit. The only MEV-adjacent surface is:

- **Task acceptance**: A fast bot could monitor `TaskCreated` events and front-run human doers to accept high-value tasks. Mitigation: OuiScore tier gating means bots with no score history cannot accept gated tasks. High-value tasks require Gold or Diamond tier — a score earned only through real history.
- **Dispute votes**: A Diamond-tier user could watch a dispute vote and copy the majority to be on the winning side. This is not actually harmful — both parties want the most informed arbiter vote. Mimicking the majority is fine.

**No on-chain randomness used anywhere.** The contract contains zero instances of `block.timestamp` for randomness, `blockhash`, or pseudo-random number generation. `block.timestamp` is used only for deadline comparison, which is its legitimate and safe use case.

---

## 10. Governance Risk

### What it is
Many DeFi protocols have governance tokens that let holders vote on protocol changes. An attacker who accumulates enough tokens (or flash-loans them) can pass a malicious governance proposal that drains the treasury, changes fee parameters to absurd values, or upgrades the contract to a backdoored version.

This is known as a governance attack and has affected Beanstalk ($182M drained in 2022 via flash loan governance attack).

### How we're structured
OuiEscrow and OuiScore have **no governance token**. There is no voting mechanism. There is no DAO. The contracts are `Ownable` — controlled by a single owner key.

Owner-only capabilities are intentionally minimal:
- `setTreasury(address)` — change fee recipient
- `authorizeContract(address)` on OuiScore — add new escrow contracts
- `deauthorizeContract(address)` on OuiScore — remove old ones

**The owner cannot**:
- Release funds from any task
- Change fee percentages
- Change task state
- Cancel tasks
- Access locked funds

The economic parameters (8% platform fee, 1.5% escrow fee, 500 cNGN dispute fee) are immutable constants. No governance vote can change them without a full redeployment with user migration.

**For production**: The owner key should be a hardware wallet (Ledger/Trezor) or a Gnosis Safe multisig with 2-of-3 or 3-of-5 signers. Single EOA ownership is a centralization risk.

---

## 11. Formal Specification

### What it is
Formal verification is the mathematical proof that a smart contract does exactly what its specification says — nothing more, nothing less. Instead of tests (which only check scenarios you thought of), formal verification explores all possible states.

Tools include:
- **Certora Prover** — industry standard, used by Aave, Compound, MakerDAO
- **Halmos** — symbolic execution for Foundry
- **Echidna** — fuzzing tool that finds edge cases
- **Mythril** — static analysis for common vulnerability patterns

### Our current state
OuiEscrow v1 ships with:
- Hardhat unit tests covering all happy paths and attack scenarios
- Manual security review against the OWASP Smart Contract Top 10
- All vulnerability mitigations documented in this file

### For a full audit (before mainnet launch with real money)
These invariants should be formally verified:

```
Invariant 1: Conservation of funds
  For every task: sum of all possible outflows = amount + escrowFee
  (No cNGN can be created or destroyed by the contract)

Invariant 2: State machine correctness
  OPEN → LOCKED → SUBMITTED → {APPROVED, DISPUTED, REFUNDED}
  No state can transition backwards
  No terminal state (APPROVED, RESOLVED, REFUNDED) can transition forward

Invariant 3: Authorization
  Only poster can call approveWork
  Only doer can call submitWork
  Only Diamond tier can vote on disputes
  No user can write their own OuiScore

Invariant 4: Fee math
  platformFee = amount * 800 / 10000 (exactly, no rounding attack)
  escrowFee   = amount * 150 / 10000
  payout      = amount - platformFee (always, in all code paths)

Invariant 5: No double spend
  Each task's funds can only be released once
  APPROVED and RESOLVED are both terminal — no second release
```

A Certora audit costs roughly $20,000–$50,000 USD. Before going above $1M TVL, this is mandatory.

---

## Summary Hardening Checklist

| Vulnerability | Status | Method |
|---|---|---|
| EIP-712 typed signing | ✅ Implemented | OpenZeppelin EIP712 + nonce + deadline |
| Fee on Transfer | ✅ Guarded | Balance-before/after check on every transferFrom |
| Standard Reentrancy | ✅ Guarded | ReentrancyGuard + CEI pattern |
| Read-Only Reentrancy | ✅ Guarded | State finalized before all external calls |
| Liquidation Cascades | ✅ N/A | No price dependency, no collateral |
| Sequencer Failures | ⚠️ Partial | Chainlink uptime feed flagged for v2 |
| Storage Collision | ✅ N/A | No upgradeable proxy, no delegatecall |
| Gas Limit DoS | ✅ Guarded | MAX_ARBITERS=5, O(1) lookups, no unbounded loops |
| MEV Front-running | ✅ Mitigated | OuiScore tier gating eliminates bot advantage |
| On-chain Randomness | ✅ N/A | Zero random number usage |
| Governance Attack | ✅ Minimal surface | No governance token, immutable fee constants |
| Formal Verification | ⚠️ Planned | Pre-audit v1, Certora before $1M TVL |
| SafeERC20 | ✅ Implemented | All transfers via SafeERC20 |
| Access Control | ✅ Implemented | Ownable + authorized contract mapping |
| Integer Overflow | ✅ N/A | Solidity 0.8.24 built-in overflow protection |

---

*Last updated: Oui Market v1.0 — contracts not yet audited. Deploy to testnet only until formal audit is complete.*
