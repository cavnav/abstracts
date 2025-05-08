

import { type IASTManager } from "$lib/managers/astManager";
import { astStore } from "$lib/stores/store";
import type { INode } from "$lib/types/ast";
import { generateId } from "$lib/utils/generateId";
import { NodeClass } from "./node";

export class ASTFacadeWithState {
    private manager

    constructor({manager}: {manager: IASTManager}) {
        this.manager = manager
    }
	

	addNode({ parentId, nodeData, updateParent = {} }: { 
    parentId: string, 
    nodeData: Omit<INode, 'id'>, 
    updateParent?: Partial<INode> 
}) {
    astStore.update(s => {
        const parent = s.index.get(parentId);
        if (!parent) return s;
    
        // Создание нового узла
        const node = new NodeClass({ ...nodeData, id: generateId() });

        // Находим место для добавления нового узла в дочерние элементы родителя
        let prevNode = parent.value[parent.value.length - 1]; // Сосед по предшествующему узлу

        // Если это первый ребенок родителя, то prevId = parentId
        if (!prevNode) {
            node.prevId = parentId;
        } else {
            node.prevId = prevNode.id;  // Устанавливаем prevId у нового узла
            prevNode.nextId = node.id;  // Устанавливаем nextId у соседнего узла
        }

        // Добавление дочернего узла к родителю
        const { updatedParent, child } = this.manager.addChild(parent, node);
    
        const finalUpdatedParent = {
            ...updatedParent,
            ...updateParent,
        };

        if (!finalUpdatedParent.parentId) {
            s.nodes.set(finalUpdatedParent.id, finalUpdatedParent);
        }
    
        s.index.update(finalUpdatedParent);
    
        // Добавляем новый дочерний узел в индекс
        s.index.add(child);
    
        // Обновляем активный узел
        s.activeNodeId = child.id;
    
        return s;
    });
}

    
    

	removeNode(nodeId: string) {
		astStore.update(s => {
			const node = s.index.get(nodeId);
			if (!node || !node.parentId) return s;
	
			const parent = s.index.get(node.parentId);
			if (!parent) return s;
	
			const { updatedParent } = this.manager.removeNode(node, parent);
	
			// Обновляем индекс
			s.index.remove(node);
			s.index.add(updatedParent);
	
			// Сброс активного узла, если он удалён
			if (s.activeNodeId === node.id) {
				s.activeNodeId = null;
			}
	
			return s;
		});
	}
	
}
