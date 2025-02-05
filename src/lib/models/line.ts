import type { BlockId } from "$lib/types/block"
import type { LineId } from "$lib/types/line"

export interface LineModel {
    id: LineId
    blocksId: BlockId[]
}