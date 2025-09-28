import type { INamespaceManager } from "./namespaceManager";

export type INodeId = string;

export type PrimitiveValue = number | string | boolean;

export type NodeConstructor<T> = new (init: INode<T>) => IBaseNode<T>;

// Определяем базовые типы узлов
export type NodeType = 
  | "LiteralNode"
  | "IdentifierNode"
  | "BinaryOperationNode"
  | "AssignmentNode"
  | "ProgrammNode";

// Результат вычисления узла
export type EvaluateResult = Promise<PrimitiveValue | IBaseNode | void>;

export type PartialNode<T = unknown> = Partial<INode<T>> & { id: INodeId };

// Интерфейс базового узла
export interface IBaseNode<T = unknown> extends INode<T> {
  // Метод вычисления значения узла
  evaluate(context: { namespace: INamespaceManager }): EvaluateResult | Promise<EvaluateResult>;

  // Метод получения дочерних узлов (для обхода AST)
  readonly children: IBaseNode[];
}

// Базовый интерфейс узла без методов (для конструктора и сериализации)
export interface INode<T> {
  id: INodeId;
  type: NodeType;
  nextId: INodeId | null;
  prevId: INodeId | null;
  parentId: INodeId | null;
  siblingIndex: number | null

  value: T | null
}
