<script lang="ts">
	import Node from './Node.svelte';
	import { placeCursorAtStart, placeCursorAtEnd } from '$lib/utils/placeCursor';
  import { astFacade } from '$lib/entities/classes/astFacadeWithState';
  import { astStore } from '$lib/stores/store';
  import { get } from 'svelte/store';
  import { setupNodeFactory } from '$lib/entities/classes/setupNodeFactory';
  import { onMount } from 'svelte';

    // Подключим фабрику один раз при монтировании редактора
  onMount(() => {
    setupNodeFactory();
  });

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

  // Если пробел и курсор в конце, и в тексте пробела ещё нет — вставляем узел и предотвращаем пробел
  if (
    event.key === ' ' &&
    range.startOffset === (target.textContent?.length ?? 0) &&
    target.textContent?.indexOf(' ') === -1
  ) {
    event.preventDefault();  // Остановить вставку пробела

    const currentNode = get(astStore).index.get(nodeId);
    const parentIdForNewNode = currentNode?.parentId ?? currentNode?.id;

    if (parentIdForNewNode) {
      const newNode = {
        name: '',
        value: [],
        prevId: null,
        nextId: null,
        parentId: parentIdForNewNode,
      };
      astFacade.addNode({ parentId: parentIdForNewNode, nodeData: newNode });

      // Можно дополнительно переместить курсор на новый узел или сделать другую логику
    }
    return; // Завершаем, дальше обрабатывать не надо
  }

  // Логика со стрелками — без изменений
  astStore.update(state => {
    const currentNode = state.index.get(nodeId);
    if (!currentNode) return state;

    if (event.key === 'ArrowLeft' && range.startOffset === 0) {
      const prevEl = currentNode.prevId
        ? nodeRefs.get(currentNode.prevId)
        : currentNode.parentId
        ? nodeRefs.get(currentNode.parentId)
        : null;
      if (prevEl) placeCursorAtEnd({ element: prevEl });
    }

    if (event.key === 'ArrowRight' && range.startOffset === (target.textContent?.length ?? 0)) {
      let nextEl = currentNode.nextId ? nodeRefs.get(currentNode.nextId) : null;
      if (!nextEl && currentNode.value?.length) {
        nextEl = nodeRefs.get(currentNode.value[0].id) ?? null;
      }
      if (nextEl) placeCursorAtStart({ element: nextEl });
    }

    return state;
  });
}


</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="editor" on:keydown={handleKeyDown}>
    {#each Array.from($astStore.nodes.values()) as line (line.id)}
		<Node node={line} register={registerNode} unregister={unregisterNode} />
	{/each}
</div>
