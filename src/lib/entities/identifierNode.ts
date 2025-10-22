import type { NodeType } from "$lib/types/nodeTypes";
import type { EvaluateResult } from "$lib/types/evaluateResult";
import { EvaluableNode } from "./EvaluableNode";

export class IdentifierNode extends EvaluableNode {
  type: NodeType = "Identifier";

  constructor({value}: {value: EvaluateResult}) {
    super({value: null});
    this.value = value
  }
}

export type IIdentifierNode = InstanceType<typeof IdentifierNode>;
