import { Interpreter } from "./Interpeter"

function assertEqual(expected: any, actual: any, msg: string) {
  if (actual !== expected) {
    throw new Error(`❌ ${msg}: expected ${expected}, got ${actual}`)
  }
}

function testInterpreter() {
  const interpreter = new Interpreter({
    contextManager,
    contextNavigator,
    nodeHandlerCore,
    runtimeGraph
  })
  
  assertEqual(interpreter.setValue("x"), 123, "Node value")
  console.log("✅ runtimeGraph basic test passed")
}

testInterpreter()
