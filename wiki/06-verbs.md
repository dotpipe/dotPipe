# Built-in Verbs

- **log:value** → console.log
- **ajax:url:method** → fetch resource
- **modala:url:target** → fetch JSON and render
- **exc:this/var** → push element/variable into pipeline
- **nop:var** → pass value
- **call:fnName:params** → run custom/global function

You can extend dotPipe by adding new verbs to `dotPipe.verbs`.
