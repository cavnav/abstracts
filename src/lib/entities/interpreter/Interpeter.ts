import type { EvaluateResult } from "$lib/types/evaluateResult";
import type { NodeHandlerCore } from "../nodeHandlers/NodeHandlerCore";
import type { ContextManager } from "../ContextManager";
import type { Node } from "../Node";
import type { RuntimeGraph } from "../RuntimeGraph";
import type { ContextNavigator } from "../ContextNavigator";

export class Interpreter {
  contextManager: ContextManager // чтение, запись в пространство имен.
  contextNavigator: ContextNavigator // перемещение между контекстами.
  runtimeGraph: RuntimeGraph
  nodeHandlerCore: NodeHandlerCore // ядро обработки узлов.

  constructor({ contextManager, contextNavigator, runtimeGraph, nodeHandlerCore }: {
    contextManager: ContextManager
    contextNavigator: ContextNavigator
    runtimeGraph: RuntimeGraph
    nodeHandlerCore: NodeHandlerCore
  }) {
    this.contextManager = contextManager
    this.contextNavigator = contextNavigator
    this.runtimeGraph = runtimeGraph
    this.nodeHandlerCore = nodeHandlerCore
  }

  async evaluate(params: { node: Node }): Promise<EvaluateResult> {
    return await this.nodeHandlerCore.handle({ 
      node: params.node,
      context: {
        manager: this.contextManager,
        navigator: this.contextNavigator
      }
    })
  }
}