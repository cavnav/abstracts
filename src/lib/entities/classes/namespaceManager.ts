import type { INamespaceManager } from "$lib/types/namespaceManager";

interface SetVariableParams {
    name: string;
    value: any;
  }
  
  interface GetVariableParams {
    name: string;
  }
  
  export class NamespaceManager implements INamespaceManager {
    private variables: Map<string, any>;
    private parent: NamespaceManager | null;
  
    constructor({ parent }: { parent: NamespaceManager | null } = { parent: null }) {
      this.variables = new Map();
      this.parent = parent;
    }
  
    setVariable({ name, value }: SetVariableParams): void {
      this.variables.set(name, value);
    }
  
    getVariable({ name }: GetVariableParams): any | undefined {
      if (this.variables.has(name)) {
        return this.variables.get(name);
      }
      return this.parent ? this.parent.getVariable({ name }) : undefined;
    }
  }

  export const namespaceManager = new NamespaceManager()
  
