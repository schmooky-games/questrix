import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.spec.ts'],
    reporters: ['default'],
    typecheck: {
      tsconfig: './tsconfig.json',
      enabled: true
    }
  }
});