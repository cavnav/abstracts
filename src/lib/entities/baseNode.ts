import type { EvaluateResult, INodeId, IBaseNode, PartialNode} from "$lib/types/ast";
import type { INamespaceManager } from "$lib/types/namespaceManager";
import type { NodeType } from "$lib/types/nodeTypes";
import type { UpdateNodeParams } from "$lib/types/updateNodeParams";

export abstract class BaseNode<TValue = unknown> implements IBaseNode<TValue> {
  id: INodeId;
  abstract type: NodeType;
  prevId: INodeId | null;
  nextId: INodeId | null;
  parentId: INodeId | null;
  siblingIndex: number | null = null

  value?: TValue;

  constructor({
    id,
    value,
    prevId = null,
    nextId = null,
    parentId = null,
  }: PartialNode<TValue>) {
    this.id = id
    this.value = value;
    this.prevId = prevId;
    this.nextId = nextId;
    this.parentId = parentId;
  }

  abstract get children(): IBaseNode[];

  abstract evaluate(context: { namespace: INamespaceManager }): EvaluateResult | Promise<EvaluateResult>;
   
  // обновление данных узла
  abstract update(params: UpdateNodeParams): void;
}
