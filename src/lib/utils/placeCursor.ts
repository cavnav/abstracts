export function placeCursorAtStart({ block }: { block: HTMLElement }) {
    const inputElement = block.querySelector('input') as HTMLInputElement;
    if (inputElement) {
        const range = createRange(inputElement, 0);
        setCursor(block, range);
    }
}

export function placeCursorAtEnd({ block }: { block: HTMLElement }) {
    const inputElement = block.querySelector('input') as HTMLInputElement;
    if (inputElement) {
        const range = createRange(inputElement, inputElement.value.length);
        setCursor(block, range);
    }
}

function createRange(inputElement: HTMLInputElement, position: number): Range {
    const range = document.createRange();
    range.setStart(inputElement, position);
    range.setEnd(inputElement, position);
    return range;
}

function setCursor(block: HTMLElement, range: Range) {
    block.focus();
    const selection = window.getSelection();
    if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
