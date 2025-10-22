import type { INodeModel } from "$lib/types/nodeModel";
import type { NodeType } from "$lib/types/nodeTypes";

export abstract class Node implements INodeModel {
  abstract type: NodeType;
}