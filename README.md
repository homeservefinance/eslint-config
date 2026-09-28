# `@homeservefinance/eslint-config`

Shared ESLint flat configuration for HomeServe Finance TypeScript React frontends.

## Installation

Install the package from a git tag, together with its peer dependencies. The repository is
public, so no token or registry configuration is needed in CI, Amplify or locally:

```sh
npm install --save-dev "git+https://github.com/homeservefinance/eslint-config.git#v0.5.0" eslint typescript
```

## Usage

Create `eslint.config.mjs` in the consuming application:

```js
import { frontendConfig } from "@homeservefinance/eslint-config";

export default frontendConfig({
  tsconfigRootDir: import.meta.dirname,
});
```

Type-aware linting is enabled automatically in VS Code. It can be selected explicitly for a
dedicated lint command or during a migration:

```js
export default frontendConfig({
  tsconfigRootDir: import.meta.dirname,
  typeCheck: true,
});
```

React Compiler compatibility checks are disabled by default. Applications using the compiler can
enable them explicitly:

```js
export default frontendConfig({
  tsconfigRootDir: import.meta.dirname,
  reactCompiler: true,
});
```

Add a lint script:

```json
{
  "scripts": {
    "lint": "eslint . --report-unused-disable-directives"
  }
}
```

### Overrides

Applications may add generated paths and narrowly scoped rule overrides:

```js
export default frontendConfig({
  tsconfigRootDir: import.meta.dirname,
  ignores: ["src/generated/**"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
});
```

The preset includes ESLint and TypeScript-ESLint recommended and stylistic rules, optional
type-aware rules, React Hooks rules, Vite Fast Refresh validation, unused-import removal, and
deterministic import sorting, and the shared `no-console` policy. Rules disabled as organization
policy live in this package. Temporary migration warnings belong in the consuming application so
they remain visible and removable.

## Development

```sh
npm install
npm test
```

Releases are git tags. Bump `version` in `package.json`, merge, then tag the merge commit
(`git tag v0.6.0 && git push origin v0.6.0`) and update the `#vX.Y.Z` ref in consuming apps.
Nothing is published to a registry.
