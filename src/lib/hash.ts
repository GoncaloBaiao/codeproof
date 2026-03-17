/**
 * Generate SHA-256 hash of code using Web Crypto API
 * This runs completely in the browser - code never leaves the user's computer
 *
 * @param code The source code to hash
 * @returns Promise resolving to hex string of SHA-256 hash
 */
export async function generateHash(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

  return hashHex;
}

/**
 * Generate SHA-256 hash from raw bytes (e.g. a ZIP bundle).
 * Runs entirely in the browser via Web Crypto API.
 */
export async function generateHashFromBytes(bytes: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", bytes as unknown as BufferSource);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify that a code produces the expected hash
 *
 * @param code The code to verify
 * @param expectedHash The hash to compare against
 * @returns Promise resolving to boolean - true if hash matches
 */
export async function verifyHash(code: string, expectedHash: string): Promise<boolean> {
  const computedHash = await generateHash(code);
  return computedHash.toLowerCase() === expectedHash.toLowerCase();
}
