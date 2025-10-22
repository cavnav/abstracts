import type { NodeType } from "$lib/types/nodeTypes";
import { EvaluableNode } from "./EvaluableNode";

export class LiteralNode extends EvaluableNode {
  type: NodeType = "Literal"  
}

export type ILiteralNode = InstanceType<typeof LiteralNode>;