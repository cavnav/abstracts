<script lang="ts">
  import { onMount } from 'svelte';
  import clsx from 'clsx';
  import Node from './Node.svelte';
  import { placeCursorAtStart } from '$lib/utils/placeCursor';
  import { astStore } from '$lib/stores/store';
  import type { BaseNode } from '$lib/entities/classes/baseNode';

  export let node: BaseNode;
  export let register: (id: string, el: HTMLElement) => void;
  export let unregister: (id: string) => void;

  let element: HTMLDivElement;

  // Динамическое определение типа узла по имени
  $: nodeType = (() => {
    if (!node.name) return 'empty';
    if (/^\d+(\.\d+)?$/.test(node.name)) return 'literal';          // Число
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(node.name)) return 'identifier'; // Идентификатор
    return 'unknown';
  })();

  // Синхронизация содержимого contenteditable с node.name — вручную, чтобы избежать мерцания
  function syncContent() {
    if (!element) return;
    if (element.innerText !== node.name) {
      element.innerText = node.name;
    }
  }

  onMount(() => {
    register(node.id, element);

    // Устанавливаем начальное содержимое
    syncContent();

    if (node.id === $astStore.activeNodeId) {
      queueMicrotask(() => {
        placeCursorAtStart({ element });
      });
    }

    return () => unregister(node.id);
  });

  // При обновлении node.name — синхронизируем DOM
  $: syncContent();

  // Обработка ввода
  function updateName(event: Event) {
    const target = event.target as HTMLDivElement;
    const text = target.innerText.trim();

    astStore.update(state => {
      const current = state.nodes.get(node.id);
      if (current) {
        current.name = text;
      }

	  
      return state;
    });
  }
</script>

<div class="node-wrapper">
  <div
    class={clsx('node', nodeType)}
    bind:this={element}
    contenteditable="true"
    spellcheck="false"
    on:input={updateName}
    data-id={node.id}
  ></div>

  {#if node.value.length > 0}
    {#each node.value as child}
      <Node node={child} register={register} unregister={unregister} />
    {/each}
  {/if}
</div>

<style>
.node-wrapper {
	display: flex;
}
.node {
	padding: 4px 2px;
	display: inline-block;
	outline: none;
	text-align: center;
	transition: border-color 0.2s;
	border: 1px solid;
}

.node.identifier {
	border-right: 2px solid var(--assign-color-light);
}
</style>
