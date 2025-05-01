type CursorPosition = 'start' | 'end' | number;

type PlaceCursorOptions = {
  node: HTMLElement;
  position?: CursorPosition;
};

export function placeCursor({ node, position = 'end' }: PlaceCursorOptions) {
  if (!node || !node.isContentEditable) return;

  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(node);

  if (typeof position === 'number') {
    const target = node.firstChild ?? node;
    range.setStart(target, position);
    range.collapse(true);
  } else {
    range.collapse(position === 'start');
  }

  selection.removeAllRanges();
  selection.addRange(range);
  node.focus();
}

export function placeCursorAtStart({ node }: { node: HTMLElement }) {
  placeCursor({ node, position: 'start' });
}

export function placeCursorAtEnd({ node }: { node: HTMLElement }) {
  placeCursor({ node, position: 'end' });
}
