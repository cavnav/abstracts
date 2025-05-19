import { type IASTManager } from "$lib/managers/astManager";
import { astStore } from "$lib/stores/store";
import type { INode } from "$lib/types/ast";
import { generateId } from "$lib/utils/generateId";
import { get } from "svelte/store";
import { IdentifierNode } from "./identifierNode";
import { interpreter } from "./setupInterpeter";
import { LiteralNode } from "./literalNode";

export class ASTFacadeWithState {
    private manager: IASTManager;

    constructor({ manager }: { manager: IASTManager }) {
        this.manager = manager;
    }
    
    async evaluateNode(nodeId: string) {
        const node = get(astStore).index.get(nodeId);
        if (!node) throw new Error("Node not found");
        return await interpreter.evaluateNode(node);
    }

    async evaluateAST(rootId: string) {
        const root = get(astStore).index.get(rootId);
        if (!root) throw new Error("Root node not found");
        return await interpreter.evaluateAST(root);
    }

    updateNodeNameAndEvaluate(nodeId: string, newName: string) {
        let parentId: string | null = null;

        astStore.update(state => {
            const node = state.index.get(nodeId);
            if (!node) return state;

            node.name = newName;
            parentId = node.parentId ?? null;

            return state;
        });

        const targetId = parentId || nodeId;
        this.evaluateNode(targetId);
    }

    addNode({ parentId, nodeData }: { parentId: string; nodeData: Omit<INode, 'id'> }) {
        // Создаём узел заранее, чтобы использовать его id и передать в update
        const node = new LiteralNode({ ...nodeData, id: generateId() });

        astStore.update(s => {
            const parent = s.index.get(parentId);
            if (!parent) return s;

            const prevNode = parent.value?.[parent.value.length - 1];
            if (!prevNode) {
                node.prevId = parentId;
            } else {
                node.prevId = prevNode.id;
                prevNode.nextId = node.id;
            }

            const { updatedParent, child } = this.manager.addChild(parent, node);

            if (!updatedParent.parentId) {
                s.nodes.set(updatedParent.id, updatedParent);
            }
            s.index.update(updatedParent);
            s.index.add(child);
            s.activeNodeId = child.id;

            return s;
        });

        // Вызываем интерпретацию вне update, используя уже созданный узел
        this.evaluateNode(node.id);
    }

    removeNode(nodeId: string) {
        astStore.update(s => {
            const node = s.index.get(nodeId);
            if (!node || !node.parentId) return s;

            const parent = s.index.get(node.parentId);
            if (!parent) return s;

            const { updatedParent } = this.manager.removeNode(node, parent);

            s.index.remove(node.id);
            s.index.add(updatedParent);

            if (s.activeNodeId === node.id) {
                s.activeNodeId = null;
            }

            return s;
        });
    }
}
