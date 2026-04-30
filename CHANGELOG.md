# Changelog

## v0.4.12

[compare changes](https://github.com/wxt-dev/queue/compare/v0.4.11...v0.4.12)

### 🚀 Enhancements

- Improved memory managment and cleanup ([#11](https://github.com/wxt-dev/queue/pull/11))

### 🤖 CI

- Update deploy webhook ([a0300ae](https://github.com/wxt-dev/queue/commit/a0300ae))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.4.11

[compare changes](https://github.com/wxt-dev/queue/compare/v0.4.10...v0.4.11)

### 🏡 Chore

- Update download path for chrome crawler debugging ([6aab516](https://github.com/wxt-dev/queue/commit/6aab516))
- Switch to logger with JSON support ([23ac524](https://github.com/wxt-dev/queue/commit/23ac524))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.4.10

[compare changes](https://github.com/wxt-dev/queue/compare/v0.4.9...v0.4.10)

### 🩹 Fixes

- Update Chrome Web Store crawler selector for user count ([#9](https://github.com/wxt-dev/queue/pull/9))

### 🏡 Chore

- Use `--frozen-lockfile` in docker image ([53371e3](https://github.com/wxt-dev/queue/commit/53371e3))

### ❤️ Contributors

- WBW Software Admin ([@whiteboard-works](https://github.com/whiteboard-works))
- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.4.9

[compare changes](https://github.com/wxt-dev/queue/compare/v0.4.8...v0.4.9)

### 🚀 Enhancements

- Add `FirefoxAddon.slug`, `FirefoxAddon.guid`, and `EdgeAddon.productId` to model schema ([3ce60f3](https://github.com/wxt-dev/queue/commit/3ce60f3))

### 🏡 Chore

- Cleanup introspection error handling ([c07c5ea](https://github.com/wxt-dev/queue/commit/c07c5ea))

### 🤖 CI

- Use alpine docker image ([ae3909b](https://github.com/wxt-dev/queue/commit/ae3909b))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.4.8

[compare changes](https://github.com/wxt-dev/queue/compare/v0.4.7...v0.4.8)

### 🩹 Fixes

- Fix non-working cors short-circuit ([8096d77](https://github.com/wxt-dev/queue/commit/8096d77))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.4.7

[compare changes](https://github.com/wxt-dev/queue/compare/v0.4.6...v0.4.7)

### 🩹 Fixes

- Revert dockerfile completely ([7196fed](https://github.com/wxt-dev/queue/commit/7196fed))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.4.6

[compare changes](https://github.com/wxt-dev/queue/compare/v0.4.5...v0.4.6)

### 🩹 Fixes

- Fix production docker image startup crash ([0025b07](https://github.com/wxt-dev/queue/commit/0025b07))

### 🏡 Chore

- Cleanup GQL context type ([1613244](https://github.com/wxt-dev/queue/commit/1613244))

### 🤖 CI

- Use commit hashes for github actions ([b41b009](https://github.com/wxt-dev/queue/commit/b41b009))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.4.5

[compare changes](https://github.com/wxt-dev/queue/compare/v0.4.4...v0.4.5)

### 🚀 Enhancements

- Add support for getting edge extensions by CRX ID ([#7](https://github.com/wxt-dev/queue/pull/7))

### 💅 Refactors

- Standardize and share store definitions ([#8](https://github.com/wxt-dev/queue/pull/8))

### 🏡 Chore

- Switch to nano-staged ([25353e4](https://github.com/wxt-dev/queue/commit/25353e4))
- Fix cors issue due to an async global hook ([a249ffb](https://github.com/wxt-dev/queue/commit/a249ffb))
- Cleanup unnecessary config files ([aa0d746](https://github.com/wxt-dev/queue/commit/aa0d746))
- Remove separate markdown files ([b9f50e0](https://github.com/wxt-dev/queue/commit/b9f50e0))
- Cleanup docker ignore ([d87433f](https://github.com/wxt-dev/queue/commit/d87433f))
- Add cspell ([422d817](https://github.com/wxt-dev/queue/commit/422d817))
- Optimize docker image size 225MB -> 107MB ([b5b9a07](https://github.com/wxt-dev/queue/commit/b5b9a07))
- Fix `ctx: any` in graphql resolvers ([ae09580](https://github.com/wxt-dev/queue/commit/ae09580))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.4.4

[compare changes](https://github.com/wxt-dev/queue/compare/v0.4.3...v0.4.4)

### 🚀 Enhancements

- Add base `Extension` interface to GQL schema ([5dbd328](https://github.com/wxt-dev/queue/commit/5dbd328))

### 📖 Documentation

- Fix typo ([48c2fe3](https://github.com/wxt-dev/queue/commit/48c2fe3))
- Update README ([d794b51](https://github.com/wxt-dev/queue/commit/d794b51))

### 🏡 Chore

- Upgrade to Bun 1.3.12 ([27d90bc](https://github.com/wxt-dev/queue/commit/27d90bc))
- Fix failing tests ([fdcce65](https://github.com/wxt-dev/queue/commit/fdcce65))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.4.3

[compare changes](https://github.com/wxt-dev/queue/compare/v0.4.2...v0.4.3)

### 📖 Documentation

- Update OpenAPI docs, adding descriptions and examples to everything ([63f6cf2](https://github.com/wxt-dev/queue/commit/63f6cf2))

### 🏡 Chore

- Fix type error ([ca8bb8c](https://github.com/wxt-dev/queue/commit/ca8bb8c))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.4.2

[compare changes](https://github.com/wxt-dev/queue/compare/v0.4.1...v0.4.2)

### 🩹 Fixes

- Accept CORS requests correctly ([c2b92d5](https://github.com/wxt-dev/queue/commit/c2b92d5))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.4.1

[compare changes](https://github.com/wxt-dev/queue/compare/v0.4.0...v0.4.1)

### 🩹 Fixes

- Rename params ([4f5f246](https://github.com/wxt-dev/queue/commit/4f5f246))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.4.0

[compare changes](https://github.com/wxt-dev/queue/compare/v0.3.20...v0.4.0)

### 🚀 Enhancements

- ⚠️ Upgrade bun and refactor routing ([#6](https://github.com/wxt-dev/queue/pull/6))

### 🏡 Chore

- Update changelog generation config ([52f936b](https://github.com/wxt-dev/queue/commit/52f936b))
- Add MIT License ([1ee6329](https://github.com/wxt-dev/queue/commit/1ee6329))

### 🤖 CI

- Fix dockerfile ([5ee13a5](https://github.com/wxt-dev/queue/commit/5ee13a5))

#### ⚠️ Breaking Changes

- ⚠️ Upgrade bun and refactor routing ([#6](https://github.com/wxt-dev/queue/pull/6))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v0.3.20

[compare changes](https://github.com/wxt-dev/queue/compare/v0.3.19...v0.3.20)

### 🏡 Chore

- Comment out debugging file write ([2c53851](https://github.com/wxt-dev/queue/commit/2c53851))
- Add comment detailing adding test fixture for chrome crawler ([4ff5618](https://github.com/wxt-dev/queue/commit/4ff5618))

## v0.3.19

[compare changes](https://github.com/wxt-dev/queue/compare/v0.3.18...v0.3.19)

### 🩹 Fixes

- Refactor CWS crawler to more safely extract extension details ([#5](https://github.com/wxt-dev/queue/pull/5))

## v0.3.18

[compare changes](https://github.com/wxt-dev/queue/compare/v0.3.17...v0.3.18)

### 🩹 Fixes

- Fix broken chrome crawler after layout change ([f702361](https://github.com/wxt-dev/queue/commit/f702361))

### 🏡 Chore

- Update failing tests ([2ced470](https://github.com/wxt-dev/queue/commit/2ced470))

## v0.3.17

[compare changes](https://github.com/wxt-dev/queue/compare/v0.3.16...v0.3.17)

### 🩹 Fixes

- Remove logs ([762e25a](https://github.com/wxt-dev/queue/commit/762e25a))

## v0.3.16

[compare changes](https://github.com/wxt-dev/queue/compare/v0.3.15...v0.3.16)

### 🩹 Fixes

- Properly remove the second comma from user counts over 1,000,000 ([b43d9af](https://github.com/wxt-dev/queue/commit/b43d9af))

### 🏡 Chore

- Update lockfile ([f800177](https://github.com/wxt-dev/queue/commit/f800177))

## v0.3.15

[compare changes](https://github.com/wxt-dev/queue/compare/v0.3.14...v0.3.15)

### 🩹 Fixes

- Remove log ([e53264c](https://github.com/wxt-dev/queue/commit/e53264c))

## v0.3.14

[compare changes](https://github.com/wxt-dev/queue/compare/v0.3.13...v0.3.14)

### 🚀 Enhancements

- Extract screenshots from CWS and Firefox addons ([#3](https://github.com/wxt-dev/queue/pull/3))

### 🏡 Chore

- Bump bun version to 1.1.31 ([74249c1](https://github.com/wxt-dev/queue/commit/74249c1))

## v0.3.13

[compare changes](https://github.com/wxt-dev/queue/compare/v0.3.12...v0.3.13)

### 🩹 Fixes

- Only return null for crawl errors, not all extension in `chromeExtensions` ([f5c1c1b](https://github.com/wxt-dev/queue/commit/f5c1c1b))

## v0.3.12

[compare changes](https://github.com/wxt-dev/queue/compare/v0.3.11...v0.3.12)

### 🩹 Fixes

- Remove ' - Chrome Web Store' title suffix from extension names ([1ac0d9f](https://github.com/wxt-dev/queue/commit/1ac0d9f))

### 🏡 Chore

- Upgrade to bun V1.1.20 ([287dc2c](https://github.com/wxt-dev/queue/commit/287dc2c))

## v0.3.11

[compare changes](https://github.com/wxt-dev/queue/compare/v0.3.10...v0.3.11)

### 🩹 Fixes

- Reduce cache from 24 hours to 1 hour ([f564997](https://github.com/wxt-dev/queue/commit/f564997))

### 🏡 Chore

- Use @aklinker1/check to simplify checks ([90e10fe](https://github.com/wxt-dev/queue/commit/90e10fe))

## v0.3.10

[compare changes](https://github.com/wxt-dev/queue/compare/v0.3.9...v0.3.10)

### 🩹 Fixes

- Catch error when extension doesn't have any ratings ([d04b8b9](https://github.com/wxt-dev/queue/commit/d04b8b9))

### 🏡 Chore

- Update formatting ([2ff6c39](https://github.com/wxt-dev/queue/commit/2ff6c39))
- Upgrade bun to v1.0.35 ([514a865](https://github.com/wxt-dev/queue/commit/514a865))
- Fix failing test ([d177c46](https://github.com/wxt-dev/queue/commit/d177c46))

### 🤖 CI

- Add validation and release workflows ([2de0782](https://github.com/wxt-dev/queue/commit/2de0782))
- Remove PNPM usage ([2abe852](https://github.com/wxt-dev/queue/commit/2abe852))
- Fix type errors in CI ([cb0e62b](https://github.com/wxt-dev/queue/commit/cb0e62b))
- Fix release workflow ([f39781f](https://github.com/wxt-dev/queue/commit/f39781f))
