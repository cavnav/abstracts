// import type { EvaluateResult, IBaseNode, NodeType, PartialNode } from "$lib/types/ast";
// import type { INamespaceManager } from "$lib/types/namespaceManager";
// import { BaseNode } from "./baseNode";

// export class BinaryOperationNode extends BaseNode {
//   type: NodeType = "BinaryOperationNode";

//   constructor(props: PartialNode) {
//     super(props)
//     this.type = 'BinaryOperationNode'
//   }

//   cloneWith(overrides: PartialNode): IBaseNode {
//     return new BinaryOperationNode({ ...this, ...overrides });
//   }

//   async evaluate(context: {namespace: INamespaceManager}): EvaluateResult {
//     const [left, right] = this.value;
//     if (!left || !right) return;

//     const a = await left.evaluate(context);
//     const b = await right.evaluate(context);

//     switch (this.name) {
//         case "+":
//             if (typeof a === "number" && typeof b === "number") return a + b;
//             break;
//         case "-":
//             if (typeof a === "number" && typeof b === "number") return a - b;
//             break;
//         case "*":
//             if (typeof a === "number" && typeof b === "number") return a * b;
//             break;
//         case "/":
//             if (typeof a === "number" && typeof b === "number") return a / b;
//             break;
//         }

//     throw new Error(
//     `Unsupported operands for operator '${this.name}': ${typeof a} and ${typeof b}`
//     );

//   }
// }

// export type IBinaryOperationNodeNode = InstanceType<typeof BinaryOperationNode>