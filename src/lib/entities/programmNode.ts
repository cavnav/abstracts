import type { NodeType } from "$lib/types/ast";
import { BaseNode } from "./baseNode";

export class ProgrammNode extends BaseNode {
  type: NodeType = "ProgrammNode";

  private _children: BaseNode[] = [];

  constructor(params: { id: string }) {
    super({ id: params.id });
  }

  get children() {
    return this._children;
  }

  async evaluate(): Promise<void> {
    // noop
    return;
  }
}
