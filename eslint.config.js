import { defineConfig } from 'eslint/config';

import { frontendConfig } from './src/index.js';

export default defineConfig([
  frontendConfig({
    tsconfigRootDir: import.meta.dirname,
  }),
  {
    files: ['test/fixtures/**'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
]);
