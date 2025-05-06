<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { NodeClass } from '$lib/entities/classes/Node';
	import Node from './Node.svelte';
  import { store } from '$lib/stores/store';

	export let node: NodeClass;
	export let register: (id: string, el: HTMLElement) => void;
	export let unregister: (id: string) => void;

	let element: HTMLDivElement;

	onMount(() => {
		element.innerText = node.name;
		register(node.id, element);
	});

	onDestroy(() => {
		unregister(node.id);
	});

	function updateName(event: Event) {
		const target = event.target as HTMLDivElement;

		store.update(state => {
			const currentNode = state.nodes.get(node.id);
			if (currentNode) {
				currentNode.name = target.innerText;
			}
			return state;
		});
	}

</script>

<div class="node-wrapper">
	<div
		class="node"
		bind:this={element}
		contenteditable="true"
		on:input={updateName}
		data-id={node.id}
	>
		{node.name}
	</div>

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
	border: 1px solid #ccc;
	padding: 5px 10px;
	min-width: 50px;
	display: inline-block;
	outline: none;
	text-align: center;
	border-radius: 6px;
	transition: border-color 0.2s;
}
.node:focus {
	border-color: blue;
}
</style>
