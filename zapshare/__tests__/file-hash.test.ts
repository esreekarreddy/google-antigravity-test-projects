import { calculateFileHash, verifyFileHash, formatHashPreview } from '@/lib/file-hash'

describe('File Hash Utilities', () => {
  describe('calculateFileHash', () => {
    it('should calculate SHA-256 hash for a file', async () => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
      const hash = await calculateFileHash(file)
      
      expect(hash).toBeDefined()
      expect(hash.length).toBe(64) // SHA-256 = 64 hex chars
      expect(hash).toMatch(/^[a-f0-9]{64}$/)
    })

    it('should generate same hash for same content', async () => {
      const content = 'identical content'
      const file1 = new File([content], 'file1.txt')
      const file2 = new File([content], 'file2.txt')
      
      const hash1 = await calculateFileHash(file1)
      const hash2 = await calculateFileHash(file2)
      
      expect(hash1).toBe(hash2)
    })

    it('should generate different hashes for different content', async () => {
      const file1 = new File(['content A'], 'file1.txt')
      const file2 = new File(['content B'], 'file2.txt')
      
      const hash1 = await calculateFileHash(file1)
      const hash2 = await calculateFileHash(file2)
      
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('verifyFileHash', () => {
    it('should return true for matching hashes', () => {
      const hash = 'a'.repeat(64)
      expect(verifyFileHash(hash, hash)).toBe(true)
    })

    it('should return false for non-matching hashes', () => {
      const hash1 = 'a'.repeat(64)
      const hash2 = 'b'.repeat(64)
      expect(verifyFileHash(hash1, hash2)).toBe(false)
    })
  })

  describe('formatHashPreview', () => {
    it('should format long hash correctly', () => {
      const hash = 'abcdef1234567890'.repeat(4) // 64 chars
      const preview = formatHashPreview(hash)
      expect(preview).toBe('abcdef12...34567890')
    })

    it('should return short hash as-is', () => {
      const hash = 'short'
      expect(formatHashPreview(hash)).toBe('short')
    })
  })
})
