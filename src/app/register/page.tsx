"use client";

import { useState } from "react";
import Link from "next/link";
import { CodeEditor } from "@/components/CodeEditor";
import { HashDisplay } from "@/components/HashDisplay";
import { Footer } from "@/components/Footer";
import { PlanBadge } from "@/components/PlanBadge";
import { generateHash } from "@/lib/hash";
import {
  registerCodeOnBlockchain,
} from "@/lib/ethereum";
import { useWallet } from "@/hooks/useWallet";
import { generateCertificatePdf, downloadCertificate } from "@/lib/pdf";

export default function RegisterPage() {
  const {
    address,
    isConnected,
    plan,
    isPro,
    registrationsUsed,
    registrationsLimit,
    canRegister,
    connect,
    refreshStatus,
  } = useWallet();

  const [code, setCode] = useState("");
  const [hash, setHash] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isHashing, setIsHashing] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [registeredProjectName, setRegisteredProjectName] = useState<string>("");
  const [registeredHash, setRegisteredHash] = useState<string>("");
  const [showLimitModal, setShowLimitModal] = useState(false);

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
    } catch {
      setError("Failed to generate hash");
    } finally {
      setIsHashing(false);
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

    if (!address) {
      setError("Please connect your wallet first");
      return;
    }

    // Check plan limits before registering
    if (!canRegister) {
      setShowLimitModal(true);
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

      const saveResponse = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hash,
          projectName,
          description,
          txHash: transaction,
          walletAddress: address,
          isPublic,
        }),
      });

      if (!saveResponse.ok) {
        const saveData = await saveResponse.json().catch(() => null);
        throw new Error(saveData?.error || "Failed to save registration to database");
      }

      const saveData = await saveResponse.json();

      setTxHash(transaction);
      setRegistrationId(saveData.registrationId ?? null);
      setRegisteredProjectName(projectName);
      setRegisteredHash(hash);
      setSuccess(
        `✓ Code registered successfully! Transaction: ${transaction?.slice(0, 16)}...`
      );

      // Refresh status to update counters
      await refreshStatus();

      // Reset form fields (but keep success state)
      setCode("");
      setHash(null);
      setProjectName("");
      setDescription("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`Registration failed: ${message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-4xl mx-auto px-6 py-24">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">Register Your Code</h1>
              {isConnected && <PlanBadge plan={plan} />}
            </div>
            <p className="text-lg text-gray-400 leading-relaxed">
              Paste your code, generate a hash, and register it on the blockchain. Everything happens locally on your computer.
            </p>
            {/* Registration counter for FREE */}
            {isConnected && !isPro && (
              <p className="text-sm text-gray-500 mt-2">
                {registrationsUsed} / {registrationsLimit} registrations this month
              </p>
            )}
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

            {/* Success Card */}
            {success && (
              <div className="p-8 bg-green-900/20 border border-green-500/30 rounded-2xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-green-500/20 rounded-full text-green-400 text-xl">✓</div>
                  <h3 className="text-xl font-bold text-green-400">Code registered successfully!</h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Hash:</span>
                    <code className="ml-2 text-green-400 font-mono text-xs break-all">{registeredHash}</code>
                  </div>
                  {txHash && (
                    <div>
                      <span className="text-gray-500">Transaction:</span>
                      <a
                        href={`https://amoy.polygonscan.com/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-400 hover:text-blue-300 font-mono text-xs break-all hover:underline transition"
                      >
                        {txHash}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {isPro ? (
                    <button
                      onClick={() => {
                        const pdf = generateCertificatePdf({
                          projectName: registeredProjectName,
                          hash: registeredHash,
                          walletAddress: address ?? "",
                          txHash: txHash ?? "",
                          timestamp: new Date().toLocaleString("en-US"),
                          registrationId: registrationId ?? "",
                        });
                        downloadCertificate(pdf, registeredProjectName);
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all text-sm"
                    >
                      📄 Download Certificate
                    </button>
                  ) : (
                    <button
                      disabled
                      title="Upgrade to PRO to download certificates"
                      className="px-5 py-2.5 bg-gray-700 text-gray-400 rounded-lg font-semibold text-sm cursor-not-allowed"
                    >
                      📄 Download Certificate
                    </button>
                  )}

                  <Link
                    href="/dashboard"
                    className="px-5 py-2.5 border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg font-semibold transition text-sm"
                  >
                    View Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      setSuccess(null);
                      setTxHash(null);
                      setRegistrationId(null);
                      setRegisteredProjectName("");
                      setRegisteredHash("");
                    }}
                    className="px-5 py-2.5 border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg font-semibold transition text-sm"
                  >
                    Register another code
                  </button>
                </div>

                {!isPro && (
                  <p className="text-xs text-gray-500 pt-1">
                    PDF certificates available on PRO plan.{" "}
                    <Link href="/pricing" className="text-blue-400 hover:underline">
                      Upgrade →
                    </Link>
                  </p>
                )}
              </div>
            )}

            {/* Wallet Connection Card */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <h3 className="font-bold text-white mb-6 text-lg">Wallet Connection</h3>

              {!isConnected ? (
                <button
                  onClick={connect}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200"
                >
                  Connect MetaMask
                </button>
              ) : (
                <div className="p-4 bg-gradient-to-br from-green-950 to-green-900/50 border border-green-500/30 rounded-lg text-center">
                  <div className="text-green-400 font-mono text-xs mb-2 font-bold uppercase tracking-wide">Connected</div>
                  <div className="text-green-300 font-mono text-sm font-bold">{address?.slice(0, 6)}...{address?.slice(-4)}</div>
                </div>
              )}

              <p className="text-gray-500 text-xs mt-6 leading-relaxed">
                You need MetaMask connected to register your code on the blockchain.
              </p>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={isRegistering || !hash || !projectName || !isConnected}
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
                  <span>Hash is stored on Polygon Amoy</span>
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

          </div>

          {/* Limit Reached Modal */}
          {showLimitModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full">
                <h3 className="text-xl font-bold text-white mb-3">Limit Reached</h3>
                <p className="text-gray-400 mb-6">
                  You've reached the {registrationsLimit} monthly registrations limit on the Free plan.
                  Upgrade to PRO for unlimited registrations.
                </p>
                <div className="flex gap-3">
                  <Link
                    href="/pricing"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-semibold transition-all text-center"
                  >
                    Upgrade to PRO
                  </Link>
                  <button
                    onClick={() => setShowLimitModal(false)}
                    className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg font-semibold transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
      <Footer />
    </main>
  );
}
