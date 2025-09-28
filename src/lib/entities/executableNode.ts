/**
 * Абстрактный класс ExecutableNode — базовый класс для всех исполняемых узлов в Abstract.
 * 
 * 🔹 **Основная концепция**:
 * - Каждый узел может **реактивно обновляться**, вызывая обновление зависимых узлов.
 * - Поддерживается как **синхронное**, так и **асинхронное** выполнение.
 * - Используется **версионность** для контроля целостности обновлений и избежания зацикливания.
 * - Ограничивает **максимальное количество итераций**, чтобы избежать бесконечных циклов.
 * - Критические узлы могут **остановить цепочку обновлений**, если их выполнение неудачно.
 * 
 * 🔹 **Как это работает?**
 * 1. **Запуск обновления** начинается с метода `execute()`, который:
 *    - Проверяет версию узла.
 *    - Запускает `executeCore()` для обновления текущего узла.
 *    - Запускает обновление всех зависимых узлов **параллельно** (но учитывает критические ошибки).
 * 
 * 2. **executeCore()** — метод, который должен быть реализован в наследниках, определяя, что именно делает узел.
 * 
 * 3. **Версионность**:
 *    - В начале обновления версия узла обнуляется.
 *    - После успешного выполнения узел получает новую версию.
 *    - Если зависимый узел уже обработал новую версию, он не обновляется повторно.
 * 
 * 4. **Асинхронность**:
 *    - Если узел выполняется асинхронно, `execute()` ожидает его выполнения перед запуском зависимых узлов.
 *    - Если зависимый узел асинхронный, его выполнение **не блокирует** обновление остальных узлов.
 * 
 * 🔹 **Пример использования:**
 * ```typescript
 * const computeNode = new ComputeNode({})
 * const logNode = new LogNode({ computeNode })
 * computeNode.addDependent({ node: logNode })
 * computeNode.execute()
 * ```
 * 
 * В этом примере `computeNode` сначала обновится сам, затем вызовет обновление `logNode`.
 */

import type { CriticalParams, ExecuteCoreParams, IExecutableNode, NodeId } from "$lib/types/executable.types";

abstract class ExecutableNode implements IExecutableNode {
    public readonly name?: string;
    public readonly id: NodeId;
    
    private effects: Set<NodeId> = new Set();
    private version: number = 0;
    private isCriticalNode: boolean = false;

    constructor({ name, idGenerator }: { 
        name: string,
        idGenerator: () => string 
    }) {
        this.name = name;
        this.id = name ?? idGenerator();
    }

    abstract executeCore({ namespace }: ExecuteCoreParams): Promise<void> | void;
    
    // Методы для работы c зависимыми узлами
    addEffect({ nodeId }: { nodeId: NodeId }): void {
        this.effects.add(nodeId);
    }

    removeEffect({ nodeId }: { nodeId: NodeId }): void {
        this.effects.delete(nodeId);
    }

    getEffects(): Set<NodeId> {
        return this.effects;
    }
    
    getVersion(): number {
        return this.version;
    }
    
    incrementVersion(): void {
        this.version++;
    }
    
    setCritical({ isCritical }: CriticalParams): void {
        this.isCriticalNode = isCritical;
    }

    isCritical(): boolean {
        return this.isCriticalNode;
    }
}