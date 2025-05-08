<script lang="ts">
	import Node from './Node.svelte';
	import { placeCursorAtStart, placeCursorAtEnd } from '$lib/utils/placeCursor';
  import { astFacade } from '$lib/entities/classes/astFacadeWithState';
  import { astStore } from '$lib/stores/store';

	const nodeRefs = new Map<string, HTMLElement>();

	function registerNode(id: string, el: HTMLElement) {
		nodeRefs.set(id, el);
	}

	function unregisterNode(id: string) {
		nodeRefs.delete(id);
	}

	function handleKeyDown(event: KeyboardEvent) {
	const selection = window.getSelection();
	const range = selection?.getRangeAt(0);
	const target = event.target as HTMLElement;
	const nodeId = target?.dataset?.id;

	if (!nodeId || !range) return;

    astStore.update(state => {
        const currentNode = state.index.get(nodeId);
        if (!currentNode) return state;

        // ← Влево
        if (event.key === 'ArrowLeft' && range.startOffset === 0) {
            const prevEl = currentNode.prevId
                ? nodeRefs.get(currentNode.prevId)
                : currentNode.parentId
                    ? nodeRefs.get(currentNode.parentId)
                    : null;

            if (prevEl) {
                placeCursorAtEnd({ element: prevEl });
                event.preventDefault();
            }
        }

        // → Вправо (или спуск к первому потомку)
        if (
            event.key === 'ArrowRight' &&
            range.startOffset === (target.textContent?.length ?? 0)
        ) {
            let nextEl: HTMLElement | null = null;

            if (currentNode.nextId) {
                nextEl = nodeRefs.get(currentNode.nextId) ?? null;
            }

            if (!nextEl && currentNode.value?.length) {
                const firstChildId = currentNode.value[0]?.id;
                nextEl = firstChildId ? nodeRefs.get(firstChildId) ?? null : null;
            }

            if (nextEl) {
                placeCursorAtStart({ element: nextEl });
                event.preventDefault();
            }
        }

        // ПРОБЕЛ — создать узел-значение
        if (
            event.key === ' ' &&
            range.startOffset === (target.textContent?.length ?? 0) &&
            target.textContent?.indexOf(' ') === -1
        ) {
            if (currentNode.parentId) {
                return state
            }

            const parentNode = state.index.get(currentNode.id)

            if (!parentNode) {
                return state
            }

                event.preventDefault();

                const newNode = {
                    name: 'a',
                    value: [],
                    prevId: null,
                    nextId: null,
                    parentId: parentNode.id
                };

                astFacade.addNode({parentId: parentNode.id, nodeData: newNode, updateParent: {isAssignment: true} });
        }
        return state;
    })
}

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="editor" on:keydown={handleKeyDown}>
    {#each Array.from($astStore.nodes.values()) as line (line.id)}
		<Node node={line} register={registerNode} unregister={unregisterNode} />
	{/each}
</div>
