// Вместо одного жирного ComputationState
export class RuntimeGraph {
  constructor(
    // public nodeStructure: NodeStructure // parent / children / siblings,
    // public nodeStatus: NodeStatus // актуальность узлов: isStale, isEvaluating, isActual, 
    // public nodeConsumers: ConsumerTracker
  ) {}

  // Композитные операции
//   markNodeUpdated(node: Node) {
//     this.reactivity.markStale(node)
//     const affectedConsumers = this.consumers.getConsumers(node)
//     affectedConsumers.forEach(consumer => this.reactivity.markStale(consumer))
//   }
}