import { IdentifierNode } from './identifierNode';
import { LiteralNode } from './literalNode';
import { nodeFactory } from './nodeFactory';

// Централизованная регистрация всех типов узлов
export function setupNodeFactory() {
  nodeFactory.register(LiteralNode);
  nodeFactory.register(IdentifierNode);
}
