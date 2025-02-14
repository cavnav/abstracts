export function placeCursorAtStart({ block }: { block: HTMLElement }) {
    block.focus();

    // Ищем input внутри блока
    const inputElement = block.querySelector('input') as HTMLInputElement;

    if (inputElement) {
        // Устанавливаем фокус на input
        inputElement.focus();

        // Перемещаем курсор в начало
        const range = document.createRange();
        range.setStart(inputElement, 0);  // Устанавливаем курсор в начало
        range.setEnd(inputElement, 0);    // Устанавливаем конец диапазона в начало

        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);  // Устанавливаем новый диапазон
        }
    }
}
