import type { EvaluateResult } from "$lib/types/evaluateResult"
import type { NodeHandler } from "$lib/types/nodeHandler"
import type { ContextManager } from "../ContextManager"
import type { ContextNavigator } from "../ContextNavigator"
import type { Node } from "../Node"


export class NodeHandlerCore {
  handlers: Record<string, NodeHandler>

  constructor(params: { handlers: Record<string, NodeHandler> }) {
    this.handlers = params.handlers
  }

  handle(params: { 
    node: Node
    context: {
      manager: ContextManager
      navigator: ContextNavigator  
    }
  }): EvaluateResult {
    const handler = this.handlers[params.node.type]
    if (!handler) throw new Error(`No handler for node type "${params.node.type}"`)
    return handler({ 
      node: params.node,
      context: params.context
    })
  }
}