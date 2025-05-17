import type { EvaluateResult } from "$lib/types/ast";
import type { INamespaceManager } from "$lib/types/namespaceManager";
import type { IBaseNode } from "./baseNode";

export class Interpreter {
  namespace: INamespaceManager;

  constructor(namespace: INamespaceManager) {
    this.namespace = namespace;
  }

  // Выполнить узел (и дочерние)
  async evaluateNode(node: IBaseNode): Promise<EvaluateResult> {
    // В каждом узле своя evaluate, которая может рекурсивно вызывать evaluate дочерних
    return await node.evaluate({ namespace: this.namespace });
  }

  // Выполнить весь AST (например, начиная с корня)
  async evaluateAST(rootNode: IBaseNode): Promise<EvaluateResult> {
    return await this.evaluateNode(rootNode);
  }
}
