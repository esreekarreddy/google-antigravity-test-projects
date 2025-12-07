/**
 * File integrity utilities using SHA-256 hashing
 */

/**
 * Calculate SHA-256 hash of a file
 */
export async function calculateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Verify file integrity by comparing hashes
 */
export function verifyFileHash(calculatedHash: string, expectedHash: string): boolean {
  return calculatedHash === expectedHash
}

/**
 * Format hash for display (first 8 + last 8 chars)
 */
export function formatHashPreview(hash: string): string {
  if (hash.length < 16) return hash
  return `${hash.slice(0, 8)}...${hash.slice(-8)}`
}
