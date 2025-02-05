import type { BlockId } from "$lib/types/block"
import type { LineId } from "$lib/types/line"
import type { BlockModel } from "../block"
import type { LineModel } from "../line"

export interface AppState {
    linesId: LineId[]
    lines: Record<string, LineModel>
    blocks: Record<string, BlockModel>
    currentFocusId: BlockId | null // ID блока с фокусом
    currentLineId: LineId | null
}