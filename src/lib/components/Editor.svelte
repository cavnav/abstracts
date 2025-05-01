<script lang="ts">
    import { store } from '$lib/stores/store';
    import { EditorLogic } from '$lib/managers/editorLogic';
  import Node from './Node.svelte';
    
    const editorLogic = new EditorLogic();

    function handleKeyDown(event: KeyboardEvent) {
        const target = event.target as HTMLElement;
        const blockId = target.getAttribute('data-block-id');
        const lineId = target.getAttribute('data-line-id');

        if (blockId && lineId) {
            editorLogic.handleKeyDown({ event, blockId, lineId });
        }
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="editor" on:keydown={handleKeyDown}>    
    {#each Array.from($store.lines.entries()) as [id, line]}
        <Node node={line} />
    {/each}
</div>

