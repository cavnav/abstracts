import type { Node } from "./Node"

class RuntimeGraph {
  private sourceNodes = new Map<Node, Node>()    // узел → его источники
  private consumerNodes = new Map<Node, Node>()   // узел → его потребители  
  private statusNodes = new Map<Node, Node>()   // узел → его statusNode
  
  // Создаёт мета-узлы для каждого узла
  registerNode(node: Node) {
    const sourceNode = { id: `${node.id}_inputs`, type: "meta_inputs", value: [] }
    const consumerNode = { id: `${node.id}_outputs`, type: "meta_outputs", value: [] }
    const statusNode = { id: `${node.id}_status`, type: "meta_status", value: "stale" }
    
    this.inputNodes.set(node, inputNode)
    this.outputNodes.set(node, outputNode) 
    this.statusNodes.set(node, statusNode)
  }
  
  // Устанавливает зависимости
  addDependency(source: Node, consumer: Node) {
    const sourceOutputs = this.outputNodes.get(source)!.value
    const consumerInputs = this.inputNodes.get(consumer)!.value
    
    // Обновляем мета-узлы
    if (!sourceOutputs.includes(consumer)) {
      sourceOutputs.push(consumer)
    }
    if (!consumerInputs.includes(source)) {
      consumerInputs.push(source)
    }
    
    // Инвалидируем потребителя
    this.markStale(consumer)
  }
  
  // Реактивное обновление
  markStale(node: Node) {
    const statusNode = this.statusNodes.get(node)!
    statusNode.value = "stale"
    
    // Каскадно инвалидируем всех потребителей
    const outputs = this.outputNodes.get(node)!.value
    for (const consumer of outputs) {
      this.markStale(consumer)
    }
  }
  
  markActual(node: Node) {
    const statusNode = this.statusNodes.get(node)!
    statusNode.value = "actual"
  }
}