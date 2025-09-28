import type { LineModel } from "$lib/models";
import type { AppState } from "$lib/models/states/appState";
import { generateId } from "./idGenerator";

interface AddNewLine {
    state: AppState
    lineId: string // ID строки, после которой нужно вставить новую
}

export function addNewLine({state, lineId}: AddNewLine): string {
    const newLineId = generateId();
    const newLine: LineModel = {
      id: newLineId,
      blocksId: [],
    };
  
    state.lines[newLineId] = newLine;
    const index = state.linesId.indexOf(lineId)
    state.linesId.splice(index + 1, 0, newLineId)

    return newLineId
  }
  