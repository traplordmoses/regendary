# 🏗️ Regendary Bets - Encrypted Prediction Markets on TON

**The Privacy-Preserving SocialFi Platform Revolutionizing Prediction Markets**

## 🎯 Problem Statement

Traditional prediction markets face a critical limitation: **the observer effect kills alpha**. When users submit early insights to seed prediction markets, their profitable strategies become immediately visible to competitors, arbitrage bots, and market manipulators. This transparency paradox means that the most valuable early signals - from the smartest predictors - are systematically withheld, resulting in poorly seeded markets with less accurate pricing.

### The Core Dilemma
- **Early movers get front-run**: Smart money refuses to seed markets when their strategies are transparent
- **Social insights go untapped**: Telegram communities hold massive predictive power but won't expose their alpha
- **Market manipulation thrives**: Transparent positioning enables coordinated attacks on emerging predictions
- **Liquidity fragmentation**: Fear of front-running leads to splintered, illiquid prediction markets

## 💡 Our Solution: FHE-Powered Encrypted Seeding

Regendary Bets leverages **Fully Homomorphic Encryption (FHE)** to solve the transparency paradox. We built infrastructure on TON that enables Telegram users to **seed prediction markets with encrypted insights** - contributing valuable alpha without revealing their strategies until market resolution.

### 🔐 Technical Architecture

#### FHE Infrastructure (`/fhe`)
- **Encrypted computation engine** built with TFHE-rs
- **Key generation system** for secure client/server key pairs
- **Homomorphic operations** on encrypted prediction data
- **State management** for tracking encrypted market positions
- **EigenLayer TEE deployment** for verifiable computation guarantees

#### 🔒 Verifiable Computation with EigenLayer

Our FHE server runs inside **EigenCompute** - EigenLayer's Trusted Execution Environment (TEE) infrastructure. This provides:

- **Hardware-level attestation**: Cryptographic proof that computations run in a secure enclave
- **Tamper-proof execution**: No one (including server operators) can modify or inspect encrypted data
- **Verifiable outputs**: All computation results are cryptographically signed by the TEE
- **Decentralized trust**: Leverages Ethereum's security for deployment transparency
- **Private key management**: Secure mnemonic storage accessible only within the TEE

**Deployment Details:**
- **App Name:** fhe-rust-server
- **App ID:** `0xf67d352B6960AEDF849a85F6fC1BdF144b8c6C25`
- **Network:** Sepolia Testnet (production on Ethereum Mainnet)
- **Server URL:** `http://136.112.25.16:3000`
- **Port:** 3000 (exposed in Dockerfile, bound in main.rs)
- **EVM Address:** `0xDeae376a9c42cf5d4dEb42586A931fa1B402b6d7`
- **Latest Release:** October 1, 2025
- **Registry:** On-chain deployment registry for transparency

This architecture ensures that even if our infrastructure is compromised, user data remains encrypted and computation results remain verifiable. The combination of FHE (for data privacy) and TEEs (for computation integrity) creates a **trustless privacy layer** for prediction markets.

#### TON Mini App Integration
- **TonConnect-ready hooks** for seamless TON wallet integration
- **Telegram Mini App** for intuitive mobile-first experience
- **Real-time prediction market data** with encrypted seeding
- **SocialFi features** leveraging Telegram's network effects

#### Key Capabilities
- **Encrypted market seeding**: Users submit encrypted probability assessments
- **Homomorphic aggregation**: Combine encrypted signals without decryption
- **Privacy-preserving payouts**: Determine winnings without revealing positions
- **Cross-user reputation**: Build track records without exposing strategies

## 🚀 How It Works

### Phase 1: Encrypted Insight Collection
```
1. User connects Telegram → TON wallet
2. Submits encrypted prediction (e.g., "BTC > $100k by EOY: 73% confidence")
3. FHE system processes without revealing underlying data
4. Market receives homomorphic aggregate of all insights
```

### Phase 2: Market Seeding & Pricing
```
1. Smart contracts receive encrypted probability distributions
2. FHE engine computes optimal market parameters
3. Markets launch with superior pricing from encrypted signals
4. No individual user strategy is ever exposed
```

### Phase 3: Resolution & Settlement
```
1. Outcome becomes publicly verifiable
2. FHE system decrypts only the aggregate position data
3. Individual payouts calculated without exposing strategies
4. Users build reputation scores for future markets
```

## 🛠️ Technical Stack

### Backend Infrastructure
- **Rust/Axum**: High-performance FHE computation engine
- **TFHE-rs**: State-of-the-art homomorphic encryption library
- **TON SDK**: Blockchain integration for settlement and reputation

### Frontend Experience
- **Telegram Mini App**: Native mobile experience
- **TonConnect**: TON wallet integration
- **React/Express**: Web interface and bot infrastructure

### Cryptographic Foundation
- **Fully Homomorphic Encryption**: TFHE scheme for arbitrary computation
- **Zero-Knowledge Proofs**: Prove correct computation without revealing data
- **Secure Multi-Party Computation**: Enable collaborative insights

## 🏁 Quick Start

### Local Development
```bash
# Environment setup
cp .env.example .env
# Fill in your BOT_TOKEN and TON credentials

# Install dependencies
npm install
cd fhe && cargo build --release

# Start services
npm run dev              # Web server + Telegram bot
cd fhe && cargo run      # FHE computation engine
```

### Production Deployment

#### Deploy to EigenCompute (Recommended)

The FHE server is deployed to EigenLayer's TEE infrastructure for verifiable computation:

```bash
# Prerequisites
# 1. Install EigenX CLI: curl https://storage.googleapis.com/eigenx-install/install-eigenx.sh | bash
# 2. Docker installed and running
# 3. Sepolia ETH in your wallet for gas fees

# Set up authentication
eigenx auth login  # Or: eigenx auth generate --store
eigenx environment set sepolia

# Deploy FHE server to EigenCompute
cd fhe
eigenx app deploy remsee/fhe-rust-server

# Monitor deployment
eigenx app info fhe-rust-server
eigenx app logs fhe-rust-server

# Manage the app
eigenx app list                    # List all apps
eigenx app stop fhe-rust-server    # Stop the app
eigenx app start fhe-rust-server   # Start the app
eigenx app upgrade fhe-rust-server # Update deployment
```

#### Traditional Deployment (Self-Hosted)

```bash
# Key generation (one-time setup)
cd fhe && cargo run --bin key-gen

# Production build
npm run build
npm start

# Deploy FHE server
cd fhe && cargo build --release
./target/release/fhe
```

**Note:** Self-hosted deployments lack the verifiable computation guarantees provided by EigenCompute TEEs.

## 🎯 Use Cases

### SocialFi Predictions
- **Crypto price movements**: Leverage community wisdom without front-running
- **Sports outcomes**: Pool expertise from thousands of analysts
- **NFT valuation**: Collective valuation models from proven traders
- **Protocol adoption**: Early signals on emerging protocols

### Market Creation
- **Creator royalties**: Earn fees for launching accurate markets
- **Liquidity mining**: Reward early seeders of accurate predictions
- **Reputation scoring**: Build on-chain track records for alpha generation

### Advanced Strategies
- **Algorithmic models**: Submit encrypted signals from quantitative models
- **Sentiment analysis**: Aggregate encrypted social sentiment
- **Insider information**: Contribute privileged insights without exposure
- **Cross-market arbitrage**: Identify market inefficiencies privately

## 🔮 Future Roadmap

### Phase 1: Core Infrastructure ✅
- [x] FHE encryption/decryption system
- [x] Telegram bot integration
- [x] TON Mini App scaffold
- [x] Basic market seeding

### Phase 2: Enhanced Privacy (Q4 2024)
- [ ] Zero-knowledge computation proofs
- [ ] Multi-party computation protocols
- [ ] Private reputation systems
- [ ] Cross-chain privacy bridges

### Phase 3: Advanced Features (Q1 2025)
- [ ] AMM-based prediction markets
- [ ] Synthetic asset creation
- [ ] Options and derivatives
- [ ] DAO governance for market parameters

## 🔐 Why FHE + TEE = Game Changer

The combination of Fully Homomorphic Encryption and Trusted Execution Environments creates unprecedented guarantees:

### Privacy Layer (FHE)
- **Data never decrypted**: Predictions remain encrypted end-to-end
- **Homomorphic operations**: Aggregate encrypted signals without seeing individual values
- **Client-side encryption**: Users encrypt data before it leaves their device
- **Mathematical guarantees**: Cryptographically impossible to extract raw predictions

### Integrity Layer (TEE)
- **Verifiable execution**: Hardware attestation proves code runs unmodified
- **Tamper-proof environment**: Even server operators can't access encrypted data
- **Transparent deployment**: On-chain registry shows exactly what code is running
- **Decentralized trust**: No need to trust a centralized operator

### Combined Benefits
1. **Trustless privacy**: Users don't need to trust us - cryptography and hardware enforce privacy
2. **Verifiable computation**: Anyone can verify that encrypted predictions were processed correctly
3. **Regulatory clarity**: No custody of user data, reducing compliance burden
4. **Attack resistance**: Even if infrastructure is compromised, user data remains secure
5. **Composability**: Other protocols can verify and build on our outputs

## 📊 Competitive Advantages

1. **Technical Moat**: First-mover in FHE-powered prediction markets on TON with TEE guarantees
2. **Network Effects**: Leveraging Telegram's 900M+ user base
3. **Privacy Preservation**: Solving the transparency paradox that plagues others
4. **Superior Pricing**: More accurate markets through hidden alpha aggregation
5. **Verifiable Infrastructure**: EigenLayer TEE deployment provides trustless guarantees
6. **Regulatory Compliance**: Privacy-first approach reduces regulatory risk

## 🤝 Contributing

Regendary Bets is an open-source project. We welcome contributions!

```bash
# Development setup
git clone https://github.com/your-org/regendary-bets
cd regendary-bets
npm install
cd fhe && cargo build

# Run tests
npm test
cd fhe && cargo test
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built with ❤️ for the future of private, decentralized prediction markets.**
