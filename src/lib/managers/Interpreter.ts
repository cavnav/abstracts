class Interpreter {
  namespace: Map<string, any>;

  constructor() {
      this.namespace = new Map();
  }

  executeNode(node: Node) {
      node.execute(this.namespace);
  }
}
