import type { BlockModel } from "$lib/models"

export type BlockId = string
export type BlockType = 'operator' | 'address' | 'value' | 'keyword'
export type Blocks = Record<string, BlockModel>
