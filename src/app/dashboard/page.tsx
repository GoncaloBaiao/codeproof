"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { useWallet } from "@/hooks/useWallet";
import { PlanBadge } from "@/components/PlanBadge";
import { LicenseActivation } from "@/components/LicenseActivation";
import { generateCertificatePdf, downloadCertificate } from "@/lib/pdf";

interface RegistrationItem {
  id: string;
  hash: string;
  projectName: string;
  description: string | null;
  txHash: string | null;
  createdAt: string;
  isPublic: boolean;
}

export default function DashboardPage() {
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

  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  const fetchRegistrations = useCallback(async () => {
    if (!address) return;
    setLoadingRegs(true);
    try {
      const res = await fetch(`/api/registrations?walletAddress=${address}`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations ?? []);
      }
    } catch {
      // silently fail
    } finally {
      setLoadingRegs(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      fetchRegistrations();
    }
  }, [isConnected, address, fetchRegistrations]);

  const handleDownloadCertificate = (reg: RegistrationItem) => {
    const pdf = generateCertificatePdf({
      projectName: reg.projectName,
      hash: reg.hash,
      walletAddress: address ?? "",
      txHash: reg.txHash ?? "",
      timestamp: new Date(reg.createdAt).toLocaleString("pt-PT"),
      registrationId: reg.id,
    });
    downloadCertificate(pdf, reg.projectName);
  };

  if (!isConnected) {
    return (
      <main className="min-h-screen w-full bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Dashboard</h1>
          <p className="text-gray-400 text-lg mb-12">Conecta a tua wallet para aceder ao dashboard.</p>
          <button
            onClick={connect}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Conectar MetaMask
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  const limitNum = typeof registrationsLimit === "number" ? registrationsLimit : 0;
  const progressPct = limitNum > 0 ? Math.min((registrationsUsed / limitNum) * 100, 100) : 0;

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="max-w-5xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold text-white">Dashboard</h1>
              <PlanBadge plan={plan} />
            </div>
            <p className="text-gray-400 font-mono text-sm">{address}</p>
          </div>
          <Link
            href="/register"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-center"
          >
            Novo Registo
          </Link>
        </div>

        {/* Usage Card */}
        <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-2xl mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Utilização Este Mês</h2>

          {isPro ? (
            <div className="flex items-center gap-2 text-purple-400">
              <span className="text-2xl font-bold">{registrationsUsed}</span>
              <span className="text-gray-400">registos — Ilimitado ⚡</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300 text-sm">
                  {registrationsUsed} / {registrationsLimit} registos este mês
                </span>
                <span className="text-gray-500 text-sm">{Math.round(progressPct)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    progressPct >= 100
                      ? "bg-red-500"
                      : progressPct >= 66
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              {!canRegister && (
                <p className="text-red-400 text-sm mt-3">
                  Atingiste o limite mensal.{" "}
                  <Link href="/pricing" className="text-blue-400 hover:underline">
                    Faz upgrade para PRO →
                  </Link>
                </p>
              )}
            </>
          )}
        </div>

        {/* Upgrade Banner (FREE users) */}
        {!isPro && (
          <div className="p-8 bg-gradient-to-r from-blue-950/50 to-purple-950/50 border border-blue-500/30 rounded-2xl mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Desbloqueia Registos Ilimitados</h3>
                <p className="text-gray-400 text-sm">
                  Faz upgrade para PRO e obtém registos ilimitados, certificados PDF e suporte prioritário.
                </p>
              </div>
              <Link
                href="/pricing"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all whitespace-nowrap text-center"
              >
                Upgrade para PRO — €9/mês
              </Link>
            </div>
          </div>
        )}

        {/* License Activation (FREE users) */}
        {!isPro && address && (
          <div className="mb-8">
            <LicenseActivation walletAddress={address} onActivated={refreshStatus} />
          </div>
        )}

        {/* My Registrations */}
        <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-2xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Os meus registos</h2>
            <Link
              href="/register"
              className="text-sm text-blue-400 hover:text-blue-300 transition"
            >
              + Novo registo
            </Link>
          </div>

          {loadingRegs ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">Ainda não tens registos. Regista o teu primeiro código!</p>
              <Link
                href="/register"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                Registar Código
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  className="p-5 bg-gray-800/60 border border-gray-700 rounded-xl hover:border-blue-500/40 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{reg.projectName}</h3>
                      {reg.description && (
                        <p className="text-sm text-gray-400 mt-1">{reg.description}</p>
                      )}
                    </div>
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-green-900/30 border border-green-500/50 rounded text-green-400 text-xs font-bold whitespace-nowrap">
                      ✓ On-chain
                    </span>
                  </div>

                  <div className="space-y-1.5 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Hash:</span>
                      <code className="ml-2 text-green-400 font-mono text-xs">{reg.hash.slice(0, 16)}...</code>
                    </div>
                    <div>
                      <span className="text-gray-500">Data:</span>
                      <span className="ml-2 text-gray-300">
                        {new Date(reg.createdAt).toLocaleDateString("pt-PT", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {reg.txHash && (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${reg.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 transition"
                      >
                        Ver no Etherscan →
                      </a>
                    )}

                    {isPro ? (
                      <button
                        onClick={() => handleDownloadCertificate(reg)}
                        className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg text-sm font-semibold transition-all"
                      >
                        📄 Download Certificate
                      </button>
                    ) : (
                      <button
                        disabled
                        title="Upgrade to PRO to download certificates"
                        className="ml-auto px-4 py-2 bg-gray-700 text-gray-400 rounded-lg text-sm font-semibold cursor-not-allowed"
                      >
                        📄 Download Certificate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Link
            href="/register"
            className="p-8 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-blue-500/50 transition-all duration-200 block"
          >
            <h3 className="font-bold text-white mb-3">📝 Registar Código</h3>
            <p className="text-gray-400">
              Regista o hash do teu código na blockchain Ethereum.
            </p>
          </Link>

          <Link
            href="/verify"
            className="p-8 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-blue-500/50 transition-all duration-200 block"
          >
            <h3 className="font-bold text-white mb-3">🔍 Verificar Código</h3>
            <p className="text-gray-400">
              Verifica a autoria de código registado na blockchain.
            </p>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
