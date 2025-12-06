import type { TSESLint } from '@typescript-eslint/utils';

import { rule as mustUseResult } from './must-use-result.js';

export const rules: Record<string, TSESLint.LooseRuleDefinition> = {
  'must-use-result': mustUseResult,
};
