import type { ContextManager } from "$lib/entities/ContextManager";
import type { ContextNavigator } from "$lib/entities/ContextNavigator";
import type { EvaluateResult } from "./evaluateResult";
import type { Node } from "./node";

export type NodeHandler = (params: {node: Node, context: {manager: ContextManager, navigator: ContextNavigator}}) => EvaluateResult
