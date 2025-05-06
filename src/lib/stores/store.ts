import { writable } from 'svelte/store';
import type { INode } from '$lib/types/ast';
import { NodeClass } from '$lib/entities/classes/Node';

class NodeIndex {
    private map = new Map<string, INode>();
    
    // Добавляем узел и всех его детей в индекс
    add(node: INode) {
        this.map.set(node.id, node);
		if (node.value?.length) {
            node.value[0].prevId = node.id;
        }
        node.value?.forEach(child => this.add(child));
    }
    
    // Удаляем узел и всех его детей из индекса
    remove(node: INode) {
        this.map.delete(node.id);
        node.value?.forEach(child => this.remove(child));
    }
    
    get(id: string): INode | undefined {
        return this.map.get(id);
    }
}

const nodes = new Map([
	[
		'1',
		new NodeClass({
			id: '1',
			name: 'x',
			parentId: null,
			prevId: null,
			nextId: null,
			value: [
				new NodeClass({ id: '2', name: 'aaa', parentId: '1', prevId: 'null', nextId: '22', value: [] }),
				new NodeClass({ id: '22', name: '+', parentId: '1', prevId: '2', nextId: '3', value: [] }),
				new NodeClass({ id: '3', name: 'bbb', parentId: '1', prevId: '22', nextId: '33', value: [] }),
				new NodeClass({ id: '33', name: '+', parentId: '1', prevId: '3', nextId: '4', value: [] }),
				new NodeClass({ id: '4', name: 'ddd', parentId: '1', prevId: '33', nextId: null, value: [] }),
			],
		}),
	],
])


export const store = writable({
    nodes, // Узлы верхнего уровня (строки редактора)
    index: new NodeIndex() // Плоский индекс всех узлов
});

// Инициализация индекса
store.update(s => {
    s.nodes.forEach(node => s.index.add(node));
    return s;
});