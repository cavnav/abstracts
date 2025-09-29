import type { ASTState } from "./types";
import { updateIndices, updateNeighbors, unregisterNode } from "./helpers";
import type { BaseNode } from "$lib/entities";
import { astStore } from "$lib/stores/store";
import type { NodeType } from "$lib/types/nodeTypes";
import type { UpdateNodeParams } from "$lib/types/updateNodeParams";
import { nodesFactory } from "../nodesFactory";
import type { Writable } from "svelte/store";

export class ASTFacade {
  store: Writable<ASTState>;

  constructor(params: { store: Writable<ASTState> }) {
    this.store = params.store;
  }

  addNewRow() {
    this.store.update((state) => {
      const activeNode = state.nodes.get(state.activeNodeId!);
      if (!activeNode || activeNode.parentId === null) return state;

      const parentNode = state.nodes.get(activeNode.parentId)!;
      const newNode = nodesFactory.createLiteralNode({ value: "" });

      this.insertNode({
        parentNode,
        newNode,
        positionIndex: activeNode.siblingIndex + 1,
        state,
      });

      state.activeNodeId = newNode.id;
      return state;
    });
  }

  updateNode<T extends NodeType>(nodeId: string, params: UpdateNodeParams<T>) {
    const node = this.store.nodes.get(nodeId) as BaseNode<T> | undefined;
    node?.update(params);
  }

  /**
   * Заменяет старый узел новым
   */
  replaceNode(params: { oldNode: BaseNode; newNode: BaseNode }) {
    const { oldNode, newNode } = params;

    const parent = oldNode.parentId ? this.store.nodes.get(oldNode.parentId) : this.store.root;
    if (!parent) return;

    const leftNode = oldNode.prevId ? this.store.nodes.get(oldNode.prevId) : undefined;
    const rightNode = oldNode.nextId ? this.store.nodes.get(oldNode.nextId) : undefined;

    if (oldNode.siblingIndex === null) {
        throw new Error(`Cannot replace node: siblingIndex is null for node ${oldNode.id}`)        
    }
    
    parent.children[oldNode.siblingIndex] = newNode;

    newNode.parentId = parent.id;
    newNode.siblingIndex = oldNode.siblingIndex;

    updateNeighbors({ leftNode, newNode, rightNode });
    updateIndices({ children: parent.children ?? [], state: this.store });

    unregisterNode({ state: this.store, node: oldNode });
    this.store.activeNodeId = newNode.id;
  }

  /**
   * Вставляет новый узел в parent.children на указанную позицию
   */
  insertNode(params: { parentNode: BaseNode; newNode: BaseNode; positionIndex: number, state: ASTState }) {
    const { parentNode, newNode, positionIndex } = params;

    parentNode.children.splice(positionIndex, 0, newNode);
    newNode.parentId = parentNode.id;

    const leftNode = parentNode.children[positionIndex - 1];
    const rightNode = parentNode.children[positionIndex + 1];

    updateNeighbors({ leftNode, newNode, rightNode });
    updateIndices({ children: parentNode.children, state });

    this.store.activeNodeId = newNode.id;
  }

  /**
   * Удаляет узел из AST
   */
  deleteNode(params: { targetNode: BaseNode }) {
    const { targetNode } = params;

    const parent = targetNode.parentId ? this.store.nodes.get(targetNode.parentId) : this.store.root;
    if (!parent || !parent.children) return;

    const leftNode = targetNode.prevId ? this.store.nodes.get(targetNode.prevId) : undefined;
    const rightNode = targetNode.nextId ? this.store.nodes.get(targetNode.nextId) : undefined;

    updateNeighbors({ leftNode, newNode: undefined, rightNode });

    if (targetNode.siblingIndex === null) {
        throw new Error(`Cannot replace node: siblingIndex is null for node ${targetNode.id}`)        
    }

    parent.children.splice(targetNode.siblingIndex ?? 0, 1);
    updateIndices({ children: parent.children, state: this.store });

    unregisterNode({ state: this.store, node: targetNode });

    // Выбираем новый активный узел: справа → слева → родитель
    this.store.activeNodeId = rightNode?.id ?? leftNode?.id ?? parent.id;
  }
}


export const astFacade = new ASTFacade({ store: astStore });