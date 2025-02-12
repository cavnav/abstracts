<script lang="ts">
    import { store } from "$lib/stores/store";
    import { placeCursorAtStart } from "$lib/utils/placeCursor";
    import { derived } from "svelte/store";

	export let id: string;
	export let text: string;

	const currentFocusId = derived(store, ($store) => $store.currentFocusId);

	let inputElement: HTMLInputElement | undefined

	function handleFocus() {
		console.log('element', inputElement)
		
		if (!inputElement) {
			return
		}
		
		console.log('focus')
		inputElement.focus()

		if (true) {
			placeCursorAtStart({element: inputElement})	
		}
	}

  	$: {
		if ($currentFocusId === id && inputElement) {
			handleFocus()
		}
	}
</script>

<div class="block">
	<input
		bind:this={inputElement}
		data-block-id={id} 
		type="text"
		value={text}
	/>
</div>

<style>
	.block {
		border: 1px solid #ccc;
		padding: 5px 10px;
		min-width: 50px;
		text-align: center;
	}

	.block:focus {
		border-color: blue;
	}
</style>
