type CursorPosition = 'start' | 'end' | number;

type PlaceCursorOptions = {
  element: HTMLElement | null;
  position?: CursorPosition;
};

export function placeCursor({ element, position = 'end' }: PlaceCursorOptions) {
  if (!element || !element.isContentEditable) return;

  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(element);

  if (typeof position === 'number') {
    const target = element.firstChild ?? element;
    range.setStart(target, position);
    range.collapse(true);
  } else {
    range.collapse(position === 'start');
  }

  selection.removeAllRanges();
  selection.addRange(range);
  element.focus();
}

export function placeCursorAtStart({ element }: { element: HTMLElement | null }) {
  placeCursor({ element, position: 'start' });
}

export function placeCursorAtEnd({ element }: { element: HTMLElement | null }) {
  placeCursor({ element, position: 'end' });
}
