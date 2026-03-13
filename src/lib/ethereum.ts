import { Contract, JsonRpcProvider, Signer, BrowserProvider } from "ethers";

const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7"; // 11155111

async function ensureSepoliaNetwork(): Promise<void> {
  if (!window.ethereum?.request) {
    throw new Error("MetaMask not installed");
  }

  const currentChainId = (await window.ethereum.request({
    method: "eth_chainId",
  })) as string;

  if (currentChainId?.toLowerCase() === SEPOLIA_CHAIN_ID_HEX) {
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    });
  } catch (switchError: unknown) {
    const code =
      typeof switchError === "object" &&
      switchError !== null &&
      "code" in switchError
        ? (switchError as { code?: number }).code
        : undefined;

    if (code === 4902) {
      // If Sepolia is missing in wallet, add it then retry switch.
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: SEPOLIA_CHAIN_ID_HEX,
            chainName: "Sepolia",
            nativeCurrency: {
              name: "Sepolia Ether",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.sepolia.org"],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          },
        ],
      });

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
      });
      return;
    }

    throw new Error("Please switch your wallet network to Sepolia to continue");
  }
}

// ABI for CodeRegistry contract
const CODE_REGISTRY_ABI = [
  {
    type: "function",
    name: "registerCode",
    inputs: [
      { name: "hash", type: "string" },
      { name: "metadata", type: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "verifyCode",
    inputs: [{ name: "hash", type: "string" }],
    outputs: [
      { name: "author", type: "address" },
      { name: "timestamp", type: "uint256" },
      { name: "metadata", type: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isCodeRegistered",
    inputs: [{ name: "hash", type: "string" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "CodeRegistered",
    inputs: [
      { name: "hash", indexed: true, type: "string" },
      { name: "author", indexed: true, type: "address" },
      { name: "timestamp", indexed: false, type: "uint256" },
      { name: "metadata", indexed: false, type: "string" },
    ],
  },
];

/**
 * Get the CodeRegistry contract instance (read-only)
 * Connects to Ethereum RPC provider
 */
export function getReadOnlyContract(): Contract {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is not set");
  }

  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.infura.io/v3/";
  const provider = new JsonRpcProvider(rpcUrl);

  return new Contract(contractAddress, CODE_REGISTRY_ABI, provider);
}

/**
 * Get the CodeRegistry contract instance (write operations via user's wallet)
 * Requires MetaMask or other Web3 provider
 */
export async function getWriteContract(): Promise<Contract> {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is not set");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new Contract(contractAddress, CODE_REGISTRY_ABI, signer);
}

/**
 * Check if user has MetaMask installed
 */
export function isMetaMaskInstalled(): boolean {
  return typeof window !== "undefined" && !!window.ethereum;
}

/**
 * Connect to MetaMask and request account access
 */
export async function connectMetaMask(): Promise<string[]> {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts as string[];
  } catch (error) {
    throw new Error("Failed to connect to MetaMask");
  }
}

/**
 * Get the connected user's account from MetaMask
 */
export async function getConnectedAccount(): Promise<string | null> {
  if (!window.ethereum) {
    return null;
  }

  try {
    const accounts = (await window.ethereum.request({
      method: "eth_accounts",
    })) as string[];

    return accounts.length > 0 ? accounts[0] : null;
  } catch {
    return null;
  }
}

/**
 * Register code on blockchain
 *
 * @param hash SHA-256 hash of the code
 * @param metadata JSON-encoded metadata (projectName, description, etc.)
 * @returns Transaction hash
 */
export async function registerCodeOnBlockchain(
  hash: string,
  metadata: string
): Promise<string> {
  await ensureSepoliaNetwork();
  const contract = await getWriteContract();

  try {
    const tx = await contract.registerCode(hash, metadata);
    const receipt = await tx.wait();

    if (!receipt) {
      throw new Error("Transaction failed");
    }

    return receipt.hash;
  } catch (error) {
    throw new Error(`Registration failed: ${error}`);
  }
}

/**
 * Verify code registration on blockchain
 *
 * @param hash SHA-256 hash to verify
 * @returns Object with author, timestamp, and metadata
 */
export async function verifyCodeOnBlockchain(
  hash: string
): Promise<{ author: string; timestamp: bigint; metadata: string }> {
  const contract = getReadOnlyContract();

  try {
    const [author, timestamp, metadata] = await contract.verifyCode(hash);
    return { author, timestamp, metadata };
  } catch {
    throw new Error("Code hash not found on blockchain");
  }
}

/**
 * Check if a hash is registered on blockchain
 *
 * @param hash SHA-256 hash to check
 * @returns Boolean indicating if hash is registered
 */
export async function isCodeRegisteredOnBlockchain(hash: string): Promise<boolean> {
  const contract = getReadOnlyContract();

  try {
    return await contract.isCodeRegistered(hash);
  } catch {
    return false;
  }
}

/**
 * Format Ethereum address to display format (first and last 6 chars + ...)
 */
export function formatAddress(address: string): string {
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

// Type definitions for Window to include ethereum
declare global {
  interface Window {
    ethereum?: {
      request?: (args: { method: string; params?: any[] }) => Promise<any>;
      on?: (event: string, handler: Function) => void;
      removeListener?: (event: string, handler: Function) => void;
    } & any;
  }
}
