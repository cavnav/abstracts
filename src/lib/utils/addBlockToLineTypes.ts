import type { AppState } from "$lib/models/states/appState";
import type { BlockId } from "$lib/types/block";
import type { BlockText } from "$lib/types/blockText";
import type { LineId } from "$lib/types/line";

export interface AddBlockToLine {
    state: AppState
    lineId: LineId
    blockId: BlockId
    text: BlockText
    parentBlockId: BlockId
}
