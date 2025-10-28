import type { NodeType } from "./nodeTypes";

// Базовый интерфейс узла без методов (для конструктора и сериализации)
export interface INodeModel {
  id: string
  type: NodeType;
}

