# @homeservefinance/eslint-config

Shared ESLint flat config for HomeServe Finance TypeScript React frontends. One export,
`frontendConfig()` in `src/index.js`, returns the config array a consuming `eslint.config.mjs`
re-exports. Nothing is published to a registry: consumers install it as a git dependency pinned
to a tag (`git+https://github.com/homeservefinance/eslint-config.git#v0.5.0`, e.g.
`agent_portal.ui`), so a change merged here reaches a consumer only when that consumer bumps
its `#vX.Y.Z` ref.

## Commands

CI (`.github/workflows/ci.yml`, every PR and push to `main`) runs, once per matrix leg
(Node 20 / ESLint 9.39.4, Node 22 / ESLint 10.10.0, Node 24 / ESLint 10.10.0):

```bash
npm ci
npm install --no-save eslint@<matrix version>
npm test            # = npm run lint && node --test test/config.test.js
```

`npm run lint` is `eslint . --report-unused-disable-directives --max-warnings 0`: the package
lints itself with its own preset via `eslint.config.js`. `.nvmrc` pins Node 24 locally;
`engines.node` is `>=20.19`. `.npmrc` sets `save-exact`, so every dependency is an exact version.

## Architecture

- `src/index.js` — the whole package. `frontendConfig({ tsconfigRootDir, ignores, reactCompiler, rules, typeCheck })` layers `@eslint/js` recommended, `typescript-eslint` recommended + stylistic (type-checked variants only when `typeCheck`), `simple-import-sort`, `unused-imports`, `react-hooks` and `react-refresh` (Vite) for `src/**`, `no-console: error` for `src/**`, relaxed rules for `*.d.ts`, and the consumer's `rules` last.
- `test/config.test.js` — `node:test` suite: option validation, override merging, and the type-aware path run through a real `ESLint` instance on `test/fixtures/floating-promise.ts`.
- `eslint.config.js`, `tsconfig.json` — the package dogfooding itself (`checkJs: true`).
- `README.md` — consumer-facing install and usage; its `#vX.Y.Z` example must track the latest tag.

## Conventions

- Plain JS with JSDoc types; `tsconfig.json` type-checks it. No build step.
- Organisation policy (rules deliberately on or off for every frontend) lives here. Temporary migration warnings belong in the consuming app, where they stay visible and removable.
- `typeCheck` defaults to on only inside VS Code (`process.env.VSCODE_PID`); a CLI lint that wants type-aware rules passes `typeCheck: true`.
- Dependencies are exact-pinned; Renovate (`renovate.json`, preset `github>homeservefinance/actions`) bumps them.

## Releasing

CI only tests; it does not tag. Releases are git tags made by hand: bump `version` in
`package.json` in the PR, merge, `git tag vX.Y.Z && git push origin vX.Y.Z` on the merge commit,
then bump the `#vX.Y.Z` ref in each consumer. Tags carry the `v` prefix.

Breaking rule changes follow add → migrate → remove: introduce the new rule as `warn` or behind
an option in one release, let consumers fix at their own pin bump, then promote to `error` or
drop the old rule in a later release. Every consumer lints with `--max-warnings 0`, so a rule
landing straight at `error` fails their CI the moment they bump.

## Things that will bite you

- The peer range is `eslint >=9.39 <11` and the matrix is the contract: config that only works on ESLint 10 fails the Node 20 / 9.39.4 leg.
- `frontendConfig` throws without `tsconfigRootDir`. Consumers pass `import.meta.dirname`, which needs Node >= 20.11.
- Browser globals, `react-hooks`, `react-refresh` and `no-console` apply only under `src/**`; everything else gets Node globals. A consumer with components outside `src/` gets none of the React rules.
- The type-aware test spins up `projectService`; it is the slow test and the one that breaks when `typescript-eslint` and `typescript` majors drift apart.

## Never

- Publish to npm or GitHub Packages; the repo stopped on purpose (`chore: stop publishing to GitHub Packages`).
- Add a consumer-specific override here; use that consumer's `rules` / `ignores` options.
- Tag without bumping `version`, or bump without tagging.
- Add a dependency with a caret or tilde range.
