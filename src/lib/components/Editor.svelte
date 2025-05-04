<script lang="ts">
    import { store } from '$lib/stores/store';
    import { EditorLogic } from '$lib/managers/editorLogic';
  import Node from './Node.svelte';
  import { placeCursorAtEnd, placeCursorAtStart } from '$lib/utils/placeCursor';
    
    const editorLogic = new EditorLogic();

    type CursorPosition = 'start' | 'end' | number;

    type PlaceCursorOptions = {
        node: HTMLElement;
        position?: CursorPosition;
    };

    let currentBlockIndex = 0;

    function moveToAdjacentBlock(direction: number, toEnd: boolean) {
        const targetBlock = document.querySelector(`[data-id="${currentBlockIndex + direction}"]`);

        if (!targetBlock) return;

        // Используем функцию для установки курсора в начало или конец блока
        if (toEnd) {
            placeCursorAtEnd({ node: targetBlock as HTMLElement });
        } else {
            placeCursorAtStart({ node: targetBlock as HTMLElement });
        }

        currentBlockIndex += direction;
    }

    function handleKeyDown(event: KeyboardEvent) {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        const target = event.target as HTMLElement;
        const blockId = target.getAttribute('data-id');

        if (blockId) {
            const block = document.querySelector(`[data-id="${blockId}"]`);

            if (event.key === 'ArrowLeft' && range && range.startOffset === 0) {
                if (currentBlockIndex > 0) {
                    moveToAdjacentBlock(-1, true); // Перемещаем в конец предыдущего блока
                    event.preventDefault();
                }
            } else if (event.key === 'ArrowRight' && range && range.startOffset === block?.textContent?.length) {
                    moveToAdjacentBlock(1, false); // Перемещаем в начало следующего блока
                    event.preventDefault();
            }
        }
    }    
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="editor" on:keydown={handleKeyDown}>    
    {#each Array.from($store.lines.entries()) as [id, line]}
        <Node node={line}/>
    {/each}
</div>

