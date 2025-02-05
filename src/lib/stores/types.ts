import type { BlockId } from "$lib/types/block";
import type { BlockText } from "$lib/types/blockText";
import type { LineId } from "$lib/types/line";

export interface AddBlock {
    lineId: LineId
    blockId: BlockId
    text: BlockText
    parentBlockId: BlockId
}

export interface AddOperator {
    lineId: LineId
    blockId: BlockId
    text: BlockText

}

export interface AddLine {
    lineId: LineId
}