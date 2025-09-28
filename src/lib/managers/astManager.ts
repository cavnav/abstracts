// import type { IBaseNode } from "$lib/types/ast";

// export class ASTManager {
//   addChild(parent: IBaseNode, child: IBaseNode): { updatedParent: IBaseNode; child: IBaseNode } {
//     child.parentId = parent.id;
    
//     // Создаём новый экземпляр родителя с обновлённым списком дочерних
//     const updatedParent = parent.cloneWith({
//       value: [...parent.value, child],
//     });
    
//     return { updatedParent, child };
//   }

//   removeNode(node: IBaseNode, parent: IBaseNode): { updatedParent: IBaseNode } {
//     const updatedParent = parent.cloneWith({
//       value: parent.value.filter(n => n.id !== node.id),
//     });
//     return { updatedParent };
//   }
// }

// export type IASTManager = InstanceType<typeof ASTManager>