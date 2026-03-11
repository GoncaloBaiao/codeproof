"use client";

import { useState } from "react";

interface HashDisplayProps {
  hash: string | null;
}

export function HashDisplay({ hash }: HashDisplayProps) {
  const [copied, setCopied] = useState(false);

  if (!hash) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-2 border-blue-500/30 rounded-xl p-6">
      <div className="text-sm text-blue-400 font-bold mb-4 uppercase tracking-wide">SHA-256 Hash</div>
      <div className="flex items-center gap-3 bg-gray-900 p-4 rounded-lg border border-gray-800">
        <code className="flex-1 font-mono text-sm text-green-400 break-all cursor-pointer hover:text-green-300">{hash}</code>
        <button
          onClick={handleCopy}
          className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg font-semibold whitespace-nowrap transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
