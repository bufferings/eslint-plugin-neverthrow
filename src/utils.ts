import { ESLintUtils } from '@typescript-eslint/utils';

export enum MessageIds {
  MUST_USE = 'mustUseResult',
}

export interface NeverthrowRuleDocs {
  description: string;
  recommended?: boolean;
  requiresTypeChecking?: boolean;
}

export const createRule = ESLintUtils.RuleCreator<NeverthrowRuleDocs>(
  (name) =>
    `https://github.com/bufferings/eslint-plugin-neverthrow/tree/main/docs/rules/${name}.md`
);
