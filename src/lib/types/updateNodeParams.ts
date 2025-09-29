import type { NodeType, TAssignmentNodeValue, TIdentifierNodeValue, TLiteralNodeValue } from "./nodeTypes";

// Для каждого типа узла описываем поля, которые можно обновлять
type NodeUpdateMap = {
  LiteralNode: { value: TLiteralNodeValue };
  IdentifierNode: { value: TIdentifierNodeValue };
  BinaryOperationNode: { value: {operator: string} }; // пример
  AssignmentNode: {value: TAssignmentNodeValue } // пример
  ProgrammNode: { value: null }; // ничего обновлять не нужно
};

// Универсальный тип для update
export type UpdateNodeParams<T extends NodeType = NodeType> = NodeUpdateMap[T];