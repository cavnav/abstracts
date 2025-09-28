import type { ASTState } from "./types";
import { updateIndices, updateNeighbors, unregisterNode } from "./helpers";
import type { BaseNode } from "$lib/entities";
import { astStore } from "$lib/stores/store";

export class ASTFacade {
  state: ASTState;

  constructor(params: { state: ASTState }) {
    this.state = params.state;
  }

  /**
   * Заменяет старый узел новым
   */
  replaceNode(params: { oldNode: BaseNode; newNode: BaseNode }) {
    const { oldNode, newNode } = params;

    const parent = oldNode.parentId ? this.state.nodes.get(oldNode.parentId) : this.state.root;
    if (!parent) return;

    const leftNode = oldNode.prevId ? this.state.nodes.get(oldNode.prevId) : undefined;
    const rightNode = oldNode.nextId ? this.state.nodes.get(oldNode.nextId) : undefined;

    if (oldNode.siblingIndex === null) {
        throw new Error(`Cannot replace node: siblingIndex is null for node ${oldNode.id}`)        
    }
    
    parent.children[oldNode.siblingIndex] = newNode;

    newNode.parentId = parent.id;
    newNode.siblingIndex = oldNode.siblingIndex;

    updateNeighbors({ leftNode, newNode, rightNode });
    updateIndices({ children: parent.children ?? [], state: this.state });

    unregisterNode({ state: this.state, node: oldNode });
    this.state.activeNodeId = newNode.id;
  }

  /**
   * Вставляет новый узел в parent.children на указанную позицию
   */
  insertNode(params: { parentNode: BaseNode; newNode: BaseNode; positionIndex: number }) {
    const { parentNode, newNode, positionIndex } = params;

    parentNode.children.splice(positionIndex, 0, newNode);
    newNode.parentId = parentNode.id;

    const leftNode = parentNode.children[positionIndex - 1];
    const rightNode = parentNode.children[positionIndex + 1];

    updateNeighbors({ leftNode, newNode, rightNode });
    updateIndices({ children: parentNode.children, state: this.state });

    this.state.activeNodeId = newNode.id;
  }

  /**
   * Удаляет узел из AST
   */
  deleteNode(params: { targetNode: BaseNode }) {
    const { targetNode } = params;

    const parent = targetNode.parentId ? this.state.nodes.get(targetNode.parentId) : this.state.root;
    if (!parent || !parent.children) return;

    const leftNode = targetNode.prevId ? this.state.nodes.get(targetNode.prevId) : undefined;
    const rightNode = targetNode.nextId ? this.state.nodes.get(targetNode.nextId) : undefined;

    updateNeighbors({ leftNode, newNode: undefined, rightNode });

    if (targetNode.siblingIndex === null) {
        throw new Error(`Cannot replace node: siblingIndex is null for node ${targetNode.id}`)        
    }

    parent.children.splice(targetNode.siblingIndex ?? 0, 1);
    updateIndices({ children: parent.children, state: this.state });

    unregisterNode({ state: this.state, node: targetNode });

    // Выбираем новый активный узел: справа → слева → родитель
    this.state.activeNodeId = rightNode?.id ?? leftNode?.id ?? parent.id;
  }
}


export const astFacade = new ASTFacade({ state: astStore });