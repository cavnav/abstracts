<script lang="ts">
    import { store } from "$lib/stores/store";

	export let id: string;
	export let text: string;

	let inputElement: HTMLInputElement | undefined

	function handleFocus({currentFocusId}: {currentFocusId: string | null}) {
		console.log('element', inputElement)
		if (currentFocusId === id && inputElement) {
			console.log('handleFocus')
			inputElement.focus();
			store.update(state => {
				state.currentFocusId = null;
				return state;
			});
		}
	}

  	$: {
		if (inputElement) {
			handleFocus({currentFocusId: $store.currentFocusId})
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
