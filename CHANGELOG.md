# @bufferings/eslint-plugin-neverthrow

## 0.3.0-beta.2

### Patch Changes

- [#33](https://github.com/bufferings/eslint-plugin-neverthrow/pull/33) [`c7d68a8`](https://github.com/bufferings/eslint-plugin-neverthrow/commit/c7d68a82a35c42bc584ef5892d1c6900ef752e1b) Thanks [@bufferings](https://github.com/bufferings)! - fix: detect `await Promise<Result>` correctly in `must-use-result` rule

## 0.3.0-beta.1

### Patch Changes

- [#31](https://github.com/bufferings/eslint-plugin-neverthrow/pull/31) [`6c6dd7e`](https://github.com/bufferings/eslint-plugin-neverthrow/commit/6c6dd7e5ab547cca3e1c4c2fdb5600a96af237d4) Thanks [@bufferings](https://github.com/bufferings)! - Fix Result detection issues
  - Fix await expressions to be handled properly in Result detection
  - Add support for isOk/isErr methods as valid Result handling
  - Fix false positive on class property definitions (ClassProperty → PropertyDefinition)

## 0.3.0-beta.0

### Minor Changes

- [#19](https://github.com/bufferings/eslint-plugin-neverthrow/pull/19) [`5bb28a8`](https://github.com/bufferings/eslint-plugin-neverthrow/commit/5bb28a8710e19007a42a612cd5db86c814bf9a8b) Thanks [@dependabot](https://github.com/apps/dependabot)! - Fix type portability issues and align typescript-eslint versions
  - Add explicit type annotations to fix non-portable inferred types
  - Remove deprecated @types/eslint\_\_js stub package
  - Upgrade @typescript-eslint/utils to 8.48.0 to align with other typescript-eslint packages
  - Update peerDependencies to require @typescript-eslint/parser >=8.48.0
  - Drop Node.js 18 support (EOL April 2025), require Node.js >=20.0.0

### Patch Changes

- [#16](https://github.com/bufferings/eslint-plugin-neverthrow/pull/16) [`66b020f`](https://github.com/bufferings/eslint-plugin-neverthrow/commit/66b020fecef2f826c82c478b769587c1c231ccb3) Thanks [@bufferings](https://github.com/bufferings)! - Migrate from semantic-release to changesets for release management
