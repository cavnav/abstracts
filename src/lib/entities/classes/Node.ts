import type { INode, INodeId } from "$lib/types/ast"

export class NodeClass implements INode {
    id: INodeId
    name: string
    value: INode[]
    prevId: INodeId | null
    nextId: INodeId | null
    parentId: INodeId | null
    isAssignment?: boolean

    constructor({
        id,
        name,
        value,
        prevId,
        nextId,
        parentId,
        isAssignment,
    }: INode) {
        this.id = id
        this.name = name
        this.value = value
        this.prevId = prevId
        this.nextId = nextId
        this.parentId = parentId
        this.isAssignment = isAssignment
    }
}

export type INodeClass = InstanceType<typeof NodeClass>;