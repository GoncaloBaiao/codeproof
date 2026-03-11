import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex flex-col">
      <div className="flex-1 px-6 lg:px-12 py-12 lg:py-16 flex items-center">
        <div className="max-w-4xl mx-auto w-full text-center">
          <div className="mb-8">
            <h1 className="text-8xl sm:text-9xl font-black text-transparent bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text mb-4">
              404
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Page Not Found</h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Sorry, the page you're looking for doesn't exist. It may have been moved or deleted.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              href="/"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 text-lg hover:shadow-lg hover:shadow-blue-500/50"
            >
              Back to Home
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 border-2 border-blue-500 hover:border-blue-400 text-blue-400 hover:text-blue-300 rounded-xl font-semibold transition-all duration-200 text-lg"
            >
              Register Code
            </Link>
          </div>

          <div className="p-8 bg-blue-950/20 border border-blue-500/30 rounded-2xl">
            <h3 className="text-xl font-bold text-blue-400 mb-3">Quick Links</h3>
            <div className="space-y-2 text-gray-300">
              <p>
                <Link href="/verify" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Verify Code →
                </Link>
              </p>
              <p>
                <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Dashboard →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
