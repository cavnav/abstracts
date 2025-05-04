<script lang="ts">
    import { NodeClass } from "$lib/entities/classes/Node";
    import { store } from "$lib/stores/store";
    import { onMount } from "svelte";
	import Node from "./Node.svelte"; // ← импорт самого компонента для рекурсии

	export let node: NodeClass;
  
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


	<div class="node-wrapper">
		<div
		  class="node"
		  data-id={node.id}
		  contenteditable="true"
		  on:input={updateName}
		>
		  {node.name}
		</div>
	  
		<!-- Рекурсивный вызов для потомков -->
		{#if node.value.length > 0}
			{#each node.value as child}
			  <Node node={child}/>
			{/each}
		{/if}
	  </div>
  
  <style>
	.node-wrapper {
		display: flex;
	}
	.node {
	  border: 1px solid #ccc;
	  padding: 5px 10px;
	  min-width: 50px;
	  display: inline-block;
	  outline: none;
	  text-align: center;
	}
  
	.node:focus {
	  border-color: blue;
	}
  
  </style>
