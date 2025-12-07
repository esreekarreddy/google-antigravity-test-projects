import '@testing-library/jest-dom'

// Mock File.prototype.arrayBuffer for tests
if (typeof File !== 'undefined' && !File.prototype.arrayBuffer) {
  File.prototype.arrayBuffer = function() {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.readAsArrayBuffer(this)
    })
  }
}

// Mock Web Crypto API for tests
/* eslint-disable @typescript-eslint/no-var-requires */
const { TextDecoder, TextEncoder } = require('util')
global.TextDecoder = TextDecoder
global.TextEncoder = TextEncoder
/* eslint-enable @typescript-eslint/no-var-requires */

Object.defineProperty(globalThis, 'crypto', {
  value: {
    subtle: {
      digest: async (algorithm, data) => {
        // Simple mock hash - just convert bytes to hex
        const bytes = new Uint8Array(data)
        const hash = Array.from(bytes)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
          .padEnd(64, '0')
        return Buffer.from(hash, 'hex')
      }
    },
    getRandomValues: (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    }
  }
})
