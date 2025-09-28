import type { BaseNode } from "$lib/entities";
import type { ASTState } from "./types";

export interface UpdateIndicesParams {
  children: BaseNode[];
  state?: ASTState;
}

/**
 * Обновляет siblingIndex всех детей и регистрирует их в ASTState
 */
export function updateIndices(params: UpdateIndicesParams) {
  const { children, state } = params;

  children.forEach((child, i) => {
    child.siblingIndex = i;
    if (state) state.nodes.set(child.id, child); // регистрация/обновление
  });
}

export interface UpdateNeighborsParams {
  leftNode?: BaseNode;
  newNode?: BaseNode;
  rightNode?: BaseNode;
}

/**
 * Обновляет prevId/nextId для соседей и нового узла
 */
export function updateNeighbors(params: UpdateNeighborsParams) {
  const { leftNode, newNode, rightNode } = params;

  if (newNode) {
    newNode.prevId = leftNode?.id ?? null;
    newNode.nextId = rightNode?.id ?? null;
  }

  if (leftNode) leftNode.nextId = newNode ? newNode.id : rightNode?.id ?? null;
  if (rightNode) rightNode.prevId = newNode ? newNode.id : leftNode?.id ?? null;
}

export interface UnregisterNodeParams {
  state: ASTState;
  node: BaseNode;
}

/**
 * Удаляет узел из state.nodes
 */
export function unregisterNode(params: UnregisterNodeParams) {
  const { state, node } = params;
  state.nodes.delete(node.id);
}
