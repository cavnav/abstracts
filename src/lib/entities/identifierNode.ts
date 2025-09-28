import type { EvaluateResult, IBaseNode, NodeType, PartialNode } from "$lib/types/ast";
import { BaseNode } from "./baseNode";
import type { NamespaceManager } from "../managers/namespaceManager";

export class IdentifierNode extends BaseNode< {
  type: NodeType = "IdentifierNode";

  name: string

  constructor(params: PartialNode) {
    super(params);

    this.name = params.name
  }

  // У идентификатора нет дочерних узлов
  get children(): IBaseNode[] {
    return [];
  }

  async evaluate({ namespace }: { namespace: NamespaceManager }): Promise<EvaluateResult> {
    const result = namespace.getVariable({ name: this.name });
    return result;
  }
}

export type IIdentifierNode = InstanceType<typeof IdentifierNode>;
