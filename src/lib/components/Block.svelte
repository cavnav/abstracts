<script lang="ts">
    import type { BlockModel } from "$lib/models";
    import { store, currentFocusId } from "$lib/stores/store";
    import { placeCursorAtStart } from "$lib/utils/placeCursor";

	export let block: BlockModel

	const {id, text} = block

	
	// Используем комбинированный текст: либо из пропса, либо из стора
	$: finalText = text ? text : $store.blocks[id]?.text || ""

	let inputElement: HTMLDivElement | undefined

	function setFocus() {		
		if (!inputElement) {
			return
		}
		console.log('inputElement', inputElement)
		placeCursorAtStart({block: inputElement})	
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
			setFocus()
		}			
	}
</script>

<div class="block" bind:this={inputElement}>
	<input
		type="text"
		value={finalText}
		data-block-id={id} 		
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
