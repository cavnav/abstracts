import type { Blocks } from "$lib/types/block"
import type { LineId, Lines } from "$lib/types/line"

export interface AppState {
    linesId: LineId[]
    lines: Lines
    blocks: Blocks
    linesCount: number
    blocksCount: number
}