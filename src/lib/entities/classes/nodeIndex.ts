import type { INode } from "$lib/types/ast";

export class NodeIndex {
    private map = new Map<string, INode>();
    
    // Добавляем узел и всех его детей в индекс
    add(node: INode) {
        this.map.set(node.id, node);
        if (node.value?.length) {
            node.value[0].prevId = node.id;
        }
        node.value?.forEach(child => this.add(child));
    }

    update(node: INode) {
        this.map.set(node.id, node);
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

export type INodeIndex = InstanceType<typeof NodeIndex>;