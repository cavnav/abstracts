export function placeCursorAtStart({ block }: { block: HTMLElement }) {
    const inputElement = block.querySelector('input') as HTMLInputElement;
    if (inputElement) {
        setCursor(inputElement, 0);
    }
}

export function placeCursorAtEnd({ block }: { block: HTMLElement }) {
    const inputElement = block.querySelector('input') as HTMLInputElement;
    if (inputElement) {
        setCursor(inputElement, inputElement.value.length);
    }
}

function setCursor(inputElement: HTMLInputElement, position: number) {
    inputElement.focus();
    inputElement.setSelectionRange(position, position);
}
