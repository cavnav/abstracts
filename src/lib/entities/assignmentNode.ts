import type { NodeType } from "$lib/types/nodeTypes"
import { EvaluableNode } from "./EvaluableNode"
import type { IdentifierNode } from "./IdentifierNode"

export class AssignmentNode extends EvaluableNode {
  type: NodeType = 'Assignment'
  left: IdentifierNode
  right: EvaluableNode

  constructor(params: {
    id: string
    left: IdentifierNode
    right: EvaluableNode
  }) {
    super({id: params.id, value: null})
    this.left = params.left
    this.right = params.right
  }
}
