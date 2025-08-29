# Inline Macros & Pipelines

Inline macros are defined with the `inline` attribute.

## Syntax

- `|verb:param1:param2` → call verb with params
- `&var:value` → store variable
- `!var` → use variable
- `nop:var` → store last result
- `$id.innerHTML:!var` → bind to DOM
- `#var:id.prop` → read from element
- `@id.prop:var` → reference property
- `%func:[args]` → call JS function
- `call:fnName:params` → invoke function

## Example
```html
<div id="example" inline="|&msg:Hello|$output.innerHTML:!msg"></div>
<div id="output"></div>
```
