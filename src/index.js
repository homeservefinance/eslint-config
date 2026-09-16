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
 *   reactCompiler?: boolean;
 *   rules?: import('eslint').Linter.RulesRecord;
 *   typeCheck?: boolean;
 * }} options
 * @returns {import('eslint').Linter.Config[]}
 */
export function frontendConfig({
  tsconfigRootDir,
  ignores = [],
  reactCompiler = false,
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
        "@typescript-eslint/no-misused-promises": shouldTypeCheck
          ? ["error", { checksVoidReturn: { attributes: false } }]
          : "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/prefer-for-of": "off",
        "@typescript-eslint/prefer-function-type": "off",
        "@typescript-eslint/prefer-string-starts-ends-with": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/unbound-method": "off",
        "simple-import-sort/exports": "error",
        "simple-import-sort/imports": [
          "error",
          {
            groups: [["^react", "^@?\\w"], ["^\\./", "^../"], ["^.+\\.s?css$"]],
          },
        ],
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
        "no-console": "error",
        "react-hooks/exhaustive-deps": "error",
        "react-hooks/incompatible-library": reactCompiler ? "error" : "off",
        "react-hooks/preserve-manual-memoization": reactCompiler
          ? "error"
          : "off",
      },
    },

    {
      files: ["src/**/*.{jsx,tsx}"],
      extends: [reactRefresh.configs.vite],
    },

    {
      files: ["**/*.d.ts"],
      rules: {
        "@typescript-eslint/consistent-indexed-object-style": "off",
        "@typescript-eslint/triple-slash-reference": "off",
        "unused-imports/no-unused-vars": "off",
      },
    },

    {
      files: ["**/*.{ts,tsx}"],
      rules,
    },
  ]);
}

export default frontendConfig;
