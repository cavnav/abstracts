const AST = {
    "type": "Module",
    "name": "MyModule",
    "metadata": {
      "version": "1.0.0",
      "author": "User",
      "lastModified": "2025-02-10"
    },
    "imports": [
      { "name": "myVar", "from": "moduleA", "alias": "aVar" },
      { "name": "someFunction", "from": "utils" }
    ],
    "exports": [
      { "name": "calculate", "type": "Function" },
      { "name": "constants", "type": "Object" }
    ],
    "body": [
      { "type": "FunctionDeclaration" },
      { "type": "FunctionCall" },
      { "type": "Expression" },
      { "type": "Condition" },
      { "type": "Loop" },
      { "type": "ReturnStatement" },
      { "type": "Assignment" },
      { "type": "Comment" },
    ]
  }
  