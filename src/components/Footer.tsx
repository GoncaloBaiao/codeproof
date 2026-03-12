"use client";

import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-800 px-8 lg:px-16 xl:px-24 py-6 bg-gray-950/50">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <BrandLogo
            iconSize={34}
            textSizeClassName="text-xl"
            subtitle="Blockchain code authentication"
            compact
          />
          <div className="text-gray-500 text-sm">
            <p>&copy; 2024 CodeProof. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
