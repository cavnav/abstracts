export interface VariableParams<T = any> {
    name: string
    value: T
}

export interface FunctionParams {
    name: string
    fn: () => any
}

export interface NameParams {
    name: string
}

export interface INamespaceManager {
    setVariable<T>(params: VariableParams<T>): void
    getVariable<T>(params: NameParams): T | undefined
}