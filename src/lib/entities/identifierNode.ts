import type { EvaluateResult, IBaseNode, PartialNode } from "$lib/types/ast";
import { BaseNode } from "./baseNode";
import type { NamespaceManager } from "../managers/namespaceManager";
import type { NodeType, TIdentifierNodeValue } from "$lib/types/nodeTypes";
import type { UpdateNodeParams } from "$lib/types/updateNodeParams";

export class IdentifierNode extends BaseNode<TIdentifierNodeValue> {
  type: NodeType = "IdentifierNode";


  constructor(params: PartialNode<TIdentifierNodeValue>) {
    super(params);
    this.value = params.value
  }

  // У идентификатора нет дочерних узлов
  get children(): IBaseNode[] {
    return [];
  }

  async evaluate({ namespace }: { namespace: NamespaceManager }): Promise<EvaluateResult> {
    if (this.value === undefined) {
      return;      
    }

    const result = namespace.getVariable({ name: this.value });
    return result;
  }

  update(params: UpdateNodeParams<"IdentifierNode">) {
    this.value = params.value
  }
}

export type IIdentifierNode = InstanceType<typeof IdentifierNode>;
