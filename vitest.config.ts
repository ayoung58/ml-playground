import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    // lib/ml is pure TypeScript, so no DOM environment is needed.
    environment: 'node',
  },
});
