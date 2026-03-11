"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { HashDisplay } from "@/components/HashDisplay";
import { Footer } from "@/components/Footer";
import { generateHash } from "@/lib/hash";
import {
  connectMetaMask,
  getConnectedAccount,
  registerCodeOnBlockchain,
  isMetaMaskInstalled,
} from "@/lib/ethereum";

export default function RegisterPage() {
  const [code, setCode] = useState("");
  const [hash, setHash] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isHashing, setIsHashing] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleGenerateHash = async () => {
    if (!code.trim()) {
      setError("Please paste some code first");
      return;
    }

    setIsHashing(true);
    setError(null);

    try {
      const generatedHash = await generateHash(code);
      setHash(generatedHash);
    } catch (err) {
      setError("Failed to generate hash");
    } finally {
      setIsHashing(false);
    }
  };

  const handleConnectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError("MetaMask not installed");
      return;
    }

    try {
      const accounts = await connectMetaMask();
      setAccount(accounts[0]);
      setError(null);
    } catch (err) {
      setError("Failed to connect wallet");
    }
  };

  const handleRegister = async () => {
    if (!hash) {
      setError("Please generate a hash first");
      return;
    }

    if (!projectName.trim()) {
      setError("Please enter a project name");
      return;
    }

    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    setIsRegistering(true);
    setError(null);

    try {
      const metadata = JSON.stringify({
        projectName,
        description: description || null,
        timestamp: new Date().toISOString(),
      });

      const transaction = await registerCodeOnBlockchain(hash, metadata);
      setTxHash(transaction);
      setSuccess(
        `✓ Code registered successfully! Transaction: ${transaction?.slice(0, 16)}...`
      );

      // Reset form
      setCode("");
      setHash(null);
      setProjectName("");
      setDescription("");
    } catch (err: any) {
      setError(`Registration failed: ${err.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="px-6 lg:px-12 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Register Your Code</h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Paste your code, generate a hash, and register it on the blockchain. Everything happens locally on your computer.
            </p>
          </div>

          <div className="space-y-10 w-full">
              {/* Code Editor Section */}
              <div className="space-y-4">
                <div>
                  <label className="text-label">Source Code *</label>
                  <p className="text-sm text-gray-500 mb-4">
                    Your code never leaves your computer. It only generates a hash locally.
                  </p>
                </div>
                <CodeEditor value={code} onChange={setCode} />
              </div>

              {/* Generate Hash Button */}
              <button
                onClick={handleGenerateHash}
                disabled={isHashing || !code.trim()}
                className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-xl font-bold transition-all duration-200 text-lg"
              >
                {isHashing ? "Generating Hash..." : "Generate Hash"}
              </button>

              {/* Hash Display */}
              {hash && <HashDisplay hash={hash} />}

              {/* Project Details Section */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Project Details</h3>
                </div>

                <div>
                  <label className="text-label">Project Name *</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., My Awesome Library"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="text-label">Description (optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your code or its purpose..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    style={{ minHeight: "120px" }}
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-5 h-5 rounded border border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isPublic" className="text-gray-300 font-medium">
                    Public registration (anyone can verify)
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-sm font-medium">
                  ✗ {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-xl text-green-400 text-sm font-medium">
                  ✓ {success}
                </div>
              )}

              {/* Wallet Connection Card */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                <h3 className="font-bold text-white mb-6 text-lg">Wallet Connection</h3>

                {!account ? (
                  <button
                    onClick={handleConnectWallet}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200"
                  >
                    Connect MetaMask
                  </button>
                ) : (
                  <div className="p-4 bg-gradient-to-br from-green-950 to-green-900/50 border border-green-500/30 rounded-lg text-center">
                    <div className="text-green-400 font-mono text-xs mb-2 font-bold uppercase tracking-wide">Connected</div>
                    <div className="text-green-300 font-mono text-sm font-bold">{account.slice(0, 6)}...{account.slice(-4)}</div>
                  </div>
                )}

                <p className="text-gray-500 text-xs mt-6 leading-relaxed">
                  You need MetaMask connected to register your code on the blockchain.
                </p>
              </div>

              {/* Register Button */}
              <button
                onClick={handleRegister}
                disabled={isRegistering || !hash || !projectName || !account}
                className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-bold transition-all duration-200 text-lg shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
              >
                {isRegistering ? "Registering..." : "Register on Blockchain"}
              </button>

              {/* Info Box */}
              <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-6">
                <h4 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <span className="text-lg">ℹ️</span> What happens next?
                </h4>
                <ul className="text-sm text-gray-300 space-y-3 leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>Your wallet signs the transaction</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>Hash is stored on Ethereum Sepolia</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>Immutable timestamp recorded</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>Certificate PDF available</span>
                  </li>
                </ul>
              </div>

              {/* Transaction Link */}
              {txHash && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                  <h4 className="font-bold text-white mb-4">Transaction</h4>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm font-mono break-all hover:underline transition-colors"
                  >
                    View on Etherscan →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
