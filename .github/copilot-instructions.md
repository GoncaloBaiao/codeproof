# CodeProof Project Instructions

## Project Overview
CodeProof is a blockchain-based platform for proving code authorship on Ethereum. Phase 1 implements the core smart contract, frontend for code registration and verification, and MetaMask wallet integration.

## Project Phases

### Phase 1 (COMPLETE ✓)
- Smart contract for code registration
- Code editor with SHA-256 hash generation
- Blockchain registration via MetaMask
- Code verification interface
- Landing page and dashboard placeholder

### Phase 2 (Next)
- PostgreSQL database integration
- User authentication with NextAuth.js
- Dashboard with registration history
- PDF certificate generation
- GitHub integration

### Phase 3 (Future)
- Public API for third-party integration
- CLI tool for terminal-based registration
- Multi-chain support (Polygon, Base)

## Key Technologies
- **Frontend**: Next.js 14 App Router + React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Smart Contracts**: Solidity 0.8.19 + Hardhat
- **Blockchain**: ethers.js v6
- **Database** (Phase 2): PostgreSQL + Prisma
- **Auth** (Phase 2): NextAuth.js

## Critical Project Rules

### Security & Privacy
1. Code is NEVER sent to server - hash generated client-side only
2. Only SHA-256 hash stored on blockchain
3. MetaMask transactions must be user-signed
4. Environment variables for sensitive data only

### Code Organization
1. All components are client components ("use client")
2. Utility functions in `src/lib/` with clear exports
3. Types defined in `src/types/index.ts`
4. API routes are placeholders for Phase 2
5. Solidity files commented explaining each function

### Deployment
1. Smart contract deploys to Sepolia testnet
2. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` after deployment
3. RPC endpoint from Infura or Alchemy required
4. Private key needed only for deployment, never committed

## Running the Project

```bash
# Development
npm run dev          # Start at http://localhost:3000

# Smart contracts
npm run hardhat:compile   # Compile Solidity
npm test             # Run contract tests
npm run deploy:sepolia    # Deploy to Sepolia

# Production
npm run build
npm run start
```

## File Structure Key

- `contracts/CodeRegistry.sol` - Main smart contract
- `src/app/page.tsx` - Landing page
- `src/app/register/page.tsx` - Code registration UI
- `src/app/verify/page.tsx` - Code verification UI
- `src/lib/hash.ts` - SHA-256 hash generation (client-side)
- `src/lib/ethereum.ts` - Blockchain interactions
- `.env.example` - Template for environment variables
- `prisma/schema.prisma` - Database schema (Phase 2)

## Next Steps for Phase 2

1. Set up PostgreSQL database
2. Implement Prisma migrations
3. Add NextAuth.js configuration
4. Create user authentication routes
5. Implement dashboard with query
6. Add PDF certificate generation
7. Connect GitHub OAuth

## Important Notes

- All smart contract state changes are immutable once registered
- Hashes cannot be re-registered (duplicate prevention)
- Metadata is stored as JSON string on blockchain
- Testing uses local Hardhat network before Sepolia deployment
- No external APIs required for Phase 1 (pure blockchain)

## Troubleshooting

- **MetaMask not connecting**: Ensure extension is installed and user authorizes
- **Contract deploy fails**: Check private key has Sepolia ETH and RPC URL is valid
- **Hash mismatch**: Verify exact code used for verification matches original
- **Build errors**: Run `npm install` and ensure Node 18+

## Useful Commands

```bash
hardhat accounts                  # List test accounts
hardhat run scripts/deploy.ts     # Deploy script
hardhat test                      # Run contract tests
npx prisma studio               # Database UI (Phase 2)
```

---

**Project Status**: Phase 1 complete, ready for Phase 2 development
