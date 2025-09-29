<script lang="ts">
  import { onMount } from 'svelte';
  import clsx from 'clsx';
  import { placeCursorAtStart } from '$lib/utils/placeCursor';
  import { astStore } from '$lib/stores/store';
  import type { UpdateNodeParams } from '$lib/types/updateNodeParams';
  import type { ILiteralNode } from '$lib/entities/literalNode';
  import { astFacade } from '$lib/managers/ast/astFacade';

  export let node: ILiteralNode;
  export let register: (id: string, el: HTMLElement) => void;
  export let unregister: (id: string) => void;

  let element: HTMLDivElement;

  function syncContent() {
    if (!element) return;
    const currentText = element.innerText;
    if (currentText !== String(node.value)) {
      element.innerText = String(node.value ?? '');
    }
  }

  onMount(() => {
    register(node.id, element);

    syncContent();

    if (node.id === $astStore.activeNodeId) {
      queueMicrotask(() => placeCursorAtStart({ element }));
    }

    return () => unregister(node.id);
  });

  $: syncContent();

  function onInput(event: Event) {
    const target = event.target as HTMLDivElement;
    const text = target.innerText;

    // Обновляем узел через универсальный фасад
    if (text !== node.value) {
      astFacade.updateNode(node.id, { value: text } as UpdateNodeParams<'LiteralNode'>);
    }
  }
</script>

<div class="node-wrapper">
  <div
    class={clsx('node', node.type)}
    bind:this={element}
    contenteditable="true"
    spellcheck="false"
    on:input={onInput}
    data-id={node.id}
  ></div>
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
</style>
