import { generateSecureCode } from '@/lib/code-generator'

describe('generateSecureCode', () => {
  it('should generate a code with correct format', () => {
    const code = generateSecureCode()
    expect(code).toMatch(/^[A-Z][a-z]+-[A-Z][a-z]+$/)
  })

  it('should generate mostly unique codes', () => {
    const codes = new Set()
    for (let i = 0; i < 100; i++) {
      codes.add(generateSecureCode())
    }
    // With 40 adjectives and 40 nouns = 1600 combinations
    // Expect at least 90% uniqueness in 100 tries
    expect(codes.size).toBeGreaterThanOrEqual(90)
  })

  it('should generate codes with reasonable length', () => {
    const code = generateSecureCode()
    const parts = code.split('-')
    expect(parts).toHaveLength(2)
    expect(parts[0].length).toBeGreaterThanOrEqual(4)
    expect(parts[0].length).toBeLessThanOrEqual(10)
    expect(parts[1].length).toBeGreaterThanOrEqual(4)
    expect(parts[1].length).toBeLessThanOrEqual(10)
  })
})
