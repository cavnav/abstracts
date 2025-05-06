<script lang="ts">
	import { store } from '$lib/stores/store';
	import Node from './Node.svelte';
	import { placeCursorAtStart, placeCursorAtEnd } from '$lib/utils/placeCursor';

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

        const currentNode = $store.index.get(nodeId);
        if (!currentNode) return;

		if (event.key === 'ArrowLeft' && range.startOffset === 0) {
			const prevEl = currentNode.prevId
				? nodeRefs.get(currentNode.prevId)
				: currentNode.parentId
					? nodeRefs.get(currentNode.parentId)
					: null;

			if (prevEl) {
				placeCursorAtEnd({ node: prevEl });
				event.preventDefault();
			}
		}

		if (
            event.key === 'ArrowRight' &&
            range.startOffset === (target.textContent?.length ?? 0)
        ) {
            let nextEl: HTMLElement | null = null;

            if (currentNode.nextId) {
                nextEl = nodeRefs.get(currentNode.nextId) ?? null;
            }

            // если нет nextId, но есть дети — берём первого ребёнка
            if (!nextEl && currentNode.value?.length) {
                const firstChildId = currentNode.value[0]?.id;
                nextEl = firstChildId ? nodeRefs.get(firstChildId) ?? null : null;
            }

            if (nextEl) {
                placeCursorAtStart({ node: nextEl });
                event.preventDefault();
            }
        }
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="editor" on:keydown={handleKeyDown}>
    {#each $store.nodes.values() as line (line.id)}
		<Node node={line} register={registerNode} unregister={unregisterNode} />
	{/each}
</div>

