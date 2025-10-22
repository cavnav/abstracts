import type { NodeType } from "$lib/types/nodeTypes"
import { EvaluableNode } from "./EvaluableNode"
import type { IdentifierNode } from "./IdentifierNode"

export class AssignmentNode extends EvaluableNode {
  type: NodeType = 'Assignment'
  left: IdentifierNode
  right: EvaluableNode

  constructor({
    left,
    right,
  }: {
    left: IdentifierNode
    right: EvaluableNode
  }) {
    super({value: null})
    this.left = left
    this.right = right
  }
}
