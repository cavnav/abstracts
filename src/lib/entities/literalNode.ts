import type {
  EvaluateResult,
  NodeType,
  PartialNode,
} from "$lib/types/ast";
import { BaseNode } from "./baseNode";

export class LiteralNode extends BaseNode {
  type: NodeType = "LiteralNode";

  constructor(props: PartialNode) {
    super(props);
    this.type = "LiteralNode";
  }

  get children() {
    return [];
  }

  async evaluate(): EvaluateResult {
    const raw = this.value;
    if (/^\d+(\.\d+)?$/.test(raw)) return Number(raw); // Если строка — число (123, 3.14):
    if (/^".*"$|^'.*'$/.test(raw)) return raw.slice(1, -1); // "hello", 'world'
    return raw;
  }
}

export type ILiteralNode = InstanceType<typeof LiteralNode>;
