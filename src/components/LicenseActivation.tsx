"use client";

import { useState } from "react";

interface LicenseActivationProps {
  walletAddress: string;
  onActivated: () => void;
}

export function LicenseActivation({ walletAddress, onActivated }: LicenseActivationProps) {
  const [licenseKey, setLicenseKey] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleActivate = async () => {
    const trimmed = licenseKey.trim();
    if (!trimmed) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, licenseKey: trimmed }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Licença PRO ativada com sucesso!");
        onActivated();
      } else {
        setStatus("error");
        setMessage(data.error || "Falha ao ativar licença.");
      }
    } catch {
      setStatus("error");
      setMessage("Erro de rede. Tenta novamente.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
        <p className="text-sm font-medium text-green-400">✓ {message}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 space-y-3">
      <h3 className="text-sm font-medium text-gray-300">Ativar Licença PRO</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={licenseKey}
          onChange={(e) => setLicenseKey(e.target.value)}
          placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
          className="flex-1 rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={status === "loading"}
        />
        <button
          onClick={handleActivate}
          disabled={status === "loading" || !licenseKey.trim()}
          className="rounded-md bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {status === "loading" ? "A ativar..." : "Ativar"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-sm text-red-400">{message}</p>
      )}
    </div>
  );
}
