import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <section className="relative w-full px-12 lg:px-20 xl:px-32 pt-40 pb-32 overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-b from-blue-600/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-8 leading-tight">
              Prove that the code is{" "}
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                yours. Forever.
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Register your code on the blockchain and get an immutable proof of authorship, verifiable by anyone, anytime.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              <Link
                href="/register"
                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 text-lg hover:shadow-lg hover:shadow-blue-500/50"
              >
                Register Code
              </Link>
              <Link
                href="/verify"
                className="px-10 py-4 border-2 border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white rounded-xl font-semibold transition-all duration-200 text-lg hover:bg-gray-800/50"
              >
                Verify Code
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full px-12 lg:px-20 xl:px-32 py-32 bg-gray-900/50">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">Simple process to register and verify your code</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 w-full">
            {/* Step 1 */}
            <div className="p-10 md:p-12 bg-gray-900 border-2 border-gray-800 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center mb-6 text-white font-bold text-2xl shadow-lg shadow-blue-500/20">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Paste Your Code</h3>
              <p className="text-gray-400 leading-relaxed">
                Copy and paste your source code into the editor. Everything happens in your browser.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-10 md:p-12 bg-gray-900 border-2 border-gray-800 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-400 rounded-full flex items-center justify-center mb-6 text-white font-bold text-2xl shadow-lg shadow-purple-500/20">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Generate Hash</h3>
              <p className="text-gray-400 leading-relaxed">
                A unique SHA-256 fingerprint is created locally. Your code never leaves your computer.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-10 md:p-12 bg-gray-900 border-2 border-gray-800 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-400 rounded-full flex items-center justify-center mb-6 text-white font-bold text-2xl shadow-lg shadow-cyan-500/20">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Register Blockchain</h3>
              <p className="text-gray-400 leading-relaxed">
                Register the hash on Polygon with your wallet. Immutable, timestamped proof.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full px-8 lg:px-16 xl:px-24 py-24">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">Why CodeProof?</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">Built with security, transparency, and privacy at its core</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto w-full">
            <div className="flex gap-6 p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-blue-600/30 to-blue-400/30 text-blue-400 font-bold text-xl">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Immutable Proof</h3>
                <p className="text-gray-400 leading-relaxed">
                  Once registered on the blockchain, the record cannot be changed or deleted.
                </p>
              </div>
            </div>

            <div className="flex gap-6 p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600/30 to-blue-400/30 text-purple-400 font-bold text-xl">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Publicly Verifiable</h3>
                <p className="text-gray-400 leading-relaxed">
                  Anyone can verify your authorship using just the code hash. No account needed.
                </p>
              </div>
            </div>

            <div className="flex gap-6 p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-cyan-600/30 to-blue-400/30 text-cyan-400 font-bold text-xl">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Privacy Friendly</h3>
                <p className="text-gray-400 leading-relaxed">
                  Your code stays on your computer. Only the hash is sent to the blockchain.
                </p>
              </div>
            </div>

            <div className="flex gap-6 p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-400/30 text-blue-400 font-bold text-xl">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Certificate PDF</h3>
                <p className="text-gray-400 leading-relaxed">
                  Download an official certificate proving your authorship and timestamp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-8 lg:px-16 xl:px-24 py-24 bg-gradient-to-r from-blue-950/30 to-purple-950/30">
        <div className="max-w-4xl mx-auto w-full">
          <div className="p-12 md:p-16 bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-2 border-blue-500/30 rounded-3xl text-center backdrop-blur-sm">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">Ready to Prove Your Code?</h2>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              Connect your wallet and register your first code registration on the Polygon blockchain. It takes less than a minute.
            </p>
            <Link
              href="/register"
              className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold transition-all duration-200 text-lg hover:shadow-xl hover:shadow-blue-500/40"
            >
              Get Started Now →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
