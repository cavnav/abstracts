import type {
  EvaluateResult,
  PartialNode,
} from "$lib/types/ast";
import type { NodeType, TLiteralNodeValue } from "$lib/types/nodeTypes";
import type { UpdateNodeParams } from "$lib/types/updateNodeParams";
import { BaseNode } from "./baseNode";

export class LiteralNode extends BaseNode<TLiteralNodeValue> {
  type: NodeType = "LiteralNode";

  constructor(props: PartialNode<TLiteralNodeValue>) {
    super(props);
  }

  get children() {
    return [];
  }

  setValue(newValue: string | number | boolean) {
    this.value = newValue;
  }

  update(params: UpdateNodeParams<"LiteralNode">) {
    this.value = params.value;
  }

  async evaluate(): Promise<EvaluateResult> {
    const raw = this.value;
    if (/^\d+(\.\d+)?$/.test(String(raw))) return Number(raw); // числа
    if (/^".*"$|^'.*'$/.test(String(raw))) return String(raw).slice(1, -1); // строки в кавычках
    return raw;
  }  
}


export type ILiteralNode = InstanceType<typeof LiteralNode>;
