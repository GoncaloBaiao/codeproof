"use client";

import Link from "next/link";
import { Footer } from "@/components/Footer";
import { useWallet } from "@/hooks/useWallet";
import { PlanBadge } from "@/components/PlanBadge";
import { LicenseActivation } from "@/components/LicenseActivation";

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

          <div className="p-8 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-blue-500/50 transition-all duration-200">
            <h3 className="font-bold text-white mb-3">📄 Certificados PDF</h3>
            <p className="text-gray-400">
              {isPro ? "Gera certificados PDF para os teus registos." : "Disponível no plano PRO."}
            </p>
          </div>

          <div className="p-8 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-blue-500/50 transition-all duration-200">
            <h3 className="font-bold text-white mb-3">🔗 GitHub Integration</h3>
            <p className="text-gray-400">
              Regista automaticamente commits do GitHub. Em breve.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
