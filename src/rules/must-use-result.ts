import { TSESTree } from '@typescript-eslint/types';
import { AST_NODE_TYPES } from '@typescript-eslint/types';
import type { ParserServices, TSESLint } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';
import { unionTypeParts } from 'tsutils';
import { TypeChecker } from 'typescript';

import { MessageIds } from '../utils.js';
import { createRule } from '../utils.js';

function matchAny(nodeTypes: string[]) {
  return `:matches(${nodeTypes.join(', ')})`;
}
const resultSelector = matchAny([
  // 'Identifier',
  'CallExpression',
  'NewExpression',
]);

const resultProperties = [
  'mapErr',
  'map',
  'andThen',
  'orElse',
  'match',
  'unwrapOr',
];

const handledMethods = ['match', 'unwrapOr', '_unsafeUnwrap'];

// evaluates inside the expression if it is result
// if result check that it is handled in the expression
// if it is unhandled checks if it is assigned or used as an argument to a function
// if it was assigned unhandled checks the entire variable block for handles
//   otherwise it was handled properly

function isResultLike(
  checker: TypeChecker,
  parserServices: ParserServices,
  node?: TSESTree.Node | null
): boolean {
  if (!node) return false;
  const tsNodeMap = parserServices.esTreeNodeToTSNodeMap.get(node);
  const type = checker.getTypeAtLocation(tsNodeMap);

  for (const ty of unionTypeParts(checker.getApparentType(type))) {
    if (
      resultProperties
        .map((p) => ty.getProperty(p))
        .every((p) => p !== undefined)
    ) {
      return true;
    }
  }
  return false;
}

function findMemberName(node?: TSESTree.MemberExpression): string | null {
  if (!node) return null;
  if (node.property.type !== AST_NODE_TYPES.Identifier) return null;

  return node.property.name;
}

function isMemberCalledFn(node?: TSESTree.MemberExpression): boolean {
  if (node?.parent?.type !== AST_NODE_TYPES.CallExpression) return false;
  return node.parent.callee === node;
}

function isHandledResult(node: TSESTree.Node): boolean {
  const memberExpresion = node.parent;
  if (memberExpresion?.type === AST_NODE_TYPES.MemberExpression) {
    const methodName = findMemberName(memberExpresion);
    const methodIsCalled = isMemberCalledFn(memberExpresion);
    if (methodName && handledMethods.includes(methodName) && methodIsCalled) {
      return true;
    }
    const parent = node.parent?.parent; // search for chain method .map().handler
    if (parent && parent?.type !== AST_NODE_TYPES.ExpressionStatement) {
      return isHandledResult(parent);
    }
  }
  return false;
}
const endTransverse = ['BlockStatement', 'Program'];
function getAssignation(
  checker: TypeChecker,
  parserServices: ParserServices,
  node: TSESTree.Node
): TSESTree.Identifier | undefined {
  if (
    node.type === AST_NODE_TYPES.VariableDeclarator &&
    isResultLike(checker, parserServices, node.init) &&
    node.id.type === AST_NODE_TYPES.Identifier
  ) {
    return node.id;
  }
  if (endTransverse.includes(node.type) || !node.parent) {
    return undefined;
  }
  return getAssignation(checker, parserServices, node.parent);
}

function isReturned(
  checker: TypeChecker,
  parserServices: ParserServices,
  node: TSESTree.Node
): boolean {
  if (node.type === AST_NODE_TYPES.ArrowFunctionExpression) {
    return true;
  }
  if (node.type === AST_NODE_TYPES.ReturnStatement) {
    return true;
  }
  if (node.type === AST_NODE_TYPES.BlockStatement) {
    return false;
  }
  if (node.type === AST_NODE_TYPES.Program) {
    return false;
  }
  if (!node.parent) {
    return false;
  }
  return isReturned(checker, parserServices, node.parent);
}

const ignoreParents = [
  'ClassDeclaration',
  'FunctionDeclaration',
  'MethodDefinition',
  'ClassProperty',
];

function processSelector(
  context: TSESLint.RuleContext<MessageIds, []>,
  checker: TypeChecker,
  parserServices: ParserServices,
  node: TSESTree.Node,
  reportAs = node
): boolean {
  if (node.parent?.type.startsWith('TS')) {
    return false;
  }
  if (node.parent && ignoreParents.includes(node.parent.type)) {
    return false;
  }
  if (!isResultLike(checker, parserServices, node)) {
    return false;
  }

  if (isHandledResult(node)) {
    return false;
  }
  // return getResult()
  if (isReturned(checker, parserServices, node)) {
    return false;
  }

  const assignedTo = getAssignation(checker, parserServices, node);
  const currentScope = context.sourceCode.getScope(node);

  // Check if is assigned
  if (assignedTo) {
    const variable = currentScope.set.get(assignedTo.name);
    const references =
      variable?.references.filter((ref) => ref.identifier !== assignedTo) ?? [];
    if (references.length > 0) {
      return references.some((ref) =>
        processSelector(
          context,
          checker,
          parserServices,
          ref.identifier,
          reportAs
        )
      );
    }
  }

  context.report({
    node: reportAs,
    messageId: MessageIds.MUST_USE,
  });
  return true;
}

export const rule = createRule({
  create(context) {
    const services = ESLintUtils.getParserServices(context);
    const checker = services?.program?.getTypeChecker();

    if (!checker || !services) {
      throw Error(
        'types not available, maybe you need set the parser to @typescript-eslint/parser'
      );
    }

    return {
      [resultSelector](node: TSESTree.Node) {
        return processSelector(context, checker, services, node);
      },
    };
  },
  meta: {
    docs: {
      description:
        'Not handling neverthrow result is a possible error because errors could remain unhandled.',
      recommended: true,
      requiresTypeChecking: true,
    },
    messages: {
      mustUseResult:
        'Result must be handled with either of match, unwrapOr or _unsafeUnwrap.',
    },
    type: 'problem',
    schema: [],
  },
  name: 'must-use-result',
  defaultOptions: [],
});
