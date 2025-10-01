# FHE Computation Server

This is the Fully Homomorphic Encryption (FHE) computation server for Regendary Bets, deployed on **EigenLayer's EigenCompute** infrastructure for verifiable computation guarantees.

## 🔒 Architecture

The FHE server provides encrypted computation capabilities for prediction markets:

- **Encrypted predictions**: Process user predictions without decrypting them
- **Homomorphic aggregation**: Combine multiple encrypted signals
- **Secure key management**: Client/server keys stored securely in TEE
- **Verifiable execution**: All computations run in EigenLayer's Trusted Execution Environment

## 🚀 Deployment

### EigenCompute Deployment (Production)

Our FHE server is deployed to EigenLayer's TEE infrastructure:

**Current Deployment:**
- **App Name:** fhe-rust-server
- **App ID:** `0xf67d352B6960AEDF849a85F6fC1BdF144b8c6C25`
- **Network:** Sepolia Testnet
- **EVM Address:** `0xDeae376a9c42cf5d4dEb42586A931fa1B402b6d7`
- **Solana Address:** `4EA3poPpFYUqfrRuHkhp1iNj3idxzjAy9UvSBGrj5417`
- **Status:** Running in secure TEE enclave

### Deploy/Update Instructions

```bash
# Prerequisites
# 1. Install EigenX CLI: curl https://storage.googleapis.com/eigenx-install/install-eigenx.sh | bash
# 2. Docker installed and running (with buildx plugin)
# 3. Sepolia ETH in your wallet for gas fees

# Set up authentication
eigenx auth login
eigenx environment set sepolia

# Deploy or update the FHE server
eigenx app deploy remsee/fhe-rust-server

# Monitor deployment (wait 30-90 seconds for deployment)
eigenx app info fhe-rust-server
eigenx app logs fhe-rust-server

# Management commands
eigenx app list                    # List all deployed apps
eigenx app stop fhe-rust-server    # Stop the server
eigenx app start fhe-rust-server   # Start the server
eigenx app upgrade fhe-rust-server # Update to latest code
eigenx app terminate fhe-rust-server # Permanently remove
```

## 🛠️ Local Development

### Build and Run Locally

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Build the project
cargo build --release

# Run locally
cargo run --release

# Run tests
cargo test
```

The server will start on `http://0.0.0.0:3000`

### Docker Build (Local Testing)

```bash
# Build Docker image
docker build -t fhe-rust-server .

# Run container
docker run -p 3000:3000 fhe-rust-server
```

## 📦 Dependencies

- **axum** (0.7): High-performance web framework
- **tokio** (1.0): Async runtime
- **tfhe** (0.11.1): Fully Homomorphic Encryption library
- **bincode** (1.3.3): Binary serialization
- **serde** (1.0): Serialization framework

## 🔐 Security Features

### EigenCompute TEE Benefits

1. **Hardware Attestation**: Cryptographic proof that code runs unmodified in secure enclave
2. **Memory Encryption**: All data in memory is encrypted by hardware
3. **Sealed Storage**: Keys and secrets accessible only within the TEE
4. **Remote Attestation**: Anyone can verify the integrity of running code
5. **On-chain Registry**: Deployment details recorded on Ethereum for transparency

### FHE Security Guarantees

1. **End-to-end Encryption**: Data encrypted on client, never decrypted on server
2. **Homomorphic Operations**: Compute on encrypted data without decryption
3. **Zero-Knowledge**: Server learns nothing about individual predictions
4. **Cryptographic Proofs**: Mathematical guarantees of privacy

## 🏗️ Project Structure

```
fhe/
├── src/
│   ├── main.rs           # Server entry point
│   ├── fhe/
│   │   ├── mod.rs        # FHE module exports
│   │   └── key_gen.rs    # Key generation utilities
│   └── handlers/
│       ├── mod.rs        # Handler exports
│       └── pred.rs       # Prediction handlers
├── Cargo.toml            # Rust dependencies
├── Dockerfile            # Multi-stage Docker build
├── .dockerignore         # Docker build exclusions
└── README.md             # This file
```

## 🔄 Update Workflow

When you make changes to the FHE server:

1. **Test locally**: `cargo run` and verify functionality
2. **Commit changes**: `git commit -am "Update FHE server"`
3. **Deploy to EigenCompute**: `eigenx app upgrade fhe-rust-server`
4. **Verify deployment**: `eigenx app logs fhe-rust-server`

## 📊 Monitoring

```bash
# Check app status
eigenx app info fhe-rust-server

# Stream logs in real-time
eigenx app logs fhe-rust-server

# Check resource usage (if available)
eigenx app stats fhe-rust-server
```

## 🐛 Troubleshooting

### Build Failures

**Issue**: Rust version too old
```bash
# Update Rust to latest stable
rustup update stable
```

**Issue**: Docker buildx not found
```bash
# Install Docker buildx plugin
mkdir -p ~/.docker/cli-plugins
curl -L "https://github.com/docker/buildx/releases/download/v0.12.0/buildx-v0.12.0.linux-amd64" \
  -o ~/.docker/cli-plugins/docker-buildx
chmod +x ~/.docker/cli-plugins/docker-buildx
```

### Deployment Failures

**Issue**: Not allowlisted
- Fill out the EigenX access form
- Contact @gajesh on Discord for approval

**Issue**: Insufficient funds
- Get Sepolia ETH from faucets:
  - [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
  - [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)

## 📚 Resources

- [TFHE-rs Documentation](https://docs.zama.ai/tfhe-rs)
- [EigenLayer Documentation](https://docs.eigenlayer.xyz/)
- [Axum Web Framework](https://docs.rs/axum/latest/axum/)
- [Rust Book](https://doc.rust-lang.org/book/)

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

---

**Built with ❤️ for trustless, private prediction markets.**
