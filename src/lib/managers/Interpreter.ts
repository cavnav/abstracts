import { NamespaceManager } from "./nameSpaceManager";

// Интерпретатор
class Interpreter {
    constructor() {
      this.namespace = new NamespaceManager();
    }

    executeNode({node}: {node: IExecutableNode}) {
      node.execute({})
    }
  
    executeAST(ast) {
      for (const node of ast) {
        node.execute(this.namespace);
      }
    }
  
    getNamespace() {
      return this.namespace;
    }
  }