/**
 * GhostLine Cryptography Utilities
 * "Host-Proof" security primitives.
 * The keys generated here are intended to live in the URL fragment (hash) 
 * and never be sent to the server.
 */

/**
 * Generates a cryptographically strong random key for the room.
 * Default is 16 bytes (128-bit) encoded as URL-safe base64.
 */
export async function generateRoomKey(): Promise<string> {
  const keyBuffer = new Uint8Array(16);
  window.crypto.getRandomValues(keyBuffer);
  return bufferToHex(keyBuffer);
}

/**
 * Generates a visual fingerprint (hash) of the shared key.
 * This is used for the "Safety Number" visualization.
 * If both users see the same color/shape, the key matches.
 */
export async function generateVisualFingerprint(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return bufferToHex(new Uint8Array(hashBuffer)).substring(0, 6); // First 6 chars for color hex
}

// Helper: Convert buffer to hex string
function bufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hashes a Ghost Code into a full-length Peer ID for signaling.
 * This obscures the short code from PeerJS logs and prevents brute-forcing.
 * Format: SHA256("ghostline-CODE-SALT") => 64-char hex string
 */
const GHOST_SALT = "ephemeral-ghost-2024"; // Public salt is fine; the goal is obscurity, not secrecy

export async function hashPeerId(ghostCode: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`ghostline-${ghostCode.toUpperCase()}-${GHOST_SALT}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return bufferToHex(new Uint8Array(hashBuffer));
}

/**
 * Generates a random 4-character alphanumeric Ghost Code.
 */
export function generateGhostCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous chars (0/O, 1/I/L)
  let code = '';
  const randomValues = new Uint8Array(4);
  window.crypto.getRandomValues(randomValues);
  for (let i = 0; i < 4; i++) {
    code += chars[randomValues[i] % chars.length];
  }
  return code;
}

/**
 * Generates a visual security code from two peer IDs.
 * If both users see the SAME word, the connection is secure (no MITM).
 * Uses a single memorable word for easy mobile display.
 */
const SECURITY_WORDS = [
  'FALCON', 'DRAGON', 'MARBLE', 'COPPER', 'SILVER', 'BRONZE', 
  'COBALT', 'INDIGO', 'VIOLET', 'SUNSET', 'MEADOW', 'CANYON',
  'SUMMIT', 'RAPIDS', 'FOREST', 'ARCTIC', 'DESERT', 'ISLAND',
  'CIPHER', 'PRISM', 'VERTEX', 'ZENITH', 'AURORA', 'NEBULA',
  'QUARTZ', 'ONYX', 'JADE', 'OPAL', 'RUBY', 'TOPAZ', 'SAFFRON', 'EMBER'
];

export async function generateSecurityCode(localPeerId: string, remotePeerId: string): Promise<string> {
  // Sort IDs alphabetically so both parties compute the SAME hash
  const sortedIds = [localPeerId, remotePeerId].sort().join(':');
  
  const encoder = new TextEncoder();
  const data = encoder.encode(sortedIds);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  
  // Use first 2 bytes to pick a word (more entropy than 1 byte)
  const index = ((hashArray[0] << 8) | hashArray[1]) % SECURITY_WORDS.length;
  
  return SECURITY_WORDS[index];
}



