import type { IIdGenerator } from "../utils/idGenerator";
import { UuidGenerator } from "../utils/idGenerator";
import { BaseNode, IdentifierNode, LiteralNode, AssignmentNode, ProgrammNode } from "../entities";

// --- Параметры для методов фабрики ---
export interface CreateIdentifierParams { name: string }
export interface CreateLiteralParams { value: string | number | boolean }
export interface CreateAssignmentParams { name: string, left: BaseNode; right: BaseNode }
// --- Фабрика узлов ---
export class NodesFactory {
    private idGenerator: IIdGenerator

    constructor({idGenerator}:{idGenerator: IIdGenerator}) {
        this.idGenerator = idGenerator
    }

    createProgrammNode() {
        return new ProgrammNode({
            id: this.idGenerator.nextId(),
        })
    }

    createIdentifierNode(params: CreateIdentifierParams) {
        return new IdentifierNode({ id: this.idGenerator.nextId(), name: params.name });
    }

    createLiteralNode(params: CreateLiteralParams) {
        return new LiteralNode({ id: this.idGenerator.nextId(), value: params.value });
    }

    createAssignmentNode(params: CreateAssignmentParams) {
        return new AssignmentNode({
            id: this.idGenerator.nextId(),
            value: {
                left: params.left,
                right: params.right
            }
        });
    }
}

// --- Экспорт готового экземпляра фабрики ---
export const nodesFactory = new NodesFactory({idGenerator: new UuidGenerator()});
