// import { type IASTManager } from "$lib/managers/astManager";
// import { astStore } from "$lib/stores/store";
// import type { IBaseNode, INode, PrimitiveValue } from "$lib/types/ast";
// import { generateId } from "$lib/utils/idGenerator";
// import { get } from "svelte/store";

// import { interpreter } from "../entities/setupInterpeter";
// import { nodeConstructors } from "../entities/nodeConstructors";
// import { IdentifierNode } from "../entities/identifierNode";

// export class ASTFacadeWithState {
//   private manager: IASTManager;

//   constructor({ manager }: { manager: IASTManager }) {
//     this.manager = manager;
//   }

//   appendLiteralTo(parentId: string, value: PrimitiveValue) {
//     const literal = new nodeConstructors.LiteralNode({
//       id: generateId(),
//       value,
//       parentId,
//       prevId: null,
//       nextId: null,
//     });

//     astStore.update((s) => {
//       const parent = s.index.get(parentId);
//       if (!parent) return s;

//       // Убедимся, что parent.value — массив
//       if (!Array.isArray(parent.value)) {
//         console.warn(
//           `Нельзя добавить узел в parent.value: ожидается массив, получено ${typeof parent.value}`
//         );
//         return s;
//       }

//       const prevNode =
//         parent.value.length > 0 ? parent.value[parent.value.length - 1] : null;

//       // Обновляем связи
//       this.setNodeLinks({
//         nodeId: literal.id,
//         newPrevId: prevNode?.id ?? null,
//         newNextId: null,
//       });

//       parent.value.push(literal);

//       s.index.update(parent);
//       s.index.add(literal);
//       s.activeNodeId = literal.id;

//       return s;
//     });

//     this.evaluateNode(parentId);
//   }

//   replaceNode({ id, nodeData }: { id: string; nodeData: IBaseNode }) {
//     astStore.update((s) => {
//       const oldNode = s.index.get(id);
//       if (!oldNode) return s;

//       // Наследуем ссылки
//       nodeData.parentId = oldNode.parentId;
//       nodeData.prevId = oldNode.prevId;
//       nodeData.nextId = oldNode.nextId;

//       // Обновляем родителя, если он есть
//       if (oldNode.parentId) {
//         const parent = s.index.get(oldNode.parentId);
//         if (parent && Array.isArray(parent.value)) {
//           const index = parent.value.findIndex((c) => c.id === id);
//           if (index !== -1) {
//             parent.value[index] = nodeData;
//             s.index.update(parent);
//           }
//         }
//       }

//       // Обновляем index
//       s.index.remove(oldNode.id);
//       s.index.add(nodeData);

//       // Заменяем в nodes
//       s.nodes.delete(oldNode.id);
//       s.nodes.set(nodeData.id, nodeData);

//       // Сделаем новый активным
//       s.activeNodeId = nodeData.id;

//       return s;
//     });

//     // Автоматическая переоценка нового узла
//     this.evaluateNode(nodeData.id);
//   }

//   createAssignment(identifierName: string) {
//     const assignmentId = generateId();
//     const identifierId = generateId();

//     const identifier = new nodeConstructors.IdentifierNode({
//       id: identifierId,
//       name: identifierName,
//       parentId: assignmentId,
//       prevId: null,
//       nextId: null,
//     });

//     const assignment = new nodeConstructors.AssignmentNode({
//       id: assignmentId,
//       name: "=",
//       value: {
//         left: identifier,
//         right: null,
//       },
//       parentId: null,
//       prevId: null,
//       nextId: null,
//     });

//     // Обновление стора
//     astStore.update((s) => {
//       s.nodes.set(assignment.id, assignment);
//       s.nodes.set(identifier.id, identifier);

//       s.index.add(assignment);
//       s.index.add(identifier);

//       s.activeNodeId = assignment.id;
//       return s;
//     });

//     this.evaluateNode(assignmentId);

//     return assignment;
//   }

//   setNodeLinks({
//     nodeId,
//     newPrevId,
//     newNextId,
//   }: {
//     nodeId: string;
//     newPrevId?: string | null;
//     newNextId?: string | null;
//   }) {
//     astStore.update((state) => {
//       const node = state.index.get(nodeId);
//       if (!node) return state;

//       const oldPrevId = node.prevId;
//       const oldNextId = node.nextId;

//       // Обновляем ссылки у самого узла
//       if (newPrevId !== undefined) node.prevId = newPrevId;
//       if (newNextId !== undefined) node.nextId = newNextId;

//       // Связываем старых соседей, если они есть и node покидает своё место
//       const movedPrev = newPrevId !== oldPrevId;
//       const movedNext = newNextId !== oldNextId;

//       if (movedPrev || movedNext) {
//         if (oldPrevId && oldNextId) {
//           const oldPrev = state.index.get(oldPrevId);
//           const oldNext = state.index.get(oldNextId);

//           if (oldPrev && oldNext) {
//             oldPrev.nextId = oldNext.id;
//             oldNext.prevId = oldPrev.id;

//             state.index.update(oldPrev);
//             state.index.update(oldNext);
//           }
//         }
//       }

//       // Обновляем нового prevNode
//       if (newPrevId) {
//         const newPrev = state.index.get(newPrevId);
//         if (newPrev && newPrev.nextId !== node.id) {
//           newPrev.nextId = node.id;
//           state.index.update(newPrev);
//         }
//       }

//       // Обновляем нового nextNode
//       if (newNextId) {
//         const newNext = state.index.get(newNextId);
//         if (newNext && newNext.prevId !== node.id) {
//           newNext.prevId = node.id;
//           state.index.update(newNext);
//         }
//       }

//       state.index.update(node);
//       return state;
//     });
//   }

//   async evaluateNode(nodeId: string) {
//     const node = get(astStore).index.get(nodeId);
//     if (!node) throw new Error("Node not found");
//     return await interpreter.evaluateNode(node);
//   }

//   async evaluateAST(rootId: string) {
//     const root = get(astStore).index.get(rootId);
//     if (!root) throw new Error("Root node not found");
//     return await interpreter.evaluateAST(root);
//   }

//   updateNodeNameAndEvaluate(nodeId: string, newName: string) {
//     let parentId: string | null = null;

//     astStore.update((state) => {
//       const node = state.index.get(nodeId);
//       if (!node) return state;

//       node.name = newName;
//       parentId = node.parentId ?? null;

//       return state;
//     });

//     const targetId = parentId || nodeId;
//     this.evaluateNode(targetId);
//   }

//   addNewLineBelow(currentNodeId: string) {
//     const newNode = new IdentifierNode({
//       id: generateId(),
//     });

//     astStore.update((s) => {
//       s.nodes.set(newNode.id, newNode); // Просто добавляем в верхний уровень
//       s.index.add(newNode); // Добавляем в индекс
//       s.activeNodeId = newNode.id; // Активируем новую строку
//       return s;
//     });

//     this.evaluateNode(newNode.id);

//     this.evaluateNode(newNode.id);
//   }

//   createIdentifierNode(name: string, parentId?: string): IBaseNode {
//     const node = new nodeConstructors.IdentifierNode({
//       id: generateId(),
//       name,
//       parentId: parentId ?? null,
//       prevId: null,
//       nextId: null,
//     });

//     astStore.update((s) => {
//       if (parentId) {
//         const parent = s.index.get(parentId);
//         if (parent) {
//           if (!Array.isArray(parent.value)) {
//             parent.value = [];
//           }
//           const prevNode = parent.value[parent.value.length - 1] ?? null;

//           this.setNodeLinks({
//             updatedNodeId: node.id,
//             parentNodeId: parent.id,
//             newPrevId: prevNode?.id ?? null,
//           });

//           parent.value.push(node);
//           s.index.update(parent);
//         }
//       }

//       s.index.add(node);
//       s.activeNodeId = node.id;
//       return s;
//     });

//     return node;
//   }

//   createBinaryNode(
//     operator: string,
//     left: IBaseNode,
//     right: IBaseNode
//   ): IBaseNode {
//     const node = new nodeConstructors.BinaryNode({
//       id: generateId(),
//       value: { operator, left, right },
//       parentId: null,
//       prevId: null,
//       nextId: null,
//     });

//     astStore.update((s) => {
//       s.index.add(node);
//       s.activeNodeId = node.id;
//       return s;
//     });

//     return node;
//   }

//   createLiteralNode(value: string, parentId: string) {
//     const { LiteralNode } = nodeConstructors;
//     const node = new LiteralNode({
//       id: generateId(),
//       value,
//       parentId,
//     });

//     astStore.update((s) => {
//       s.nodes.set(node.id, node);
//       s.index.add(node);
//       s.activeNodeId = node.id;
//       return s;
//     });

//     return node;
//   }

//   addNode({
//     parentId,
//     nodeData,
//   }: {
//     parentId: string;
//     nodeData: Omit<INode, "id">;
//   }) {
//     const NodeConstructor = nodeConstructors[nodeData.type];
//     if (!NodeConstructor) {
//       throw new Error(`Unknown node type: ${nodeData.type}`);
//     }

//     const node = new NodeConstructor({ ...nodeData, id: generateId() });

//     astStore.update((s) => {
//       const parent = s.index.get(parentId);
//       if (!parent) return s;

//       const prevNode = parent.value?.[parent.value.length - 1];
//       if (!prevNode) {
//         node.prevId = parentId;
//       } else {
//         node.prevId = prevNode.id;
//         prevNode.nextId = node.id;
//       }

//       const { updatedParent, child } = this.manager.addChild(parent, node);

//       if (!updatedParent.parentId) {
//         s.nodes.set(updatedParent.id, updatedParent);
//       }
//       s.index.update(updatedParent);
//       s.index.add(child);
//       s.activeNodeId = child.id;

//       return s;
//     });

//     this.evaluateNode(node.id);
//   }

//   removeNode(nodeId: string) {
//     astStore.update((s) => {
//       const node = s.index.get(nodeId);
//       if (!node || !node.parentId) return s;

//       const parent = s.index.get(node.parentId);
//       if (!parent) return s;

//       const { updatedParent } = this.manager.removeNode(node, parent);

//       s.index.remove(node.id);
//       s.index.add(updatedParent);

//       if (s.activeNodeId === node.id) {
//         s.activeNodeId = null;
//       }

//       return s;
//     });
//   }
// }
