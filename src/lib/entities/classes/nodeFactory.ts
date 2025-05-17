// nodeFactory.ts
import type { INode } from '$lib/types/ast';
import type { BaseNode } from './baseNode';
import { IdentifierNode } from './identifierNode';

export interface NodeConstructor {
  new (params: any): BaseNode;
  canHandle?: (text: string) => boolean;
}

export class NodeFactory {
  private types: NodeConstructor[] = [];

  register(type: NodeConstructor) {
    this.types.push(type);
  }

  findType(text: string): NodeConstructor | null {
    return this.types.find(type => type.canHandle?.(text)) ?? null;
  }

  createNode(text: string, params: INode): BaseNode {
    const Type = this.findType(text);
    return new (Type ?? IdentifierNode)({ ...params, name: text });
  }
}




export const nodeFactory = new NodeFactory();