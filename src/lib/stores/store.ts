import type { IBaseNode } from "$lib/entities/classes/baseNode";
import { IdentifierNode } from "$lib/entities/classes/identifierNode";
import { NodeIndex, type INodeIndex } from "$lib/entities/classes/nodeIndex";
import { writable } from "svelte/store";

interface ASTState {
  nodes: Map<string, IBaseNode>;
  index: INodeIndex;
  dirty: Map<string, boolean>;
  activeNodeId: string | null;
}

const firstNode = new IdentifierNode({ id: 'first'})

export const astStore = writable<ASTState>({
  nodes: new Map([[firstNode.id, firstNode]]),
  index: new NodeIndex(),
  dirty: new Map(),
  activeNodeId: null,
});

// Инициализация индекса
astStore.update(s => {
    s.nodes.forEach(node => s.index.add(node));
    return s;
});


