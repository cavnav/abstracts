import type { INode } from '$lib/types/ast';

export class ASTManager {
	addChild(parent: INode, child: INode): { updatedParent: INode, child: INode } {
		child.parentId = parent.id;
		const updatedParent = {
			...parent,
			value: [...parent.value, child],
		};
	
		return { updatedParent, child };
	}

	removeNode(node: INode, parent: INode): { updatedParent: INode } {
		const updatedParent = {
			...parent,
			value: parent.value.filter(n => n.id !== node.id),
		};
		return { updatedParent };
	}
	
}

export type IASTManager = InstanceType<typeof ASTManager>

