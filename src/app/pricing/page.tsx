"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { useWallet } from "@/hooks/useWallet";
import { PlanBadge } from "@/components/PlanBadge";
import { PLANS } from "@/lib/plans";

export default function PricingPage() {
  const { address, isConnected, plan, isPro, connect } = useWallet();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!address) return;
    setIsCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address }),
      });

      const data = await res.json();

      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setCheckoutError(data.error || "Checkout indisponivel de momento. Tenta novamente em alguns minutos.");
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutError("Erro ao iniciar pagamento. Verifica a conexao e tenta novamente.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-gray-950 via-blue-950/20 to-gray-950">
      {/* Pricing Header */}
      <section className="w-full px-12 lg:px-20 xl:px-32 py-32">
        <div className="max-w-5xl mx-auto w-full text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Preços Simples e Transparentes
          </h1>
          <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
            Escolhe o plano ideal para as tuas necessidades de autenticação de código. Paga apenas pelo que usas.
          </p>

          {isConnected && (
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="text-gray-400 text-sm">Plano atual:</span>
              <PlanBadge plan={plan} />
            </div>
          )}

          {/* Pricing Plans - 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative p-10 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-blue-500/30 transition-all duration-300 flex flex-col h-full">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                  <div className="text-4xl font-bold text-blue-400">
                    €0<span className="text-lg text-gray-400">/mês</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-6">Ideal para experimentar e projetos pessoais</p>

                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-400 flex items-center justify-center mr-3 text-xs">✓</span>
                    {PLANS.FREE.monthlyRegistrations} registos/mês
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-400 flex items-center justify-center mr-3 text-xs">✓</span>
                    Hash SHA-256 client-side
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-400 flex items-center justify-center mr-3 text-xs">✓</span>
                    Polygon Amoy testnet
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="w-5 h-5 rounded-full bg-gray-700/30 text-gray-600 flex items-center justify-center mr-3 text-xs">✗</span>
                    Certificados PDF
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="w-5 h-5 rounded-full bg-gray-700/30 text-gray-600 flex items-center justify-center mr-3 text-xs">✗</span>
                    Suporte prioritário
                  </li>
                </ul>

                {!isConnected ? (
                  <button
                    onClick={connect}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Conectar Wallet
                  </button>
                ) : plan === "FREE" ? (
                  <div className="w-full bg-gray-800 text-gray-400 py-3 rounded-lg font-semibold text-center">
                    Plano Atual
                  </div>
                ) : (
                  <Link
                    href="/register"
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 block text-center"
                  >
                    Começar
                  </Link>
                )}
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative group md:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative p-10 bg-gray-900/80 border border-blue-500/50 rounded-2xl hover:border-blue-400 transition-all duration-300 flex flex-col h-full">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1 rounded-full text-white text-sm font-bold">
                  ⚡ Recomendado
                </div>

                <div className="text-center mb-6 mt-4">
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    €{PLANS.PRO.price}<span className="text-lg text-gray-400">/mês</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-6">Para programadores ativos e equipas</p>

                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-400 flex items-center justify-center mr-3 text-xs">✓</span>
                    Registos ilimitados
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-400 flex items-center justify-center mr-3 text-xs">✓</span>
                    Hash SHA-256 client-side
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-400 flex items-center justify-center mr-3 text-xs">✓</span>
                    Múltiplas redes blockchain
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-400 flex items-center justify-center mr-3 text-xs">✓</span>
                    Certificados PDF
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-400 flex items-center justify-center mr-3 text-xs">✓</span>
                    Suporte prioritário
                  </li>
                </ul>

                {!isConnected ? (
                  <button
                    onClick={connect}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/40"
                  >
                    Conectar Wallet
                  </button>
                ) : isPro ? (
                  <div className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400 py-3 rounded-lg font-semibold text-center">
                    ⚡ Plano Ativo
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckoutLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/40"
                    >
                      {isCheckoutLoading ? "A redirecionar para pagamento..." : "Upgrade para PRO"}
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      Ja tens license key? <Link href="/dashboard" className="text-blue-400 hover:underline">Ativa no Dashboard</Link>
                    </p>
                    {checkoutError && (
                      <p className="text-xs text-red-400 text-center">{checkoutError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full px-12 lg:px-20 xl:px-32 py-32 bg-gray-900/30">
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-3xl font-bold text-white mb-16 text-center">Perguntas Frequentes</h2>

          <div className="space-y-6">
            <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-3">Posso mudar de plano?</h3>
              <p className="text-gray-400">Sim, podes fazer upgrade a qualquer momento. A mudança é imediata após a ativação da licença.</p>
            </div>

            <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-3">Que métodos de pagamento aceitam?</h3>
              <p className="text-gray-400">Aceitamos cartões de crédito/débito e PayPal através do Lemon Squeezy.</p>
            </div>

            <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-3">O que acontece quando atinjo o limite do plano Free?</h3>
              <p className="text-gray-400">Recebes uma notificação para fazer upgrade. O contador é reposto no início de cada mês.</p>
            </div>

            <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-3">O meu código é enviado para algum servidor?</h3>
              <p className="text-gray-400">Nunca. O hash é gerado localmente no teu browser. Apenas o hash SHA-256 é registado na blockchain.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
