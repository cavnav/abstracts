import type { INodeModel } from "./nodeModel";
import type { NodeType } from "./nodeTypes";

export abstract class Node implements INodeModel {
  abstract type: NodeType;
}