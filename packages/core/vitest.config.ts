import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node', // We're testing in Node.js environment
    globals: true, // Enables global test functions (describe, it, expect)
    include: ['tests/**/*.test.ts'], // Where to find test files
    reporters: ['default'], // Use default reporter
    coverage: {
      enabled: false, // Enable this if you want coverage
      provider: 'v8', // Use V8 coverage
      reportsDirectory: './coverage',
      reporter: ['text', 'json', 'html']
    }
  }
});