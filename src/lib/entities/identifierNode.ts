import type { NodeType } from "$lib/types/nodeTypes";
import type { EvaluateResult } from "$lib/types/evaluateResult";
import { EvaluableNode } from "./EvaluableNode";

export class IdentifierNode extends EvaluableNode {
  type: NodeType = "Identifier";

  constructor(params: {id: string, value: EvaluateResult}) {
    super({id: params.id, value: null});
    this.value = params.value
  }
}

export type IIdentifierNode = InstanceType<typeof IdentifierNode>;
