# CodeProof - Blockchain Code Authentication

A web platform that allows developers to prove code authorship immutably on the Ethereum blockchain. Register your code, get a SHA-256 hash, and store it permanently with your wallet address and timestamp.

## 🎯 Features (Phase 1)

- ✅ **Smart Contract**: Solidity contract for registering and verifying code hashes
- ✅ **Code Editor**: Paste code and generate SHA-256 hash locally (browser-side)
- ✅ **Blockchain Registration**: Register hash on Ethereum Sepolia testnet
- ✅ **Code Verification**: Verify code against registered hashes
- ✅ **MetaMask Integration**: Connect wallet and sign transactions
- ✅ **Responsive Design**: Dark professional theme for developers
- ✅ **TypeScript**: Full type safety throughout the project
- ✅ **Tailwind CSS**: Modern, clean styling

## 🛠️ Tech Stack

- **Frontend + Backend**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Smart Contracts**: Solidity with Hardhat
- **Blockchain Interaction**: ethers.js v6
- **Database** (Phase 2): PostgreSQL with Prisma ORM
- **Authentication** (Phase 2): NextAuth.js with MetaMask
- **PDF Generation** (Phase 2): jsPDF

## 📁 Project Structure

```
codeproof/
├── contracts/
│   └── CodeRegistry.sol          # Main smart contract
├── scripts/
│   └── deploy.ts                 # Deployment script
├── test/
│   └── CodeRegistry.test.ts      # Smart contract tests
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout with navbar
│   │   ├── page.tsx              # Landing page
│   │   ├── register/             # Code registration
│   │   ├── verify/               # Code verification
│   │   ├── dashboard/            # User dashboard (Phase 2)
│   │   └── api/                  # API endpoints (Phase 2)
│   ├── components/
│   │   ├── CodeEditor.tsx        # Code input with line numbers
│   │   ├── HashDisplay.tsx       # Hash visualization
│   │   ├── WalletConnect.tsx     # MetaMask connection
│   │   ├── CertificateCard.tsx   # Registration display
│   │   └── Navbar.tsx            # Navigation bar
│   ├── lib/
│   │   ├── hash.ts               # SHA-256 hash generation
│   │   ├── ethereum.ts           # Blockchain interactions
│   │   ├── prisma.ts             # Database client (Phase 2)
│   │   └── pdf.ts                # PDF certificate generation (Phase 2)
│   └── types/
│       └── index.ts              # TypeScript type definitions
├── prisma/
│   └── schema.prisma             # Database schema (Phase 2)
├── hardhat.config.ts             # Hardhat configuration
├── .env.example                  # Environment variables template
└── package.json                  # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Sepolia testnet ETH (get from [faucet](https://sepoliafaucet.com))

### Installation

1. **Clone and install**:
```bash
cd codeproof
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local` with:
- `SEPOLIA_RPC_URL`: Your Infura/Alchemy RPC endpoint
- `PRIVATE_KEY`: Your wallet private key (for deployment only)
- `NEXT_PUBLIC_CONTRACT_ADDRESS`: Smart contract address (after deployment)

3. **Compile smart contracts**:
```bash
npm run hardhat:compile
```

4. **Deploy contract to Sepolia** (optional - contract already deployed):
```bash
npm run deploy:sepolia
```

Note: After deployment, update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`

5. **Run development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📝 Usage

### Register Code

1. Navigate to `/register`
2. Paste your code in the editor
3. Click "Generate Hash" (creates SHA-256 locally)
4. Enter project name and description
5. Click "Connect MetaMask" if not already connected
6. Click "Register on Blockchain"
7. Sign transaction in MetaMask
8. ✅ Code is registered with immutable proof!

### Verify Code

1. Go to `/verify`
2. **Method 1**: Paste code + enter hash to verify match
3. **Method 2**: Just enter a hash to check if registered
4. View author, timestamp, and metadata

## 🧪 Testing

Run smart contract tests:
```bash
npm test
```

Tests cover:
- Code registration
- Duplicate prevention
- Hash verification
- Registration queries

## 📚 API Endpoints (Phase 2)

- `GET /api` - Health check
- `GET /api/verify?hash=...` - Verify hash registration
- `POST /api/register` - Save registration to database

## 🔐 Security & Privacy

- ✅ Code **never** sent to server - hash generated client-side
- ✅ Only SHA-256 hash stored on blockchain
- ✅ Original code stays on user's computer
- ✅ Public verification without revealing code
- ✅ All transactions signed by user's wallet

## 📋 Smart Contract

**CodeRegistry.sol** functions:

```solidity
// Register code with hash and metadata
registerCode(string hash, string metadata)

// Verify code registration
verifyCode(string hash) → (address author, uint256 timestamp, string metadata)

// Check if hash registered
isCodeRegistered(string hash) → bool
```

## 🏗️ Development Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run test             # Run smart contract tests
npm run deploy:sepolia   # Deploy to Sepolia testnet
npm run hardhat:compile  # Compile Solidity contracts
```

## 📖 Phase 2 Roadmap

- 🔄 User Dashboard with registration history
- 📄 PDF certificate generation and download
- 🤝 GitHub OAuth integration
- 💳 Lemon Squeezy payment integration
- 📧 Email/password authentication alternative
- 🗄️ Full PostgreSQL + Prisma integration
- 📱 Mobile-responsive improvements
- 🌍 Web3 analytics

## 🔗 Useful Links

- [Sepolia Etherscan](https://sepolia.etherscan.io) - View transactions
- [Infura](https://infura.io) - RPC endpoint provider
- [Solidity Docs](https://docs.soliditylang.org) - Smart contract docs
- [ethers.js Docs](https://docs.ethers.org) - Blockchain library
- [Next.js Docs](https://nextjs.org/docs) - Framework docs

## 📄 License

MIT

## 🤝 Contributing

Phase 1 complete! Phase 2 development in progress. Contributions welcome for future phases.

---

**Built with ❤️ for developers who care about code ownership**
