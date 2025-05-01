export type INodeId = string

export interface INode {
    id: INodeId
    name: string
    value: INode[]
}
