import type { INode } from '$lib/types/ast';

interface KeyDownParams {
    event: KeyboardEvent;
    blockId: string;
    lineId: string;
}

export class EditorLogic {
    private ast: INode[] = [];
    private currentNode: INode | null = null;

    constructor() {
    }

    // Обработка нажатия клавиш
    handleKeyDown({ event, blockId, lineId }: KeyDownParams): void {
        if (event.key === ' ' && this.isFirstBlock(blockId)) {
            event.preventDefault();
        }
    }

    private handleVariableName(name: string): boolean {
        // TODO: Создание AssignmentNode
        return false;
    }

    private isFirstBlock(blockId: string): boolean {
        // TODO: Реализовать проверку
        return true;
    }
} 