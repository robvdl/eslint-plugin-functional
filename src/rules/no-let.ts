import { type TSESTree } from "@typescript-eslint/utils";
import {
  type JSONSchema4,
  type JSONSchema4ObjectSchema,
} from "@typescript-eslint/utils/json-schema";
import { type RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { deepmerge } from "deepmerge-ts";

import {
  type IgnoreIdentifierPatternOption,
  shouldIgnorePattern,
  shouldIgnoreInFunction,
  ignoreIdentifierPatternOptionSchema,
} from "#eslint-plugin-functional/options";
import {
  type RuleResult,
  type NamedCreateRuleMetaWithCategory,
  createRule,
} from "#eslint-plugin-functional/utils/rule";
import { isInForLoopInitializer } from "#eslint-plugin-functional/utils/tree";

/**
 * The name of this rule.
 */
export const name = "no-let" as const;

/**
 * The options this rule can take.
 */
type Options = [
  IgnoreIdentifierPatternOption & {
    allowInForLoopInit: boolean;
    allowInFunctions: boolean;
  },
];

/**
 * The schema for the rule options.
 */
const schema: JSONSchema4[] = [
  {
    type: "object",
    properties: deepmerge(ignoreIdentifierPatternOptionSchema, {
      allowInForLoopInit: {
        type: "boolean",
      },
      allowInFunctions: {
        type: "boolean",
      },
    } satisfies JSONSchema4ObjectSchema["properties"]),
    additionalProperties: false,
  },
];

/**
 * The default options for the rule.
 */
const defaultOptions: Options = [
  {
    allowInForLoopInit: false,
    allowInFunctions: false,
  },
];

/**
 * The possible error messages.
 */
const errorMessages = {
  generic: "Unexpected let, use const instead.",
} as const;

/**
 * The meta data for this rule.
 */
const meta: NamedCreateRuleMetaWithCategory<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    category: "No Mutations",
    description: "Disallow mutable variables.",
  },
  messages: errorMessages,
  schema,
};

/**
 * Check if the given VariableDeclaration violates this rule.
 */
function checkVariableDeclaration(
  node: TSESTree.VariableDeclaration,
  context: Readonly<RuleContext<keyof typeof errorMessages, Options>>,
  options: Readonly<Options>,
): RuleResult<keyof typeof errorMessages, Options> {
  const [optionsObject] = options;
  const { allowInForLoopInit, ignoreIdentifierPattern, allowInFunctions } =
    optionsObject;

  if (
    node.kind !== "let" ||
    shouldIgnoreInFunction(node, context, allowInFunctions) ||
    shouldIgnorePattern(node, context, ignoreIdentifierPattern) ||
    (allowInForLoopInit && isInForLoopInitializer(node))
  ) {
    return {
      context,
      descriptors: [],
    };
  }

  return {
    context,
    descriptors: [{ node, messageId: "generic" }],
  };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>(
  name,
  meta,
  defaultOptions,
  {
    VariableDeclaration: checkVariableDeclaration,
  },
);
