import { ESLintUtils } from '@typescript-eslint/utils';

export enum MessageIds {
  MUST_USE = 'mustUseResult',
}

export interface ExampleTypedLintingRuleDocs {
  description: string;
  recommended?: boolean;
  requiresTypeChecking?: boolean;
}

export const createRule = ESLintUtils.RuleCreator<ExampleTypedLintingRuleDocs>(
  (name) =>
    `https://github.com/typescript-eslint/examples/tree/main/eslint-plugin-example-typed-linting/docs/${name}.md`
);
