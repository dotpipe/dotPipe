# Shells (Scoped Pipelines)

Shells isolate pipelines for complex flows.

- `|+targetId:shellName` → open shell
- `|-shellName` → close shell

Variables inside shells do not leak until merge on close.

### Example
```html
<div id="out"></div>
<button inline="
  |+out:timer
  |&msg:inside
  |$out.innerHTML:!msg
  |-timer
">Run Shell</button>
```
