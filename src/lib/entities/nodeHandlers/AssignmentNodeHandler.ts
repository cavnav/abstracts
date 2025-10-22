import type { EvaluateResult } from "$lib/types/evaluateResult"
import type { NodeHandler } from "$lib/types/nodeHandler"
import type { AssignmentNode } from "../assignmentNode"

export class AssignmentNodeHandler implements NodeHandler {
  async handle(params: { node: AssignmentNode }): Promise<EvaluateResult> {
    // Пример: "x ⟵ 1"
    const name = params.node.left.getValue()
    const valueNode = params.node.right.getValue()

    // рекурсивно вычисляем правую часть
    const value = await interpreter.evaluate({node: valueNode})

    // сохраняем значение в пространстве имён
    manager.setValue({ name, value })

    return value
  }
}
