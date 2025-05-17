import type { IBaseNode } from "$lib/entities/classes/baseNode"

export type INodeId = string

export interface INode {
    id: INodeId
    name?: string
    value?: IBaseNode[]
    nextId?: INodeId | null
    prevId?: INodeId | null
    parentId?: INodeId | null
}

export type EvaluateResult = Promise<PrimitiveValue | IBaseNode | void>;

type PrimitiveValue = number | string | boolean;