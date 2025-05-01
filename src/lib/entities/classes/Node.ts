import type { INode, INodeId } from "$lib/types/ast"

export class Node implements INode {
    id: INodeId
    name: string
    value: INode[]

    constructor({
        id,
        name,
        value,
    }: INode) {
        this.id = id
        this.name = name
        this.value = value
    }
}