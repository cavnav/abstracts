import { writable } from 'svelte/store';
import type { INode } from '$lib/types/ast';
import { NodeClass } from '$lib/entities/classes/Node';

interface ASTStore {
	lines: Map<string, INode>
}

export const store = writable<ASTStore>({
	lines: new Map([
	  ['1', new NodeClass({id: '1', name: 'x', value: [
		new NodeClass({id: '2', name: 'aaa', value: []}),
		new NodeClass({id: '22', name: '+', value: []}),
		new NodeClass({id: '3', name: 'bbb', value: []}),
		new NodeClass({id: '33', name: '+', value: []}),
		new NodeClass({id: '4', name: 'ddd', value: []}),
	  ]})],
	])
  });