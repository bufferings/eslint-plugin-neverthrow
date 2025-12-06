import {
  AST_NODE_TYPES,
  ESLintUtils,
  type ParserServices,
  type TSESLint,
  TSESTree,
} from '@typescript-eslint/utils';
import { unionTypeParts } from 'tsutils';
import { TypeChecker } from 'typescript';

import { createRule, MessageIds } from '../utils.js';

function matchAny(nodeTypes: string[]) {
  return `:matches(${nodeTypes.join(', ')})`;
}
const resultSelector = matchAny([
  // AST_NODE_TYPES.Identifier,
  AST_NODE_TYPES.CallExpression,
  AST_NODE_TYPES.NewExpression,
  AST_NODE_TYPES.AwaitExpression,
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
const checkedMethods = ['isOk', 'isErr'];

// evaluate if the node is result-like
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
  const memberExpression = node.parent;
  if (memberExpression?.type === AST_NODE_TYPES.MemberExpression) {
    const methodName = findMemberName(memberExpression);
    const methodIsCalled = isMemberCalledFn(memberExpression);
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

const isCheckedResult = (node: TSESTree.Node): boolean => {
  if (node.type === AST_NODE_TYPES.Identifier) {
    if (node.parent?.type === AST_NODE_TYPES.MemberExpression) {
      const propertyName =
        node.parent.property.type === AST_NODE_TYPES.Identifier
          ? node.parent.property.name
          : null;
      const parentIsCalledExpression =
        node.parent.parent?.type === AST_NODE_TYPES.CallExpression;
      return (
        !!propertyName &&
        checkedMethods.includes(propertyName) &&
        parentIsCalledExpression
      );
    }
  }
  return false;
};

const endTransverse = [AST_NODE_TYPES.BlockStatement, AST_NODE_TYPES.Program];
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
  if (node.type === AST_NODE_TYPES.AwaitExpression) {
    // For AwaitExpression, check if the parent is returned
    if (!node.parent) {
      return false;
    }
    return isReturned(checker, parserServices, node.parent);
  }
  if (!node.parent) {
    return false;
  }
  return isReturned(checker, parserServices, node.parent);
}

const ignoreParents = [
  AST_NODE_TYPES.ClassDeclaration,
  AST_NODE_TYPES.FunctionDeclaration,
  AST_NODE_TYPES.MethodDefinition,
  AST_NODE_TYPES.PropertyDefinition,
];

/**
 * @returns A boolean indicating whether the node is not handled.
 */
function processSelector(
  context: TSESLint.RuleContext<MessageIds, []>,
  checker: TypeChecker,
  parserServices: ParserServices,
  node: TSESTree.Node,
  reportAs = node,
  isReferenceNode = false
): boolean {
  if (node.parent?.type.startsWith('TS')) {
    return false;
  }
  if (node.parent && ignoreParents.includes(node.parent.type)) {
    return false;
  }

  // Check if the node itself is result-like
  // For AwaitExpression, this checks the awaited result type (e.g., Result from Promise<Result>)
  if (!isResultLike(checker, parserServices, node)) {
    return false;
  }

  // Skip CallExpression nodes that are inside AwaitExpression to avoid duplicate reporting
  if (
    node.type === AST_NODE_TYPES.CallExpression &&
    node.parent?.type === AST_NODE_TYPES.AwaitExpression
  ) {
    return false;
  }

  if (isHandledResult(node)) {
    return false;
  }

  if (isCheckedResult(node)) {
    return false;
  }

  if (isReturned(checker, parserServices, node)) {
    return false;
  }

  const anyHandled = handleAssignation(
    context,
    checker,
    parserServices,
    node,
    reportAs
  );
  if (anyHandled) {
    return false;
  }

  // make sure not reporting to the same node multiple times during recursive calls
  if (!isReferenceNode) {
    context.report({
      node: reportAs,
      messageId: MessageIds.MUST_USE,
    });
  }

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

function handleAssignation(
  context: TSESLint.RuleContext<MessageIds, []>,
  checker: TypeChecker,
  parserServices: ParserServices,
  node: TSESTree.Node,
  reportAs: TSESTree.Node = node
): boolean {
  const assignedTo = getAssignation(checker, parserServices, node);
  const currentScope = context.sourceCode.getScope(node);

  // Check if is assigned to variables
  if (assignedTo) {
    const variable = currentScope.set.get(assignedTo.name);
    const references =
      variable?.references.filter((ref) => ref.identifier !== assignedTo) ?? [];

    /**
     * Try to mark the first assigned variable to be reported, if not, keep
     * the original one.
     */
    reportAs = variable?.references[0].identifier ?? reportAs;

    // check if any reference is handled by recursive calling
    return references.some(
      (ref) =>
        !processSelector(
          context,
          checker,
          parserServices,
          ref.identifier,
          reportAs,
          true
        )
    );
  }

  return false;
}
