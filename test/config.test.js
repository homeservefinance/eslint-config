import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { ESLint } from "eslint";

import { frontendConfig } from "../src/index.js";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));

test("requires the consuming project root", () => {
  assert.throws(() => frontendConfig({}), /requires tsconfigRootDir/);
});

test("accepts consumer ignores and rule overrides", () => {
  const config = frontendConfig({
    tsconfigRootDir: projectRoot,
    ignores: ["generated/**"],
    rules: { "@typescript-eslint/no-explicit-any": "error" },
  });

  assert.ok(Array.isArray(config));
  assert.ok(
    config.some(
      (entry) =>
        entry.rules?.["@typescript-eslint/no-explicit-any"] === "error",
    ),
  );
});

test("does not require type information by default", () => {
  const config = frontendConfig({
    tsconfigRootDir: projectRoot,
    typeCheck: false,
  });

  assert.ok(
    config.some(
      (entry) => entry.languageOptions?.parserOptions?.projectService === false,
    ),
  );
});

test("supports opt-in type-aware rules", async () => {
  const eslint = new ESLint({
    overrideConfig: frontendConfig({
      tsconfigRootDir: projectRoot,
      typeCheck: true,
      rules: { "@typescript-eslint/no-floating-promises": "error" },
    }),
    overrideConfigFile: true,
  });
  const [result] = await eslint.lintFiles([
    "test/fixtures/floating-promise.ts",
  ]);

  assert.ok(
    result.messages.some(
      ({ ruleId }) => ruleId === "@typescript-eslint/no-floating-promises",
    ),
  );
});
