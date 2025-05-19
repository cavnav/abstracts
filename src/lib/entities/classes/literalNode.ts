import type { EvaluateResult } from "$lib/types/ast";
import { BaseNode, type IBaseNode } from "./baseNode";

export class LiteralNode extends BaseNode {
    static canHandle(text: string): boolean {
    return /^(\d+(\.\d+)?|'[^']*'|"[^"]*")$/.test(text);
  }
  
    cloneWith(overrides: Partial<IBaseNode>): IBaseNode {
        return new LiteralNode({
        ...this,
        ...overrides,
        });
    }
    async evaluate(): EvaluateResult {
        const raw = this.name;
        if (/^\d+(\.\d+)?$/.test(raw)) return Number(raw);
        if (/^".*"$|^'.*'$/.test(raw)) return raw.slice(1, -1);
        return raw;
    }
}