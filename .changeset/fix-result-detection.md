---
'@bufferings/eslint-plugin-neverthrow': patch
---

Fix Result detection issues

- Fix await expressions to be handled properly in Result detection
- Add support for isOk/isErr methods as valid Result handling
- Fix false positive on class property definitions (ClassProperty → PropertyDefinition)
