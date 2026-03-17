/**
 * Browser-side safe folder bundling for CodeProof.
 *
 * Reads a local directory via the File System Access API,
 * applies security filters, creates a deterministic ZIP using fflate,
 * and returns the ZIP bytes + stats. No data ever leaves the browser.
 */
import { zipSync, type Zippable } from "fflate";

// ---------------------------------------------------------------------------
// Blocked patterns
// ---------------------------------------------------------------------------

/** Directories that are always skipped during traversal */
const BLOCKED_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
  ".turbo",
  ".vercel",
  "out",
]);

/** File‑name patterns considered secret / dangerous */
const SECRET_PATTERNS: RegExp[] = [
  /^\.env(\..+)?$/i,
  /\.pem$/i,
  /\.key$/i,
  /^id_rsa/i,
  /\.p12$/i,
  /\.pfx$/i,
  /\.crt$/i,
  /\.cer$/i,
  /\.keystore$/i,
  /\.kdbx$/i,
];

/** Extensions for archives & executables – always skipped */
const BLOCKED_EXTENSIONS = new Set([
  ".zip",
  ".rar",
  ".7z",
  ".tar",
  ".gz",
  ".exe",
  ".dll",
  ".dylib",
  ".so",
]);

// ---------------------------------------------------------------------------
// Path sanitisation helpers
// ---------------------------------------------------------------------------

function isPathSafe(relativePath: string): boolean {
  if (relativePath.includes("\0")) return false;
  if (relativePath.includes("..")) return false;
  if (/^[a-zA-Z]:/.test(relativePath)) return false;
  if (relativePath.startsWith("/") || relativePath.startsWith("\\")) return false;
  return true;
}

/** Normalise to POSIX-style forward‑slash paths */
function toPosix(p: string): string {
  return p.replace(/\\/g, "/");
}

// ---------------------------------------------------------------------------
// Classification helpers
// ---------------------------------------------------------------------------

type SkipReason =
  | "blocked-dir"
  | "secret-file"
  | "blocked-extension"
  | "unsafe-path"
  | "symlink-or-unknown"
  | "read-error";

function classifyFile(name: string): SkipReason | null {
  const lower = name.toLowerCase();
  const ext = lower.includes(".") ? `.${lower.split(".").pop()}` : "";

  for (const pat of SECRET_PATTERNS) {
    if (pat.test(name)) return "secret-file";
  }

  if (BLOCKED_EXTENSIONS.has(ext)) return "blocked-extension";

  return null;
}

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface BundleStats {
  includedFilesCount: number;
  skippedFilesCount: number;
  skippedReasons: Record<string, number>;
  totalBytesIncluded: number;
  zipSizeBytes: number;
  rootFolderName: string;
  excludedPatternsUsed: string[];
}

export interface BundleResult {
  zipBytes: Uint8Array;
  stats: BundleStats;
}

// ---------------------------------------------------------------------------
// Core: recursive traversal + zip
// ---------------------------------------------------------------------------

interface CollectedFile {
  path: string; // POSIX relative, sanitised
  data: Uint8Array;
}

async function collectFiles(
  dirHandle: FileSystemDirectoryHandle,
  prefix: string,
  collected: CollectedFile[],
  skippedReasons: Record<string, number>,
): Promise<number> {
  let totalBytes = 0;

  for await (const [name, handle] of (dirHandle as unknown as AsyncIterable<[string, FileSystemHandle]>)) {
    const relativePath = prefix ? `${prefix}/${name}` : name;

    if (handle.kind === "directory") {
      if (BLOCKED_DIRS.has(name)) {
        skippedReasons["blocked-dir"] = (skippedReasons["blocked-dir"] || 0) + 1;
        continue;
      }
      totalBytes += await collectFiles(
        handle as FileSystemDirectoryHandle,
        relativePath,
        collected,
        skippedReasons,
      );
      continue;
    }

    // handle.kind === "file"
    const posixPath = toPosix(relativePath);

    if (!isPathSafe(posixPath)) {
      skippedReasons["unsafe-path"] = (skippedReasons["unsafe-path"] || 0) + 1;
      continue;
    }

    const reason = classifyFile(name);
    if (reason) {
      skippedReasons[reason] = (skippedReasons[reason] || 0) + 1;
      continue;
    }

    try {
      const file = await (handle as FileSystemFileHandle).getFile();
      const buffer = await file.arrayBuffer();
      const data = new Uint8Array(buffer);
      collected.push({ path: posixPath, data });
      totalBytes += data.byteLength;
    } catch {
      skippedReasons["read-error"] = (skippedReasons["read-error"] || 0) + 1;
    }
  }

  return totalBytes;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Build a safe, sanitised ZIP from a directory handle.
 *
 * @param rootHandle  The `FileSystemDirectoryHandle` from `showDirectoryPicker()`
 * @returns           `{ zipBytes, stats }` — the ZIP as `Uint8Array` and summary stats
 */
export async function buildSafeZipFromDirectory(
  rootHandle: FileSystemDirectoryHandle,
): Promise<BundleResult> {
  const collected: CollectedFile[] = [];
  const skippedReasons: Record<string, number> = {};

  const totalBytesIncluded = await collectFiles(rootHandle, "", collected, skippedReasons);

  // Build fflate Zippable structure (flat map of posix‑path → Uint8Array)
  const zippable: Zippable = {};
  for (const f of collected) {
    zippable[f.path] = f.data;
  }

  const zipBytes = zipSync(zippable, { level: 6 });

  const skippedFilesCount = Object.values(skippedReasons).reduce((a, b) => a + b, 0);

  const excludedPatternsUsed = [
    ...Array.from(BLOCKED_DIRS).map((d) => `${d}/**`),
    ...SECRET_PATTERNS.map((r) => r.source),
    ...Array.from(BLOCKED_EXTENSIONS),
  ];

  return {
    zipBytes,
    stats: {
      includedFilesCount: collected.length,
      skippedFilesCount,
      skippedReasons,
      totalBytesIncluded,
      zipSizeBytes: zipBytes.byteLength,
      rootFolderName: rootHandle.name,
      excludedPatternsUsed,
    },
  };
}
