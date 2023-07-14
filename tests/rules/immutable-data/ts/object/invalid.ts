import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import dedent from "dedent";

import { type rule } from "~/rules/immutable-data";
import {
  type InvalidTestCaseSet,
  type MessagesOf,
  type OptionsOf,
} from "~/tests/helpers/util";

const tests: Array<
  InvalidTestCaseSet<MessagesOf<typeof rule>, OptionsOf<typeof rule>>
> = [
  // Disallowed object mutation patterns.
  {
    code: dedent`
      var x = {a: 1};
      x.foo = "bar";
      x["foo"] = "bar";
      x.a += 1;
      x.a -= 1;
      x.a *= 1;
      x.a /= 1;
      x.a %= 1;
      x.a <<= 1;
      x.a >>= 1;
      x.a >>>= 1;
      x.a &= 1;
      x.a |= 1;
      x.a ^= 1;
      delete x.a;
      delete x["a"];
      x.a++;
      x.a--;
      ++x.a;
      --x.a;
      if (x.a = 2) {}
      if (x.a++) {}
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 2,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 4,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 5,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 6,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 7,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 8,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 9,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 10,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 11,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 12,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 13,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 14,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UnaryExpression,
        line: 15,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UnaryExpression,
        line: 16,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UpdateExpression,
        line: 17,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UpdateExpression,
        line: 18,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UpdateExpression,
        line: 19,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UpdateExpression,
        line: 20,
        column: 1,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 21,
        column: 5,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.UpdateExpression,
        line: 22,
        column: 5,
      },
    ],
  },
  // Disallow Object.assign on identifiers.
  {
    code: dedent`
      var x = { msg1: "hello", obj: { a: 1, b: 2} };

      var a = Object.assign(x, { msg2: "world" });
      var b = Object.assign(x.obj, { msg2: "world" });
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "object",
        type: AST_NODE_TYPES.CallExpression,
        line: 3,
        column: 9,
      },
      {
        messageId: "object",
        type: AST_NODE_TYPES.CallExpression,
        line: 4,
        column: 9,
      },
    ],
  },
  // Disallow other object mutation methods.
  {
    code: dedent`
      var foo = { a: 1 };
      Object.defineProperties(foo, { b: { value: 2, writable: false }});
      Object.defineProperty(foo, "c", { value: 3, writable: false });
      Object.setPrototypeOf(foo, null);
    `,
    optionsSet: [[{ assumeTypes: true }]],
    errors: [
      {
        messageId: "object",
        type: AST_NODE_TYPES.CallExpression,
        line: 2,
        column: 1,
      },
      {
        messageId: "object",
        type: AST_NODE_TYPES.CallExpression,
        line: 3,
        column: 1,
      },
      {
        messageId: "object",
        type: AST_NODE_TYPES.CallExpression,
        line: 4,
        column: 1,
      },
    ],
  },
  {
    code: dedent`
      const x = {a: 1};
      x.a **= 1;
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 2,
        column: 1,
      },
    ],
  },
  // No mutation in class methods.
  {
    code: dedent`
      class Klass {
        bar = 1;

        constructor() {
          this.baz = "hello";
        }

        zoo() {
          this.bar = 2;
          this.baz = 3;
        }
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 9,
        column: 5,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 10,
        column: 5,
      },
    ],
  },
  // Catch non-field mutation in classes.
  {
    code: dedent`
      class Klass {
        mutate() {
          let data = { prop: 0 };
          data.prop = 1;
        }
      }
    `,
    optionsSet: [[{ ignoreClasses: "fieldsOnly" }]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 4,
        column: 5,
      },
    ],
  },
  {
    code: dedent`
      class Klass {
        bar = 1;
        baz: string;

        constructor() {
          this.baz = "hello";
        }

        zoo() {
          this.bar = 2;
          this.baz = 3;
        }
      }
    `,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 10,
        column: 5,
      },
      {
        messageId: "generic",
        type: AST_NODE_TYPES.AssignmentExpression,
        line: 11,
        column: 5,
      },
    ],
  },
];

export default tests;
