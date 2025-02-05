// Модуль для управления пространством имен
export type Varname = string

export class NamespaceManager {
    private names: Map<string, any>; // Хранит имена и их значения

    constructor() {
        this.names = new Map();
    }

    addName({varname, value}: {varname: Varname, value: any}): void {
        if (this.names.has(varname)) {
            throw new Error(`Name '${varname}' already exists.`);
        }
        this.names.set(varname, value);
    }

    updateName({varname, value}: {varname: Varname, value: any}): void {
        if (!this.names.has(varname)) {
            throw new Error(`Name '${varname}' does not exist.`);
        }
        this.names.set(varname, value);
    }

    getNameValue({varname}:{varname: Varname}): any {
        if (!this.names.has(varname)) {
            throw new Error(`Name '${varname}' does not exist.`);
        }
        return this.names.get(varname);
    }

    listNames(): [string, any][] {
        return Array.from(this.names.entries());
    }

    getContext(): Record<string, any> {
        return Object.fromEntries(this.names);
    }
}