"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CodeEditor } from "@/components/CodeEditor";
import { Footer } from "@/components/Footer";
import { generateHash, verifyHash } from "@/lib/hash";
import { verifyCodeOnBlockchain } from "@/lib/ethereum";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [manualHash, setManualHash] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    found: boolean;
    hash: string;
    author: string;
    timestamp: string;
    metadata?: any;
  } | null>(null);
  const router = useRouter();

  const handleVerifyWithCode = async () => {
    if (!manualHash.trim()) {
      setError("Please enter a hash to verify");
      return;
    }

    if (!code.trim()) {
      setError("Please paste code to verify against");
      return;
    }

    setIsVerifying(true);
    setError(null);
    setResult(null);

    try {
      const codeHash = await generateHash(code);
      const isMatching = await verifyHash(code, manualHash);

      if (!isMatching) {
        setError("Code hash does not match. This code is not the original.");
        setIsVerifying(false);
        return;
      }

      // Now check blockchain
      const blockchainData = await verifyCodeOnBlockchain(manualHash);

      if (blockchainData) {
        const metadata = JSON.parse(blockchainData.metadata || "{}");
        setResult({
          found: true,
          hash: manualHash,
          author: blockchainData.author,
          timestamp: new Date(Number(blockchainData.timestamp) * 1000).toLocaleString(),
          metadata,
        });
      }
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyDirectHash = async () => {
    if (!manualHash.trim()) {
      setError("Please enter a hash");
      return;
    }

    setIsVerifying(true);
    setError(null);
    setResult(null);

    try {
      const blockchainData = await verifyCodeOnBlockchain(manualHash);

      const metadata = JSON.parse(blockchainData.metadata || "{}");
      setResult({
        found: true,
        hash: manualHash,
        author: blockchainData.author,
        timestamp: new Date(Number(blockchainData.timestamp) * 1000).toLocaleString(),
        metadata,
      });
    } catch (err: any) {
      setResult({
        found: false,
        hash: manualHash,
        author: "",
        timestamp: "",
        metadata: null,
      });
      setError(null);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-3xl mx-auto px-6 py-24">
          <div className="mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Verify Code</h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Verify that code is authentic by checking its hash against the blockchain.
            </p>
          </div>

          <div className="space-y-10 w-full">
            {/* Method 1: Verify with Code */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300">
              <h2 className="text-2xl font-bold text-white mb-2">Method 1: Verify with Code</h2>
              <p className="text-gray-400 text-sm mb-8">
                Paste the original code and a hash to verify they match.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-label">Hash to Verify *</label>
                  <input
                    type="text"
                    value={manualHash}
                    onChange={(e) => setManualHash(e.target.value)}
                    placeholder="Paste the SHA-256 hash here..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="text-label">Source Code *</label>
                  <CodeEditor value={code} onChange={setCode} placeholder="Paste code to verify..." />
                </div>

                <button
                  onClick={handleVerifyWithCode}
                  disabled={isVerifying || !manualHash || !code}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-bold transition-all duration-200"
                >
                  {isVerifying ? "Verifying..." : "Verify Code & Hash"}
                </button>
              </div>
            </div>

            {/* Method 2: Check Hash Registry */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300">
              <h2 className="text-2xl font-bold text-white mb-2">Method 2: Check Hash Registry</h2>
              <p className="text-gray-400 text-sm mb-8">
                Just enter a hash to see if it's registered on the blockchain.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-label">Code Hash *</label>
                  <input
                    type="text"
                    value={manualHash}
                    onChange={(e) => setManualHash(e.target.value)}
                    placeholder="Enter SHA-256 hash..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                <button
                  onClick={handleVerifyDirectHash}
                  disabled={isVerifying || !manualHash}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-bold transition-all duration-200"
                >
                  {isVerifying ? "Checking..." : "Check Hash"}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-sm font-medium">
                ✗ {error}
              </div>
            )}

            {/* Result Card */}
            {result && (
              <div
                className={`p-8 border-2 rounded-2xl transition-all duration-300 ${
                  result.found
                    ? "bg-green-950/30 border-green-500/50"
                    : "bg-red-950/30 border-red-500/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-4 h-4 rounded-full ${result.found ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-red-500 shadow-lg shadow-red-500/50"}`}
                  ></div>
                  <h3
                    className={`text-2xl font-bold ${
                      result.found ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {result.found ? "✓ Verified" : "✗ Not Found"}
                  </h3>
                </div>

                {result.found && (
                  <>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between items-start gap-4 pb-4 border-b border-gray-700">
                        <span className="text-gray-400 font-medium">Hash:</span>
                        <code className="text-green-400 font-mono text-right flex-1">{result.hash.slice(0, 32)}...</code>
                      </div>

                      <div className="flex justify-between items-start gap-4 pb-4 border-b border-gray-700">
                        <span className="text-gray-400 font-medium">Author:</span>
                        <code className="text-blue-400 font-mono text-right">
                          {result.author.slice(0, 6)}...{result.author.slice(-4)}
                        </code>
                      </div>

                      <div className="flex justify-between items-start gap-4 pb-4 border-b border-gray-700">
                        <span className="text-gray-400 font-medium">Registered:</span>
                        <span className="text-gray-300 text-right">{result.timestamp}</span>
                      </div>

                      {result.metadata?.projectName && (
                        <div className="flex justify-between items-start gap-4 pb-4 border-b border-gray-700">
                          <span className="text-gray-400 font-medium">Project:</span>
                          <span className="text-gray-300 text-right">{result.metadata.projectName}</span>
                        </div>
                      )}

                      {result.metadata?.description && (
                        <div className="flex justify-between items-start gap-4">
                          <span className="text-gray-400 font-medium">Description:</span>
                          <span className="text-gray-300 text-right">{result.metadata.description}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {!result.found && (
                  <p className="text-red-300 text-base leading-relaxed">
                    This hash was not found on the blockchain. It may not be registered yet.
                  </p>
                )}
              </div>
            )}

            {/* Info Section */}
            <div className="grid md:grid-cols-2 gap-6 pt-6 w-full">
              {/* How Verification Works */}
              <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-6">
                <h4 className="font-bold text-blue-400 mb-4 flex items-center gap-2 text-lg">
                  <span>ℹ️</span> How It Works
                </h4>
                <ul className="text-sm text-gray-300 space-y-3 leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Generate SHA-256 hash of code locally</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Query blockchain for registered hash</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Display author and timestamp</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>No code leaves your computer</span>
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h4 className="font-bold text-white mb-4 text-lg">Quick Links</h4>
                <div className="space-y-3">
                  <a
                    href="https://polygonscan.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Polygon Explorer →
                  </a>
                  <a
                    href="/register"
                    className="block text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Register Code →
                  </a>
                  <a
                    href="/"
                    className="block text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Back to Home →
                  </a>
                </div>
              </div>
            </div>
          </div>
      </div>
      <Footer />
    </main>
  );
}