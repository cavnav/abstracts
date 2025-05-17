import type { EvaluateResult, INode, INodeId } from "$lib/types/ast"
import type { INamespaceManager } from "$lib/types/namespaceManager"

export abstract class BaseNode implements INode {
    id: INodeId
    name: string
    value: IBaseNode[]
    prevId: INodeId | null
    nextId: INodeId | null
    parentId: INodeId | null

    constructor({
        id,
        name = '',
        value = [],
        prevId = null,
        nextId = null,
        parentId = null,
    }: INode) {
        this.id = id
        this.name = name
        this.value = value
        this.prevId = prevId
        this.nextId = nextId
        this.parentId = parentId
    }

    abstract cloneWith(overrides: Partial<IBaseNode>): IBaseNode

    abstract evaluate({ namespace }: { namespace: INamespaceManager }): EvaluateResult;
}

export type IBaseNode = InstanceType<typeof BaseNode>;