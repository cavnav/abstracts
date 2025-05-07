<script lang="ts">
	import { onMount } from 'svelte';
	import type { NodeClass } from '$lib/entities/classes/Node';
	import clsx from 'clsx';
	import Node from './Node.svelte';
  import { store } from '$lib/stores/store';
  import { placeCursorAtStart } from '$lib/utils/placeCursor';

	export let node: NodeClass;
	export let register: (id: string, el: HTMLElement) => void;
	export let unregister: (id: string) => void;

	let element: HTMLDivElement;

	onMount(() => {
		register(node.id, element);

		if (node.id === $store.activeNodeId) {
			queueMicrotask(() => {
				placeCursorAtStart({ element });
				$store.activeNodeId = null; // очистить, если нужно
			});
		}

		return () => unregister(node.id);
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
		class={clsx('node', { assignment: node.isAssignment })}
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
	padding: 4px 2px;
	display: inline-block;
	outline: none;
	text-align: center;
	transition: border-color 0.2s;
}

.node.assignment {
	border-right: 2px solid var(--assign-color-light);
}
</style>
