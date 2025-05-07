export type INodeId = string

export interface INode {
    id: INodeId
    name: string
    value: INode[]
    nextId: INodeId | null
    prevId: INodeId | null
    parentId: INodeId | null
    isAssignment?: boolean
}
