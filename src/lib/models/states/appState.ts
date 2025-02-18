import type { BlockId, Blocks } from "$lib/types/block"
import type { LineId, Lines } from "$lib/types/line"
import type { BlockModel } from "../block"
import type { LineModel } from "../line"

export interface AppState {
    linesId: LineId[]
    lines: Lines
    blocks: Blocks
    currentFocusId: BlockId // ID блока с фокусом
    currentLineId: LineId
    linesCount: number
    blocksCount: number
    isChangedLines: boolean
    isChangedBlocks: boolean
}