import { get, writable } from 'svelte/store';
import type { AppState } from '$lib/models/states/appState';
import { addBlockToLine } from '$lib/utils/addBlockToLine';
import { addNewLine } from '$lib/utils/addNewLine';
import type { AddBlock, AddLine, AddOperator } from './types';
import { NamespaceManager } from '$lib/managers/namespaceManager';


const namespaceManager = new NamespaceManager()

const initialStore: AppState = {
	blocks: { '1': { id: '1', text: 'Block 1' }, '2': { id: '2', text: 'Block 2' }, '3': { id: '3', text: 'Block 3' } },
	lines: {
		'1': { id: '1', blocksId: ['1', '2'] },
		'2': { id: '2', blocksId: ['3'] },
	},
	linesId: ['1', '2'],
	currentFocusId: '1',
	currentLineId: '1',
}

export const store = writable<AppState>(initialStore);

export function getCurrentBlock() {
    const state = get(store)
    return state.currentFocusId ? state.blocks[state.currentFocusId] : null
}

export function getCurrentLine() {
    const state = get(store)
    return state.currentFocusId ? 
		state.currentLineId ? 
			state.lines[state.currentLineId] 
			: null
		: null
}


export function addBlock({ lineId, blockId, text, parentBlockId }: AddBlock) {
	store.update(state => {
		const newBlockId = addBlockToLine({ state, lineId, blockId, text, parentBlockId })
		state.currentFocusId = newBlockId
		return state // Возвращаем обновленное состояние
	});
}

export function addOperator({ lineId, blockId, text }: AddOperator) {
	store.update(state => {
		const operatorBlockId = addBlockToLine({
			state, 
			lineId, 
			blockId, 
			text, 
			parentBlockId: null
		})
		const newBlockId = addBlockToLine({ 
			state, 
			lineId, 
			blockId: operatorBlockId, 
			text: '', 
			parentBlockId: null 
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
