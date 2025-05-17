import type { INode } from "$lib/types/ast";
import type { IBaseNode } from "./baseNode";

export class NodeIndex {
  private map = new Map<string, IBaseNode>();

  add(node: IBaseNode) {
    this.map.set(node.id, node);
    // Рекурсивно добавляем дочерние узлы
    node.value.forEach(child => this.add(child));
  }

  get(id: string): IBaseNode | undefined {
    return this.map.get(id);
  }

  remove(id: string) {
    this.map.delete(id);
  }

  update(node: IBaseNode) {
    this.map.set(node.id, node)
  }

  clear() {
    this.map.clear();
  }
}

export type INodeIndex = InstanceType<typeof NodeIndex>;