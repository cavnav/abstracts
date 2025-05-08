import { derived, writable } from 'svelte/store';
import type { INode, INodeId } from '$lib/types/ast';
import { NodeIndex, type INodeIndex } from '$lib/entities/classes/nodeIndex';
import { NodeClass } from '$lib/entities/classes/node';

interface ASTState {
	nodes: Map<string, INode>;
	index: INodeIndex;
	activeNodeId: INodeId | null;
}

// --- Мок-данные для начальной инициализации AST ---
const rootNode = new NodeClass({
	id: '1',
	name: 'x',
	parentId: null,
	prevId: null,
	nextId: null,
	value: [
		new NodeClass({ id: '2', name: 'aaa', parentId: '1', prevId: null, nextId: '22', value: [] }),
		new NodeClass({ id: '22', name: '+', parentId: '1', prevId: '2', nextId: '3', value: [] }),
		new NodeClass({ id: '3', name: 'bbb', parentId: '1', prevId: '22', nextId: '33', value: [] }),
		new NodeClass({ id: '33', name: '+', parentId: '1', prevId: '3', nextId: '4', value: [] }),
		new NodeClass({ id: '4', name: 'ddd', parentId: '1', prevId: '33', nextId: null, value: [] }),
	],
});

const initialNodes = [rootNode];

export const astStore = writable<ASTState>({
	nodes: new Map(initialNodes.map(node => [node.id, node])), // Узлы верхнего уровня
	index: new NodeIndex(), // Плоский индекс всех узлов
	activeNodeId: rootNode.id, // Активный узел
  });

  
// Инициализация индекса
astStore.update(s => {
    s.nodes.forEach(node => s.index.add(node));
    return s;
});


