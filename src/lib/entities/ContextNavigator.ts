import type { ContextManager } from "./ContextManager"

export class ContextNavigator {
  stack: Map<string, ContextManager> = new Map()
  constructor(private currentContext: ContextManager) {}

  // 🎯 Получить цепочку имён для отображения
  getPath(): string[] {
    return Array.from(this.stack.keys())
  }

  // 🎯 Проверить, находится ли контекст в цепочке родителей
  isInChain(params: { targetContext: ContextManager }): boolean {
    let current: ContextManager | null = this.currentContext
    while (current) {
      if (current === params.targetContext) return true
      current = current.parent
    }
    return false
  }

  // 🎯 Найти контекст по условию
  findContext(params: { 
    predicate: (context: ContextManager) => boolean 
  }): ContextManager | null {
    let current: ContextManager | null = this.currentContext
    while (current) {
      if (params.predicate(current)) return current
      current = current.parent
    }
    return null
  }

  // 🎯 Получить контекст по глубине
  getContextByDepth(params: { depth: number }): ContextManager | null {
    let current: ContextManager | null = this.currentContext
    for (let i = 0; i < params.depth && current; i++) {
      current = current.parent
    }
    return current
  }

  // 🎯 Перейти к целевому контексту
  jumpToContext(params: { targetContext: ContextManager }): boolean {
    if (this.isInChain({ targetContext: params.targetContext })) {
      this.currentContext = params.targetContext
      return true
    }
    return false
  }
}