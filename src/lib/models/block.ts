import type { BlockId, BlockType } from "$lib/types/block"
import type { BlockText } from "$lib/types/blockText"

export interface BlockModel {
    id: BlockId
    type?: BlockType
    text: BlockText
    childBlocksId?: BlockId[]
}