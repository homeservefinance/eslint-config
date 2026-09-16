# `@homeservefinance/eslint-config`

Shared ESLint flat configuration for HomeServe Finance TypeScript React frontends.

## Installation

Install the package together with its peer dependencies:

```sh
npm install --save-dev @homeservefinance/eslint-config eslint typescript
```

## Usage

Create `eslint.config.mjs` in the consuming application:

```js
import { frontendConfig } from '@homeservefinance/eslint-config';

export default frontendConfig({
  tsconfigRootDir: import.meta.dirname,
});
```

Add a lint script:

```json
{
  "scripts": {
    "lint": "eslint . --report-unused-disable-directives --max-warnings 0"
  }
}
```

### Overrides

Applications may add generated paths and narrowly scoped rule overrides:

```js
export default frontendConfig({
  tsconfigRootDir: import.meta.dirname,
  ignores: ['src/generated/**'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
});
```

The preset includes ESLint recommended rules, type-aware TypeScript rules, React Hooks rules, Vite Fast Refresh validation, unused-import removal, and deterministic import sorting.

## Development

```sh
npm install
npm test
```

The package is published to GitHub Packages through the manually triggered `Publish` workflow.
