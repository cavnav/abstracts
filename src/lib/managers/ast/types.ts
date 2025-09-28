import type { BaseNode } from "$lib/entities";

export interface ASTState {
  nodes: Map<string, BaseNode>;   // быстрый доступ к узлам по id
  root: BaseNode;                 // programmNode (корневой)
  activeNodeId?: string;          // текущий активный узел
}
