import type { BlockModel } from '$lib/models/';
import { generateId } from '$lib/utils/idGenerator';
import type { AddBlockToLine } from './addBlockToLineTypes';

export function addBlockToLine({ state, lineId, blockId, text, parentBlockId }: AddBlockToLine) {

	const newBlockId = generateId();

	const newBlock: BlockModel = {
		id: newBlockId,
		text,
		childBlocksId: [],
	};

	state.blocks[newBlockId] = newBlock;

	// Добавляем в нужную строку или как дочерний блок
	if (parentBlockId) {
		const parentBlock = state.blocks[parentBlockId];
		parentBlock.childBlocksId?.push(newBlockId);
	} else {
		const line = state.lines[lineId];
		if (blockId === null) {
			line.blocksId.push(newBlockId);
		} else {
			const index = line.blocksId.indexOf(blockId)
			line.blocksId.splice(index + 1, 0, newBlock.id)
			console.log('line.blocksId', newBlock.id)
		}
	}

	return newBlock
}