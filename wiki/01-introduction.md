# dotPipe.js – Introduction & Setup

## What is dotPipe.js?

`dotPipe.js` is a **dynamic web component and attribute framework** that lets you build rich, interactive UIs using simple HTML tags and inline macros. Instead of writing a lot of JavaScript manually, you can use dotPipe’s **custom elements**, **universal attributes**, and **inline pipelines** to declare behaviors directly in your markup.

Think of it as a **low-code toolkit for dynamic web apps**, handling AJAX, modals, carousels, forms, shopping carts, dashboards, and more.

---

## Key Features

- **Custom tags** like `<pipe>`, `<cart>`, `<csv>`, `<tabs>`, `<columns>`, `<checkout>`, and many others.
- **Universal attributes** (`ajax`, `insert`, `callback`, `modal`, `tool-tip`, etc.) that apply to any custom element.
- **Inline macros**: embed tiny “pipelines” of logic directly into elements with the `inline` attribute.
- **Shells**: scoped pipelines for isolated execution with variable merging.
- **AJAX & JSON templates** via `modala()`.
- **Support classes** for UI behaviors (download, redirect, plain-text, tree-view, etc.).
- **Extendable**: call custom functions or register new verbs.

---

## How dotPipe.js Works

1. **On DOMContentLoaded**, the framework scans the page for custom tags and attributes.
2. Each element with `inline` is registered into the internal `dotPipe.matrix`.
3. When triggered (click, event, or manual), the element’s inline pipeline is parsed and executed.
4. Pipelines can:
   - Assign & use variables (`&x:123`, `!x`)
   - Modify the DOM (`$id.innerHTML:!var`)
   - Fetch remote data (`ajax:file.json`)
   - Call custom JS (`call:fnName:params`)
   - Run isolated shells (`|+target:shellName ... |-shellName`)

---

## Installation

Simply include the script:

```html
<script src="./dotpipe.js"></script>
```

Optionally, include your own scripts **after dotPipe.js** so you can call them via pipelines.

---

## Quickstart Example

```html
<!-- Output area -->
<div id="status"></div>

<!-- Inline macro example -->
<button id="helloBtn" inline="|&msg:Hello World|$status.innerHTML:!msg">
  Say Hello
</button>

<script>
  // Register inline elements
  dotPipe.register();

  // Bind button click manually
  document.getElementById('helloBtn').addEventListener('click', () => {
    dotPipe.runInline('helloBtn');
  });
</script>
```

When the button is clicked, dotPipe will:

1. Store `"Hello World"` in variable `msg`
2. Insert `msg` into the innerHTML of `#status`

Result → `status` div shows **Hello World**.

---

## Best Starting Point

- Always assign **unique IDs** to every custom tag and inline element.
- Keep pipelines simple at first: one or two verbs.
- Use the `log` verb (`|log:!var`) to debug pipeline values.
- Build up step by step into shells and more complex macros.
