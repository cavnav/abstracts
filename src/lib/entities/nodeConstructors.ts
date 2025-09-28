import { LiteralNode } from "./literalNode";
import { IdentifierNode } from "./identifierNode";
import { BinaryOperationNode } from "./binaryOperationNode";
import { AssignmentNode } from "./assignmentNode";
import type { INode, PartialNode } from "$lib/types/ast";
import type { BaseNode } from "./baseNode";

type NodeConstructor = new (data: PartialNode) => BaseNode;

export const nodeConstructors: Record<INode["type"], NodeConstructor> = {
  LiteralNode,
  IdentifierNode,
  BinaryOperationNode,
  AssignmentNode,
};
