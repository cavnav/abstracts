import { writable } from 'svelte/store';
import type { INode } from '$lib/types/ast';
import { Node } from '$lib/entities/classes/Node';

interface ASTStore {
	lines: Map<string, INode>
}

export const store = writable<ASTStore>({
	lines: new Map([
	  ['1', new Node({id: '1', name: 'x', value: [
		new Node({id: '2', name: 'aaa', value: []}),
		new Node({id: '3', name: 'bbb', value: []}),
		new Node({id: '4', name: 'ddd', value: []}),
	  ]})],
	])
  });