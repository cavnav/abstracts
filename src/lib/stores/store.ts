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
	currentFocusId: '2',
	currentLineId: '1',
	linesCount: 1,
	blocksCount: 1,
	isChangedLines: false,
	isChangedBlocks: false
}

export const store = writable<AppState>(initialStore);

export const currentBlock = derived(store, $store => $store.blocks[$store.currentFocusId])
export const currentLine = derived(store, $store => $store.lines[$store.currentLineId])



export function addBlock({ lineId, blockId, text, parentBlockId }: AddBlock) {
	console.log('addBlock', lineId, blockId)
	let newBlock
	updateStore(state => {
		newBlock = addBlockToLine({ state, lineId, blockId, text, parentBlockId })
		state.currentFocusId = newBlock.id
		return state // Возвращаем обновленное состояние
	})

	return newBlock
}

export function addOperator({ lineId, blockId, text }: AddOperator) {
	store.update(state => {
		const operatorBlock = addBlockToLine({
			state, 
			lineId, 
			blockId, 
			text, 
			parentBlockId: ''
		})
		const newBlock = addBlockToLine({ 
			state, 
			lineId, 
			blockId: operatorBlock.id, 
			text: '', 
			parentBlockId: '' 
		})
		state.currentFocusId = newBlock.id
		return state // Возвращаем обновленное состояние
	});
}

export function addLine({ lineId }: AddLine) {
	updateStore(state => {
		const newLineId = addNewLine({ state, lineId })
		const newBlock = addBlockToLine({ state, lineId: newLineId, blockId: '', text: '', parentBlockId: '' })
		state.currentFocusId = newBlock.id
	})
}


// Обёртка для обновления стора и вычисления флагов
export function updateStore(updater: (state: AppState) => void) {
	store.update((state) => {
	  // Мутируем состояние через updater
	  updater(state);
  
	  // Обновляем счетчики
	  state.linesCount = state.linesId.length;
	  state.blocksCount = Object.keys(state.blocks).length;
  
	  return state // Возвращаем мутированное состояние
	})
  }