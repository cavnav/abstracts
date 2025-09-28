import type { EvaluateResult, INodeId, NodeType, IBaseNode, PartialNode} from "$lib/types/ast";
import type { INamespaceManager } from "$lib/types/namespaceManager";

export abstract class BaseNode<T = unknown> implements IBaseNode<T> {
  id: INodeId;
  abstract type: NodeType;
  prevId: INodeId | null;
  nextId: INodeId | null;
  parentId: INodeId | null;
  siblingIndex: number | null = null

  value: T | null;

  constructor({
    id,
    value = null,
    prevId = null,
    nextId = null,
    parentId = null,
  }: PartialNode<T>) {
    this.id = id
    this.value = value;
    this.prevId = prevId;
    this.nextId = nextId;
    this.parentId = parentId;
  }

  abstract get children(): IBaseNode[];

  abstract evaluate(context: { namespace: INamespaceManager }): EvaluateResult | Promise<EvaluateResult>;
}
