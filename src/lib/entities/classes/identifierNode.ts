import type { EvaluateResult } from "$lib/types/ast";
import { BaseNode, type IBaseNode } from "./baseNode";
import type { NamespaceManager } from "./namespaceManager";

export class IdentifierNode extends BaseNode {
	static  canHandle(text: string): boolean {
    return /^[a-zA-Z_]\w*$/.test(text);
  }

	cloneWith(overrides: Partial<IBaseNode>): IBaseNode {
		return new IdentifierNode({
		...this,
		...overrides,
		});
	}
	async evaluate({ namespace }: { namespace: NamespaceManager }): EvaluateResult {
		 const valueNode = this.value[0];
		 if (!valueNode) {
			return
		 }
		const result = await valueNode.evaluate({ namespace });
		if (result !== undefined) {
		namespace.setVariable({ name: this.name, value: result });
		}
		return result;
	}
}