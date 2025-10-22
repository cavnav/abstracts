import type { Node } from "./Node"

export class ContextManager {
  parent: ContextManager | null = null
  variables: Record<string, ContextManager> | null = null
  functions: Record<string, ContextManager> | null = null
  conditions: Record<string, ContextManager> | null = null
  
  constructor(parent: ContextManager | null = null) {   
    this.parent = parent
    
    // 🎯 Категории наследуют через прототипы. для авто поиска.
    // чтобы запись “шла вверх” — нужно,
    // чтобы родитель имел setter, а не обычное свойство.
    // Тогда JS не создаёт новое свойство у дочернего объекта
    // Object.create(null) — это глобальный контекст

    this.variables = Object.create(parent?.variables || null)
    this.functions = Object.create(parent?.functions || null)
    this.conditions = Object.create(parent?.conditions || null)
  }

  createChild(): ContextManager {
    return new ContextManager(this)
  }
}