import type {
  EvaluateResult,
  IBaseNode,
  NodeType,
  PartialNode,
} from "$lib/types/ast";
import { BaseNode } from "./baseNode";
import type { NamespaceManager } from "../managers/namespaceManager";



export class AssignmentNode extends BaseNode<AssignmentValue> {
  type: NodeType = "AssignmentNode";

  constructor(params: PartialNode<AssignmentValue>) {
    super(params);
  }

  get children(): IBaseNode[] {
    const children: IBaseNode[] = [];
    if (!this.value) {
      return []
    }
    if (this.value.left) children.push(this.value.left);
    if (this.value.right) children.push(this.value.right);
    return children;
  }

  async evaluate({ namespace }: { namespace: NamespaceManager }): EvaluateResult {
    if (!this.value?.left || !this.value?.right) return;

    const result = await this.value.right.evaluate({ namespace });

    if (this.value.left.type === "IdentifierNode") {
      namespace.setVariable({
        name: this.value.left.name,
        value: result,
      });
    }

    return result;
  }
}
