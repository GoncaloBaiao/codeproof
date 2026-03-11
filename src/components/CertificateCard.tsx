"use client";

import { CodeRegistration } from "@/types";

interface CertificateCardProps {
  registration: CodeRegistration;
  onViewCertificate?: () => void;
}

export function CertificateCard({ registration, onViewCertificate }: CertificateCardProps) {
  return (
    <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{registration.projectName}</h3>
          {registration.description && (
            <p className="text-sm text-gray-400 mt-1">{registration.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-green-900/30 border border-green-500 rounded text-green-400 text-xs font-bold">
          ✓ Verified
        </div>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div>
          <span className="text-gray-500">Hash:</span>
          <code className="ml-2 text-green-400 font-mono">{registration.hash.slice(0, 16)}...</code>
        </div>
        <div>
          <span className="text-gray-500">Registered:</span>
          <span className="ml-2 text-gray-300">{new Date(registration.createdAt).toLocaleDateString()}</span>
        </div>
        {registration.txHash && (
          <div>
            <span className="text-gray-500">Transaction:</span>
            <code className="ml-2 text-blue-400 font-mono text-xs">{registration.txHash.slice(0, 16)}...</code>
          </div>
        )}
      </div>

      {onViewCertificate && (
        <button
          onClick={onViewCertificate}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition text-sm"
        >
          View Certificate
        </button>
      )}
    </div>
  );
}
