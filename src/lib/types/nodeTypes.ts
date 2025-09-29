import type { IBaseNode } from "./ast";

// Определяем базовые типы узлов
export type NodeType = 
  | "LiteralNode"
  | "IdentifierNode"
  | "BinaryOperationNode"
  | "AssignmentNode"
  | "ProgrammNode";

  
export type TLiteralNodeValue = string | number | boolean;  

export type TAssignmentNodeValue = {
  left: IBaseNode;
  right: IBaseNode | null;
};

export type TIdentifierNodeValue = string