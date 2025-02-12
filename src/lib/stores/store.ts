import { derived, writable } from 'svelte/store';
import type { AppState } from '$lib/models/states/appState';
import { addBlockToLine } from '$lib/utils/addBlockToLine';
import { addNewLine } from '$lib/utils/addNewLine';
import type { AddBlock, AddLine, AddOperator } from './types';
import { NamespaceManager } from '$lib/managers/namespaceManager';


const namespaceManager = new NamespaceManager()

const initialStore: AppState = {
	blocks: { '1': { id: '1', text: 'Block1' }, '2': { id: '2', text: 'Block2' }, '3': { id: '3', text: 'Block3' } },
	lines: {
		'1': { id: '1', blocksId: ['1', '2'] },
		'2': { id: '2', blocksId: ['3'] },
	},
	linesId: ['1', '2'],
	currentFocusId: '3',
	currentLineId: '2',
}

export const store = writable<AppState>(initialStore);

export const currentBlock = derived(store, $store => $store.blocks[$store.currentFocusId])
export const currentLine = derived(store, $store => $store.lines[$store.currentLineId])



export function addBlock({ lineId, blockId, text, parentBlockId }: AddBlock) {
	console.log('addBlock', lineId, blockId)
	let newBlock
	store.update(state => {
		newBlock = addBlockToLine({ state, lineId, blockId, text, parentBlockId })
		state.currentFocusId = newBlock.id
		return state // Возвращаем обновленное состояние
	})

	return newBlock
}

export function addOperator({ lineId, blockId, text }: AddOperator) {
	store.update(state => {
		const operatorBlockId = addBlockToLine({
			state, 
			lineId, 
			blockId, 
			text, 
			parentBlockId: ''
		})
		const newBlockId = addBlockToLine({ 
			state, 
			lineId, 
			blockId: operatorBlockId, 
			text: '', 
			parentBlockId: '' 
		})
		state.currentFocusId = newBlockId
		return state // Возвращаем обновленное состояние
	});
}

export function addLine({ lineId }: AddLine) {
	store.update(state => {
		const newLineId = addNewLine({ state, lineId })
		const newBlockId = addBlockToLine({ state, lineId: newLineId, blockId: null, text: '', parentBlockId: null })
		state.currentFocusId = newBlockId
		return state // Возвращаем обновленное состояние
	});
}
