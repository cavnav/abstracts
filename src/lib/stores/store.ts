import { derived, writable } from 'svelte/store';
import type { AppState } from '$lib/models/states/appState';
import { addBlockToLine } from '$lib/utils/addBlockToLine';
import { addNewLine } from '$lib/utils/addNewLine';
import type { AddBlock, AddLine, AddOperator } from './types';
import { NamespaceManager } from '$lib/managers/namespaceManager';


const namespaceManager = new NamespaceManager()

const initialStore: AppState = {
	blocks: {
		'1': { id: '1', text: 'Block1' },
		'2': { id: '2', text: 'Block2' },
		'3': { id: '3', text: 'Block3' }
	},
	lines: {
		'1': { id: '1', blocksId: ['1', '2'] },
		'2': { id: '2', blocksId: ['3'] }
	},
	linesId: ['1', '2'],
	linesCount: 1,
	blocksCount: 1
};

// Основное состояние (структурные данные)
export const store = writable<AppState>(initialStore);

// Выносим часто изменяемые переменные в отдельные сторы
export const currentFocusId = writable<string>('2');
export const currentLineId = writable<string>('1');

// Флаги изменений
export const isChangedLines = writable(false);
export const isChangedBlocks = writable(false);

// Флаги положения курсора внутри блока
export const cursorAtStart = writable(false);
export const cursorAtEnd = writable(false);

export const currentBlock = derived(
	[store, currentFocusId],
	([$store, $currentFocusId]) => $store.blocks[$currentFocusId]
);

export const currentLine = derived(
	[store, currentLineId],
	([$store, $currentLineId]) => $store.lines[$currentLineId]
);


export function addBlock({ lineId, blockId, text, parentBlockId }: AddBlock) {
	console.log('addBlock', lineId, blockId)
	let newBlock
	updateStore(state => {
		newBlock = addBlockToLine({ state, lineId, blockId, text, parentBlockId })
		currentFocusId.set(newBlock.id)
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
		return state // Возвращаем обновленное состояние
	})
}

export function addLine({ lineId }: AddLine) {
	updateStore(state => {
		const newLineId = addNewLine({ state, lineId })
		addBlockToLine({ state, lineId: newLineId, blockId: '', text: '', parentBlockId: '' })
	})
}


// Обёртка для обновления стора и вычисления флагов
export function updateStore(updater: (state: AppState) => void) {
	store.update((state) => {
		// Мутируем состояние через updater
		updater(state);

		// Обновляем счетчики
		state.linesCount = state.linesId.length;
		state.blocksCount = Object.keys(state.blocks).length		

		return state // Возвращаем мутированное состояние
	})
}