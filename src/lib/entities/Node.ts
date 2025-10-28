import type { INodeModel } from "$lib/types/nodeModel";
import type { NodeType } from "$lib/types/nodeTypes";

export abstract class Node implements INodeModel {
  id: string
  abstract type: NodeType;

  constructor(params: {id: string}) {
    this.id = params.id
  }
}
