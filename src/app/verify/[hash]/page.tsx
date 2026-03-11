"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CodeEditor } from "@/components/CodeEditor";
import { generateHash, verifyHash } from "@/lib/hash";
import { verifyCodeOnBlockchain } from "@/lib/ethereum";

export default function VerifyHashPage() {
  const params = useParams();
  const hash = params.hash as string;

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoadingBlockchain, setIsLoadingBlockchain] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blockchainData, setBlockchainData] = useState<any>(null);
  const [codeVerified, setCodeVerified] = useState<boolean | null>(null);

  // Load blockchain data on mount
  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const data = await verifyCodeOnBlockchain(hash);
        const metadata = JSON.parse(data.metadata || "{}");
        setBlockchainData({
          author: data.author,
          timestamp: new Date(Number(data.timestamp) * 1000).toLocaleString(),
          metadata,
        });
      } catch (err) {
        setError("Hash not found on blockchain");
      } finally {
        setIsLoadingBlockchain(false);
      }
    };

    loadBlockchainData();
  }, [hash]);

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setError("Please paste code to verify");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const verified = await verifyHash(code, hash);
      setCodeVerified(verified);

      if (verified) {
        setError(null);
      } else {
        setError("Code does not match this hash");
      }
    } catch (err) {
      setError("Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Verify Code</h1>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Code Editor */}
            <div>
              <label className="block text-white font-semibold mb-4">Paste Code to Verify</label>
              <CodeEditor value={code} onChange={setCode} />
              <p className="text-gray-500 text-sm mt-2">
                Paste the code you want to verify against the hash.
              </p>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyCode}
              disabled={isVerifying || !code}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition"
            >
              {isVerifying ? "Verifying..." : "Verify Code"}
            </button>

            {/* Results */}
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {codeVerified !== null && (
              <div
                className={`p-6 border rounded-lg ${
                  codeVerified
                    ? "bg-green-900/20 border-green-500"
                    : "bg-red-900/20 border-red-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${codeVerified ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <h3
                    className={`text-lg font-bold ${
                      codeVerified ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {codeVerified ? "✓ Match!" : "✗ No Match"}
                  </h3>
                </div>

                {codeVerified && (
                  <p className="text-green-300 text-sm mt-2">
                    This code matches the hash registered on the blockchain.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hash Info */}
            <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="font-bold text-white mb-4">Hash Information</h3>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-400 block mb-1">SHA-256 Hash</span>
                  <code className="text-green-400 font-mono text-xs break-all block">{hash}</code>
                </div>
              </div>
            </div>

            {/* Blockchain Data */}
            {isLoadingBlockchain ? (
              <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
                <div className="text-gray-400">Loading blockchain data...</div>
              </div>
            ) : blockchainData ? (
              <div className="p-6 bg-green-900/20 border border-green-500 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h3 className="font-bold text-green-400">Registered ✓</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Author</span>
                    <code className="text-green-300 font-mono text-xs block break-all">
                      {blockchainData.author}
                    </code>
                  </div>

                  <div>
                    <span className="text-gray-400">Timestamp</span>
                    <div className="text-green-300">{blockchainData.timestamp}</div>
                  </div>

                  {blockchainData.metadata?.projectName && (
                    <div>
                      <span className="text-gray-400">Project</span>
                      <div className="text-green-300">{blockchainData.metadata.projectName}</div>
                    </div>
                  )}

                  {blockchainData.metadata?.description && (
                    <div>
                      <span className="text-gray-400">Description</span>
                      <div className="text-green-300">{blockchainData.metadata.description}</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <h3 className="font-bold text-red-400">Not Found</h3>
                </div>
                <p className="text-red-300 text-sm mt-2">
                  This hash is not registered on the blockchain.
                </p>
              </div>
            )}

            {/* Info */}
            <div className="p-4 bg-blue-900/20 border border-blue-500 rounded-lg">
              <h4 className="font-bold text-blue-400 mb-2">How to Verify</h4>
              <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                <li>Paste the original code</li>
                <li>Click "Verify Code"</li>
                <li>System checks SHA-256 match</li>
                <li>Confirms blockchain record</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
