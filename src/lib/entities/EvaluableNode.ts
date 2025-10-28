import type { EvaluateResult } from "$lib/types/evaluateResult";
import { Node } from "./Node";

export abstract class EvaluableNode extends Node {
    value: EvaluateResult

    constructor(params: {id: string, value: EvaluateResult}) {
        super({id: params.id});
        this.value = params.value
    }

    getValue(): EvaluateResult {
        return this.value
    }

    setValue({value}: {value: EvaluateResult}) {
        this.value = value
    }
}