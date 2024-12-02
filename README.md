# eslint-plugin-neverthrow

[![npm version](https://img.shields.io/npm/v/@bufferings/eslint-plugin-neverthrow.svg)](https://www.npmjs.com/package/@bufferings/eslint-plugin-neverthrow)
[![Downloads/month](https://img.shields.io/npm/dm/@bufferings/eslint-plugin-neverthrow.svg)](http://www.npmtrends.com/@bufferings/eslint-plugin-neverthrow)

## Notice

forked from [mdbetancourt/eslint-plugin-neverthrow](https://github.com/mdbetancourt/eslint-plugin-neverthrow)

## Installation

Use [npm](https://www.npmjs.com/) or a compatible tool to install.

```bash
# npm
npm install --save-dev @bufferings/eslint-plugin-neverthrow

# pnpm
pnpm install --save-dev @bufferings/eslint-plugin-neverthrow
```

### Requirements

- Node.js v18.0.0 or newer versions.
- ESLint v9.0.0 or newer versions.

## Usage

Write your config file such as `eslint.config.js`.

```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import neverthrowPlugin from '@bufferings/eslint-plugin-neverthrow';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  neverthrowPlugin.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.config.*'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }
);
```

See also [Configure ESLint - ESLint](https://eslint.org/docs/latest/use/configure/).

## Rules

<!--RULE_TABLE_BEGIN-->

### Possible Errors

| Rule ID                                                       | Description                                                                               |     |
| :------------------------------------------------------------ | :---------------------------------------------------------------------------------------- | :-: |
| [neverthrow/must-use-result](./docs/rules/must-use-result.md) | Not handling neverthrow result is a possible error because errors could remain unhandled. | ⭐️ |

<!--RULE_TABLE_END-->

## Semantic Versioning Policy

This plugin follows [Semantic Versioning](http://semver.org/) and [ESLint's Semantic Versioning Policy](https://github.com/eslint/eslint#semantic-versioning-policy).

## Changelog

- [GitHub Releases](https://github.com/bufferings/eslint-plugin-neverthrow/releases)

## Contributing

Welcome your contribution!

See also [Contribute to ESLint](https://eslint.org/docs/latest/contribute/).

## Development Tools

- `pnpm test` runs tests.
