import type { ASTState } from "$lib/managers/ast/types";
import { nodesFactory } from "$lib/managers/nodesFactory";
import { writable } from "svelte/store";

const programmNode = nodesFactory.createProgrammNode()
{
  children: [nodesFactory.createLiteralNode({ value: "Hello" })],
});

export const astStore = writable<ASTState>({
  nodes: new Map([[programmNode.id, programmNode]]),
  activeNodeId: programmNode.children![0].id,
  root: programmNode,
});
