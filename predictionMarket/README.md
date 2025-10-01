# TON Prediction Market 🎲

A decentralized prediction market smart contract built on TON blockchain using FunC. Users can create markets, place bets on binary outcomes (YES/NO), and claim winnings after resolution.

## 🔗 Deployed Contracts

### Testnet
- **Market #9186**: [kQAHhGh6F6Mq0MFHoZQkOvZJ_OHLaXitijNMl_6Vjw7i-WpW](https://testnet.tonscan.org/address/kQAHhGh6F6Mq0MFHoZQkOvZJ_OHLaXitijNMl_6Vjw7i-WpW)
  - Resolution Time: Oct 2, 2025 20:35 UTC
  - Status: 🟢 Active

### Mainnet
- Coming soon...

## Features

✅ **Binary Prediction Markets** - Create markets with YES/NO outcomes
✅ **Decentralized Betting** - Users can place bets with TON tokens
✅ **Automated Payouts** - Winners claim proportional share of the total pool
✅ **Time-locked Resolution** - Markets can only be resolved after a specified time
✅ **Owner-controlled Resolution** - Market creator determines the winning outcome
✅ **Minimum Bet Protection** - 0.1 TON minimum bet to prevent spam

## How It Works

1. **Create Market**: Deploy a new market with a resolution time (e.g., 24 hours)
2. **Place Bets**: Users bet on YES or NO outcomes (minimum 0.1 TON)
3. **Market Closes**: After resolution time, no more bets accepted
4. **Resolve**: Owner declares the winning outcome
5. **Claim Winnings**: Winners claim their proportional share of the pool

### Payout Formula

Winnings = (Your Bet / Total Winning Bets) × Total Pool

## Project Structure

-   `contracts/` - FunC smart contract source code
-   `wrappers/` - TypeScript wrapper classes for contract interaction
-   `scripts/` - Deployment and interaction scripts
-   `tests/` - Contract tests

## Quick Start

### 1. Build the Contract

```bash
npx blueprint build
```

### 2. Deploy a Market

```bash
npx blueprint run deployMarket
```

Select network (testnet/mainnet) and wallet type. The market will be created with:
- Resolution time: 24 hours from deployment
- Status: Active
- Owner: Your wallet address

### 3. Place a Bet

```bash
npx blueprint run placeBet
```

Enter:
- Market address
- Outcome (YES/NO)
- Bet amount (minimum 0.1 TON)

### 4. Check Market Info

```bash
npx blueprint run getMarketInfo
```

View:
- Market status
- Total bets on each outcome
- Current odds
- Your bet (if any)

### 5. Resolve Market (Owner Only)

```bash
npx blueprint run resolveMarket
```

After resolution time, owner can declare winning outcome.

### 6. Claim Winnings

```bash
npx blueprint run claimWinnings
```

Winners can claim their proportional share of the pool.

## Contract Operations

### Place Bet
- **Opcode**: `op::place_bet`
- **Requirements**: 
  - Market must be active
  - Before resolution time
  - Minimum 0.1 TON
  - Can only bet on same outcome if adding to existing bet

### Resolve Market
- **Opcode**: `op::resolve_market`
- **Requirements**:
  - Only owner can resolve
  - Market must be active
  - After resolution time

### Claim Winnings
- **Opcode**: `op::claim_winnings`
- **Requirements**:
  - Market must be resolved
  - User must have bet on winning outcome
  - Automatically removes bet after claiming

## Get Methods

- `get_id()` - Returns market ID
- `get_market_info()` - Returns (owner, status, resolution_time, winning_outcome, total_yes_bets, total_no_bets)
- `get_user_bet(address)` - Returns (outcome, amount) for a user
- `get_total_pool()` - Returns total amount in the pool

## Storage Structure

```func
ctx_id              // Market ID (32 bits)
ctx_owner           // Owner address
ctx_status          // 0 = active, 1 = resolved
ctx_resolution_time // Unix timestamp
ctx_winning_outcome // 0 = NO, 1 = YES
ctx_total_yes_bets  // Total YES bets (coins)
ctx_total_no_bets   // Total NO bets (coins)
ctx_bets            // Dictionary: address_hash -> (outcome, amount)
```

## Error Codes

- `401` - Market not active
- `402` - Before resolution time
- `403` - Bet amount too low (< 0.1 TON)
- `404` - Invalid outcome
- `405` - Cannot change bet outcome
- `411` - Not market owner
- `412` - Market not active
- `413` - Before resolution time
- `414` - Invalid winning outcome
- `421` - Market not resolved
- `422` - No bet found
- `423` - Bet on losing outcome

## Development

### Run Tests

```bash
npx blueprint test
```

### Add New Contract

```bash
npx blueprint create ContractName
```

## Security Considerations

⚠️ **This is a demonstration contract. Before using in production:**

1. Add comprehensive tests
2. Implement oracle integration for automated resolution
3. Add dispute resolution mechanism
4. Consider multi-sig for owner operations
5. Add time limits for claiming winnings
6. Implement fee mechanism for sustainability
7. Add circuit breakers for emergency stops
8. Conduct professional security audit

## Example Usage

```typescript
import { Market, Outcome } from './wrappers/Market';

// Place a bet on YES
await market.sendPlaceBet(sender, {
    outcome: Outcome.yes,
    value: toNano('1'), // 1 TON
});

// Resolve market (owner only)
await market.sendResolveMarket(sender, {
    winningOutcome: Outcome.yes,
});

// Claim winnings
await market.sendClaimWinnings(sender, {});
```

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ on TON blockchain using Blueprint
