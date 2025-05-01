import type { IASTManager } from "$lib/types/ASTManager.types";
import type { NodeId, IExecutableNode } from "$lib/types/executable.types";

/**
 * Класс ASTManager управляет узлами "грязного АСТ", их значениями и зависимостями.
 * 
 * "Грязный АСТ" — это АСТ, включающее как саму структуру узлов, так и их зависимые узлы.
 */
class ASTManager implements IASTManager {
    private nodes: Map<NodeId, IExecutableNode> = new Map();
    private order: Map<NodeId, NodeId | null> = new Map();
    private iterationLimit: number = 1000;
    
    constructor({ iterationLimit = 1000 }: { iterationLimit?: number } = {}) {
        this.iterationLimit = iterationLimit;
    }
    
    addNode({ node, afterId = null }: { node: IExecutableNode; afterId?: NodeId }): void {
        this.nodes.set(node.id, node);
        
        if (afterId) {
            this.order.set(nodeId, this.order.get(afterId) ?? null);
            this.order.set(afterId, nodeId);
        } else {
            this.order.set(nodeId, null); // Добавление в конец
        }
    }

    removeNode({ nodeId }: { nodeId: NodeId }): void {
        const node = this.nodes.get(nodeId);

        // Удаляем узел из списка узлов
        this.nodes.delete(nodeId);
        
        // Обновляем порядок узлов
        let prevId: NodeId = null;
        for (let [id, next] of this.order.entries()) {
            if (next === nodeId) prevId = id;
        }
        if (prevId) this.order.set(prevId, this.order.get(nodeId) ?? null);
        this.order.delete(nodeId);
        
        // Удаляем ссылки на этот узел из эффектов других узлов
        for (const [id, otherNode] of this.nodes.entries()) {
            if (otherNode instanceof ExecutableNode) {
                otherNode.removeEffect({ nodeId });
            }
        }
    }

    getAllNodes(): NodeId[] {
        return Array.from(this.nodes.keys());
    }
    
    /**
     * Получает список узлов, от которых зависит указанный узел.
     * Это обратная операция от получения эффектов - ищем узлы, которые влияют на данный.
     */
    getDependencies({ nodeId }: { nodeId: NodeId }): Set<NodeId> {
        const dependencies = new Set<NodeId>();
        
        for (const [id, node] of this.nodes.entries()) {
            if (node instanceof ExecutableNode && node.getEffects().has(nodeId)) {
                dependencies.add(id);
            }
        }
        
        return dependencies;
    }
    
    /**
     * Выполняет узел и каскадно обновляет все зависимые узлы.
     * Контролирует версионность и ограничение по итерациям.
     */
    async executeNode({ nodeId, namespace, iteration = 0, parentVersion }: ExecuteNodeParams): Promise<any> {
        const node = this.nodes.get(nodeId);
        if (!node || !(node instanceof ExecutableNode)) {
            throw new Error(`Node with ID ${nodeId} not found or is not an ExecutableNode`);
        }
        
        // Проверка на превышение лимита итераций
        if (iteration > this.iterationLimit) {
            throw new Error(`Iteration limit exceeded for node ${node.constructor.name}`);
        }
        
        // Проверка версии (если узел уже обработан с этой версией родителя)
        if (parentVersion !== undefined && parentVersion <= node.getVersion()) {
            return;
        }
        
        // Увеличиваем версию узла
        node.incrementVersion();
        
        let result: unknown;
        
        try {
            // Выполняем основную логику узла
            result = node.executeCore({ namespace });
            if (result instanceof Promise) {
                result = await result;
            }
            
            // Сохраняем результат в namespace используя ID узла
            if (node.id) {
                namespace.setVariable({ id: node.id, value: result });
            }
        } catch (error) {
            if (node.isCritical()) {
                throw new Error(`Critical node ${node.constructor.name} failed: ${error}`);
            } else {
                console.error(`Node ${node.constructor.name} failed: ${error}`);
                return;
            }
        }
        
        // Получаем узлы, на которые влияет текущий узел (эффекты) и запускаем их выполнение
        const effectIds = node.getEffects();
        await Promise.allSettled(
            Array.from(effectIds).map(effectId => 
                this.executeNode({
                    nodeId: effectId,
                    namespace,
                    iteration: iteration + 1,
                    parentVersion: node.getVersion()
                })
            )
        );
        
        return result;
    }
}