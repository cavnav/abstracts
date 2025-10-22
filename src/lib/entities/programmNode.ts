import type { NodeType } from "$lib/types/тode.types";
import { Node } from "./Node";

export class ProgrammNode extends Node {
  type: NodeType = "ProgrammNode";

  private _children: Node[] = [];

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
