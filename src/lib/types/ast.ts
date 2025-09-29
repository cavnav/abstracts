import type { INamespaceManager } from "./namespaceManager";
import type { NodeType } from "./nodeTypes";
import type { UpdateNodeParams } from "./updateNodeParams";

export type INodeId = string;

export type PrimitiveValue = number | string | boolean;

export type NodeConstructor<T> = new (init: INode<T>) => IBaseNode<T>;



// Результат вычисления узла
export type EvaluateResult = Promise<PrimitiveValue | IBaseNode | void>;

export type PartialNode<T = unknown> = Partial<INode<T>> & { id: INodeId, value?: T };

// Интерфейс базового узла
export interface IBaseNode<T = unknown> extends INode<T> {
  // получение дочерних узлов (для обхода AST)
  readonly children: IBaseNode[];

  // вычисление значения узла
  evaluate(context: { namespace: INamespaceManager }): EvaluateResult | Promise<EvaluateResult>;

  update(params: UpdateNodeParams): void;

}

// Базовый интерфейс узла без методов (для конструктора и сериализации)
export interface INode<T> {
  id: INodeId;
  type: NodeType;
  nextId: INodeId | null;
  prevId: INodeId | null;
  parentId: INodeId | null;
  siblingIndex: number | null

  value?: T
}
