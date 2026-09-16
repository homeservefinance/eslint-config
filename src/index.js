import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

const defaultIgnores = [
  "build/**",
  "coverage/**",
  "dist/**",
  "storybook-static/**",
];

/**
 * HomeServe Finance's ESLint configuration for TypeScript React frontends.
 *
 * @param {{
 *   tsconfigRootDir: string;
 *   ignores?: string[];
 *   rules?: import('eslint').Linter.RulesRecord;
 *   typeCheck?: boolean;
 * }} options
 * @returns {import('eslint').Linter.Config[]}
 */
export function frontendConfig({
  tsconfigRootDir,
  ignores = [],
  rules = {},
  typeCheck,
}) {
  if (!tsconfigRootDir) {
    throw new TypeError("frontendConfig requires tsconfigRootDir");
  }

  const shouldTypeCheck =
    typeCheck ?? typeof process.env.VSCODE_PID === "string";

  return defineConfig([
    globalIgnores([...defaultIgnores, ...ignores]),

    {
      files: ["**/*.{js,mjs,cjs,jsx}"],
      extends: [js.configs.recommended],
      languageOptions: {
        ecmaVersion: "latest",
        globals: globals.node,
        parserOptions: {
          ecmaFeatures: { jsx: true },
        },
      },
    },

    {
      files: ["src/**/*.{js,jsx}"],
      languageOptions: {
        globals: globals.browser,
      },
    },

    {
      files: ["**/*.{ts,tsx}"],
      extends: [
        js.configs.recommended,
        ...tseslint.configs.recommended,
        ...tseslint.configs.stylistic,
        ...(shouldTypeCheck ? tseslint.configs.recommendedTypeCheckedOnly : []),
        ...(shouldTypeCheck ? tseslint.configs.stylisticTypeCheckedOnly : []),
      ],
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          projectService: shouldTypeCheck,
          tsconfigRootDir,
        },
      },
      plugins: {
        "simple-import-sort": simpleImportSort,
        "unused-imports": unusedImports,
      },
      rules: {
        // Intentional policy: these rules are unsuitable or too opinionated for our frontends.
        "@typescript-eslint/array-type": "off",
        "@typescript-eslint/await-thenable": "off",
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/consistent-type-imports": [
          "error",
          { disallowTypeAnnotations: false, prefer: "type-imports" },
        ],
        "@typescript-eslint/no-base-to-string": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-implied-eval": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-redundant-type-constituents": "off",
        "@typescript-eslint/no-unnecessary-type-assertion": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-function-type": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/only-throw-error": "off",
        "@typescript-eslint/prefer-for-of": "off",
        "@typescript-eslint/prefer-function-type": "off",
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "@typescript-eslint/prefer-optional-chain": "off",
        "@typescript-eslint/prefer-string-starts-ends-with": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/unbound-method": "off",
        "simple-import-sort/exports": "error",
        "simple-import-sort/imports": "error",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
          },
        ],
      },
    },

    {
      files: ["src/**/*.{js,jsx,ts,tsx}"],
      extends: [reactHooks.configs.flat.recommended],
      languageOptions: {
        globals: globals.browser,
      },
      rules: {
        "react-hooks/exhaustive-deps": "error",
      },
    },

    {
      files: ["src/**/*.{jsx,tsx}"],
      extends: [reactRefresh.configs.vite],
    },

    {
      files: ["**/*.{ts,tsx}"],
      rules,
    },
  ]);
}

export default frontendConfig;
