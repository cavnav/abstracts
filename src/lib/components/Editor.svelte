<script lang="ts">
	import { store } from '$lib/stores/store';
	import Node from './Node.svelte';
	import { placeCursorAtStart, placeCursorAtEnd } from '$lib/utils/placeCursor';
  import { generateId } from '$lib/utils/generateId';
  import type { INode } from '$lib/types/ast';

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

	// ← ← ← Влево
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

	// → → → Вправо (включая спуск к первому потомку)
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

	// ПРОБЕЛ — попытка создания узла значения (присваивание)
	if (
		event.key === ' ' &&
		range.startOffset === (target.textContent?.length ?? 0) &&
		target.textContent?.indexOf(' ') === -1 // текст не содержит пробелов
	) {
		// Проверка: узел — первый в строке
		const isFirstInLine =
			!currentNode.parentId || $store.index.get(currentNode.parentId)?.value?.[0]?.id === currentNode.id;

		if (isFirstInLine) {
			event.preventDefault(); // предотвратить вставку пробела

			// создать узел-значение
			const newNode: INode = {
				id: generateId(),
                name: 'a',
				value: [],
                prevId: null,
                nextId: null,
				parentId: currentNode.parentId ?? currentNode.id,
			};

			// вставить в конец value
			const parentNode =
				currentNode.parentId
					? $store.index.get(currentNode.parentId)
					: currentNode;

			if (!parentNode) return;

			parentNode.value = [...(parentNode.value ?? []), newNode];
			parentNode.isAssignment = true

            store.update(s => {
                s.index.add(newNode);
                s.activeNodeId = newNode.id
                return s;
            });
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

