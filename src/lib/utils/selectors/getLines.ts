import type { BlockModel } from '$lib/models';
import type { AppState } from '$lib/models/states/appState';

export function getLines({state}: {state: AppState}): Array<{id: string, blocks: Array<BlockModel>}> {
  return state.linesId.map((lineId) => {
    const line = state.lines[lineId];
    return {
      id: line.id,
      blocks: line.blocksId.map((blockId) => state.blocks[blockId]),
    };
  });
}
