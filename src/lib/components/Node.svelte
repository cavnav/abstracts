<script lang="ts">
    import { Node } from "$lib/entities/classes/Node";
    import { store } from "$lib/stores/store";
    import { onMount } from "svelte";

	export let node: Node;
  
	let inputElement: HTMLDivElement | undefined; // Пока компонент не отрендерен
  
	onMount(() => {
	  if (inputElement) {
		inputElement.innerText = node.name;
	  }
	});
  
	function updateName(event: Event) {
	  const target = event.target as HTMLDivElement;

	  store.update(state => {
		const currentNode = state.lines.get(node.id); // Получаем узел по его id
		if (currentNode) {
			currentNode.name = target.innerText; // Обновляем имя узла
		}
		return state;
	});
	}
  </script>

	<div
	  class="node" bind:this={inputElement} data-node-id={node.id}
	  contenteditable="true"
	  on:input={updateName}
	>
	  {node.name}
	</div>
  
  <style>
	.node {
	  border: 1px solid #ccc;
	  padding: 5px 10px;
	  min-width: 50px;
	  display: inline-block;
	  outline: none;
	}
  
	.node:focus {
	  border-color: blue;
	}
  
  </style>
