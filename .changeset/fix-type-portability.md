---
'@bufferings/eslint-plugin-neverthrow': patch
---

Fix type portability issues and align @typescript-eslint versions

- Add explicit type annotations to fix non-portable inferred types
- Remove deprecated @types/eslint\_\_js stub package
- Upgrade @typescript-eslint/utils to 8.48.0 to align with other typescript-eslint packages
- Update peerDependencies to require @typescript-eslint/parser >=8.48.0
