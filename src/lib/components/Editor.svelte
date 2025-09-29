<script lang="ts">
  import Node from "./LiteralNode.svelte";
  import { placeCursorAtStart, placeCursorAtEnd } from "$lib/utils/placeCursor";
  import { astStore } from "$lib/stores/store";
  import { get } from "svelte/store";
  import { astFacade } from "$lib/managers/ast/astFacade";
  import { nodesFactory } from "$lib/managers/nodesFactory";

  const nodeRefs = new Map<string, HTMLElement>();

  function registerNode(id: string, el: HTMLElement) {
    nodeRefs.set(id, el);
  }

  function unregisterNode(id: string) {
    nodeRefs.delete(id);
  }

  function handleKeyDown(event: KeyboardEvent) {
    event.preventDefault();

    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const target = event.target as HTMLElement;
    const nodeId = target?.dataset?.id;

    if (!nodeId || !range) return;

    if (event.key === "Enter") {      
      astFacade.(nodeId);
      return;
    }

    if (
      event.key === " " &&
      range.startOffset === (target.textContent?.length ?? 0) &&
      target.textContent?.indexOf(" ") === -1
    ) {
      const state = get(astStore);
      const currentNode = state.nodes.get(nodeId);
      if (!currentNode) return;

      const assignmentNode = nodesFactory.createAssignmentNode({
        value: {
          left,
          right
        }
      });

      astFacade.replaceNode({ 
        oldNode: currentNode, 
        newNode: assignmentNode 
      });

      focusNode({nodeId: assignmentNode.id})

      return
    }

    astStore.update((state) => {
      const currentNode = state.nodes.get(nodeId);
      if (!currentNode) return state;

      if (event.key === "ArrowLeft" && range.startOffset === 0) {
        const prevEl = currentNode.prevId
          ? nodeRefs.get(currentNode.prevId)
          : currentNode.parentId
            ? nodeRefs.get(currentNode.parentId)
            : null;
        if (prevEl) placeCursorAtEnd({ element: prevEl });
      }

      if (
        event.key === "ArrowRight" &&
        range.startOffset === (target.textContent?.length ?? 0)
      ) {
        let nextEl = currentNode.nextId
          ? nodeRefs.get(currentNode.nextId)
          : null;
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
