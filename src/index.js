import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const defaultIgnores = [
  'build/**',
  'coverage/**',
  'dist/**',
  'storybook-static/**',
];

/**
 * HomeServe Finance's ESLint configuration for TypeScript React frontends.
 *
 * @param {{
 *   tsconfigRootDir: string;
 *   ignores?: string[];
 *   rules?: import('eslint').Linter.RulesRecord;
 * }} options
 * @returns {import('eslint').Linter.Config[]}
 */
export function frontendConfig({ tsconfigRootDir, ignores = [], rules = {} }) {
  if (!tsconfigRootDir) {
    throw new TypeError('frontendConfig requires tsconfigRootDir');
  }

  return defineConfig([
    globalIgnores([...defaultIgnores, ...ignores]),

    {
      files: ['**/*.{js,mjs,cjs,jsx}'],
      extends: [js.configs.recommended],
      languageOptions: {
        ecmaVersion: 'latest',
        globals: globals.node,
        parserOptions: {
          ecmaFeatures: { jsx: true },
        },
      },
    },

    {
      files: ['src/**/*.{js,jsx}'],
      languageOptions: {
        globals: globals.browser,
      },
    },

    {
      files: ['**/*.{ts,tsx}'],
      extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
      plugins: {
        'simple-import-sort': simpleImportSort,
        'unused-imports': unusedImports,
      },
      rules: {
        '@typescript-eslint/consistent-type-imports': [
          'error',
          { fixStyle: 'inline-type-imports' },
        ],
        '@typescript-eslint/no-misused-promises': [
          'error',
          { checksVoidReturn: { attributes: false } },
        ],
        '@typescript-eslint/no-unused-vars': 'off',
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': 'error',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
      },
    },

    {
      files: ['src/**/*.{js,jsx,ts,tsx}'],
      extends: [reactHooks.configs.flat.recommended],
      languageOptions: {
        globals: globals.browser,
      },
      rules: {
        'react-hooks/exhaustive-deps': 'error',
      },
    },

    {
      files: ['src/**/*.{jsx,tsx}'],
      extends: [reactRefresh.configs.vite],
    },

    {
      files: ['**/*.{ts,tsx}'],
      rules,
    },
  ]);
}

export default frontendConfig;
