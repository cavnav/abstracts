<script lang="ts">
    import type { BlockModel } from "$lib/models";
    import { store } from "$lib/stores/store";
    import { placeCursorAtStart } from "$lib/utils/placeCursor";
    import { derived } from "svelte/store";

	export let block: BlockModel

	const {id, text} = block

	const currentFocusId = derived(store, ($store) => $store.currentFocusId)
	
	// Используем комбинированный текст: либо из пропса, либо из стора
	$: finalText = text ? text : $store.blocks[id]?.text || ""

	let inputElement: HTMLInputElement | undefined

	function handleFocus() {		
		if (!inputElement) {
			return
		}
		
		inputElement.focus()

		if (true) {
			placeCursorAtStart({block: inputElement})	
		}
	}

	function updateText(event: Event) {
		if (!event) {
			return
		}

		const target = event.target as HTMLInputElement 
		
		store.update(state => {
			state.blocks[id].text = target.value
			return state
		})
	}

  	$: {
		if ($currentFocusId === id && inputElement) {
			handleFocus()
		}			
	}
</script>

<div class="block">
	<input
		type="text"
		value={finalText}
		data-block-id={id} 
		bind:this={inputElement}
		on:input={updateText}
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
