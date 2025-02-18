import type { BlockModel } from '$lib/models';
import type { Blocks } from '$lib/types/block';
import type { LineId, Lines } from '$lib/types/line';

export function getLines({lines, blocks, linesId}: {lines: Lines, blocks: Blocks, linesId: LineId[]}): Array<{id: string, blocks: Array<BlockModel>}> {
  return linesId.map((lineId) => {
    const line = lines[lineId];
    return {
      id: line.id,
      blocks: line.blocksId.map((blockId) => blocks[blockId]),
    }
  })
}
