import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@egypt-one/types': path.resolve(__dirname, '../../packages/types/src'),
      '@egypt-one/config': path.resolve(__dirname, '../../packages/config/src'),
      '@egypt-one/security': path.resolve(__dirname, '../../packages/security/src'),
      '@egypt-one/database': path.resolve(__dirname, '../../packages/database/src'),
      '@egypt-one/agents': path.resolve(__dirname, '../../packages/agents/src'),
      '@egypt-one/skills': path.resolve(__dirname, '../../packages/skills/src'),
      '@egypt-one/i18n': path.resolve(__dirname, '../../packages/i18n/src'),
    },
  },
});
