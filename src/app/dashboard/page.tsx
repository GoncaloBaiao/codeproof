"use client";

import Link from "next/link";
import { CertificateCard } from "@/components/CertificateCard";
import { Footer } from "@/components/Footer";

export default function DashboardPage() {
  // This is a placeholder - in Phase 2 we'll implement actual dashboard with user data
  const sampleRegistrations = [
    {
      id: "1",
      hash: "abc123def456",
      projectName: "React Utils Library",
      description: "A collection of utility functions for React",
      isPublic: true,
      txHash: "0x123456",
      blockNumber: 12345,
      timestamp: BigInt(1704067200),
      createdAt: new Date("2024-01-01"),
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="px-6 lg:px-12 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-16 md:mb-20">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Dashboard</h1>
            <p className="text-gray-400 text-lg">Your code registrations on the blockchain.</p>
          </div>

          {/* Coming Soon Message */}
          <div className="p-8 md:p-12 bg-blue-900/20 border border-blue-500 rounded-lg text-center w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-4">Dashboard Coming Soon</h2>
            <p className="text-gray-300 mb-6">
              Full dashboard with your registration history will be available in Phase 2.
            </p>
            <p className="text-gray-400 text-sm mb-6">
              For now, you can register your code and verify hashes using the navigation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                Register Code
              </Link>
              <Link
                href="/verify"
                className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg font-semibold transition"
              >
                Verify Code
              </Link>
            </div>
          </div>

          {/* Sample Registration Display (for reference) */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Sample Registration</h2>
            <div className="grid w-full gap-6">
              {sampleRegistrations.map((registration) => (
                <CertificateCard
                  key={registration.id}
                  registration={registration}
                />
              ))}
            </div>
          </div>

          {/* Future Features */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Phase 2 Features</h2>
            <div className="grid md:grid-cols-2 gap-6 w-full">
              <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-blue-500/50 transition-all duration-200">
                <h3 className="font-bold text-white mb-2">📊 Registration History</h3>
                <p className="text-gray-400 text-sm">
                  View all your registered codes with detailed information and statistics.
                </p>
              </div>

              <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-blue-500/50 transition-all duration-200">
                <h3 className="font-bold text-white mb-2">📄 Certificate Download</h3>
                <p className="text-gray-400 text-sm">
                  Generate and download PDF certificates for your code registrations.
                </p>
              </div>

              <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-blue-500/50 transition-all duration-200">
                <h3 className="font-bold text-white mb-2">💳 Upgrade Plan</h3>
                <p className="text-gray-400 text-sm">
                  Unlock PRO features like unlimited registrations and priority support.
                </p>
              </div>

              <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-blue-500/50 transition-all duration-200">
                <h3 className="font-bold text-white mb-2">🔗 GitHub Integration</h3>
                <p className="text-gray-400 text-sm">
                  Automatically register commits from your GitHub repositories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
