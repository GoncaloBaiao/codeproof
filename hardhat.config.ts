import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY
  ? `0x${process.env.PRIVATE_KEY.replace(/^0x/, "")}`
  : "0x0000000000000000000000000000000000000000000000000000000000000000";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
  },
  networks: {
    amoy: {
      url: process.env.POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology",
      accounts: [PRIVATE_KEY],
      chainId: 80002,
    },
    polygon: {
      url: process.env.POLYGON_MAINNET_RPC_URL || "https://polygon-bor-rpc.publicnode.com",
      accounts: [PRIVATE_KEY],
      chainId: 137,
    },
    hardhat: {
      // Local testing network (default)
    },
  } as any,
};

export default config;
