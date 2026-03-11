"use client";

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-800 px-6 lg:px-12 py-16 md:py-24 bg-gray-950/50">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 text-xl font-bold text-white mb-3 justify-center md:justify-start">
              <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg"></div>
              CodeProof
            </div>
            <p className="text-gray-400 text-sm">Blockchain code authentication platform</p>
          </div>
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2024 CodeProof. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
