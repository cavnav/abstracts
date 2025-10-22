import type { EvaluateResult } from "$lib/types/evaluateResult";
import { Node } from "./Node";

export abstract class EvaluableNode extends Node {
    value: EvaluateResult

    constructor({value}: {value: EvaluateResult}) {
        super();
        this.value = value
    }

    getValue(): EvaluateResult {
        return this.value
    }

    setValue({value}: {value: EvaluateResult}) {
        this.value = value
    }
}