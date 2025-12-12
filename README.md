Please drop me a donation at baboonxiv@gmail.com on Paypal.com.
I take Bitcoin as well!

**bc1qjt8je65vc245y2xq0cx8lfdq0cpvxt957ns2ac**

Or ETH **0x12c35f0d64cBbf3Ea250daD1C82E93902Be5198e**

Or BTC Cash: **bitcoincash:qq6qugkmnl42sm3lgymrnsdrkpgt3a24pqllt4mlsg**

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


# Custom Tags Reference

dotPipe.js defines multiple **custom elements** you can drop into HTML without writing JavaScript. Each tag is enhanced by dotPipe at runtime.

## `<pipe>`
- AJAX loader & DOM initializer. Runs automatically on DOMContentLoaded.
- Example:
```html
<pipe id="product-list" ajax="products.json" insert="container"></pipe>
```

## `<cart>` and `<item>`
- Shopping cart UI. `<cart>` holds `<item>` children.
```html
<cart id="main-cart">
  <item id="widget-1" name="Widget" price="9.99"></item>
</cart>
```

## `<dyn>`
- Auto event element, triggers pipelines on click.

## `<search>`
- Filters content or tables.

## `<csv>`
- Loads CSV into tables/cards with sorting, paging, lazy-load.

## `<tabs>`
- Tabbed navigation system.

## `<login>`
- Login/registration forms with AJAX and custom pages.

## `<checkout>`
- Checkout workflow with validation, summary.

## `<carousel>`
- Slider for content/images, supports timed auto-slide.

## `<columns>`
- Multi-column layout with remote sources.

## `<timed>`
- Auto-refresh content at intervals.

## `<refresh>`
- Refresh content manually or on interval.

## `<order-confirmation>`
- Shows order confirmation summary.

## `<lnk>`
- AJAX-enabled link element.


# Universal Attributes

Every dotPipe tag supports shared attributes for dynamic behavior.

- **id**: REQUIRED, unique identifier.
- **inline**: Pipeline string for dynamic macros.
- **ajax**: Load remote resource.
- **insert**: Target element ID for AJAX results.
- **query**: Key=value pairs for requests.
- **callback / callback-class**: JS function or grouped callback.
- **modal**: Load JSON templates/modals.
- **file / directory**: File download attributes.
- **set / get / delete**: Manipulate element attributes.
- **x-toggle**: Toggle classes.
- **tool-tip / modal-tip**: Tooltips and JSON tooltips.
- **copy / remove / display**: Content utilities.
- **headers**: Custom HTTP headers.
- **form-class / action-class**: Group forms or triggers.
- **event**: Events to bind to element.
- **sources**: File list (carousel/cards).
- **tab**: Tab configuration.
- **login-page / registration-page / css-page**: Login-specific.
- **validate**: Checkout validation mode.
- **pages / count / percents / height / width**: Columns config.
- **delay / interval / file-order / file-index / mode**: Timed + carousel attributes.
- **turn / turn-index / boxes**: Carousel rotation.
- **sort / page-size / lazy-load**: CSV options.

Each can be combined in markup to build rich behaviors.


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


# Built-in Verbs

- **log:value** → console.log
- **ajax:url:method** → fetch resource
- **modala:url:target** → fetch JSON and render
- **exc:this/var** → push element/variable into pipeline
- **nop:var** → pass value
- **call:fnName:params** → run custom/global function

You can extend dotPipe by adding new verbs to `dotPipe.verbs`.


# System Flow & Lifecycle

1. On DOMContentLoaded → `domContentLoad()` initializes custom tags.
2. `dotPipe.register()` scans elements with inline macros.
3. Inline macros parsed → `runInline(id)` executes pipelines.
4. Shells are handled by `runShellOpen`, `runShellClose`, `runShell`.
5. AJAX handled by `pipes()` and `modala()` functions.


# Component Guides

## Columns Component
- Attributes: `pages`, `count`, `percents`, `height`, `width`
- API: `columnsComponent.refreshColumn`, `updateColumnContent`, `loadColumnPage`

## Refresh Component
- `<refresh>` auto/manual reload buttons
- API: `refreshComponent.refreshTarget`, `refreshTargets`

## Checkout
- Validates and renders checkout forms.

## Carousel
- Sources, delay, boxes attributes for auto-rotating content.

## Search/CSV
- Loads CSV, supports sorting, paging, lazy loading.


# Support Classes

Classes that modify behavior of tags.

- **download**: enable file download
- **redirect**: navigate after AJAX
- **plain-text / plain-html / json / strict-json**
- **tree-view**: render JSON as tree
- **incrIndex / decrIndex**: carousel index helpers
- **modala-multi-first/last**
- **clear-node**
- **time-active / time-inactive**
- **disabled / multiple**
- **mouse / mouse-insert**
- **carousel-step-left/right / carousel-slide-left/right**


# Best Practices

- Always use unique IDs.
- Chain operators with `|`.
- Debug pipelines with `|log:!var`.
- Keep shells isolated for async tasks.
- Use callback functions for AJAX.
- Secure apps: CSP nonce auto-applied to scripts/styles.


# Examples & Recipes

## Dynamic Shopping Cart
```html
<cart id="cart">
  <item id="prod1" name="Widget" price="10"></item>
</cart>
```

## Load JSON Modal
```html
<button inline="|modala:data.json:target">Load</button>
```

## Tabs with AJAX
```html
<tabs id="mainTabs" tab="Home:home:home.html;About:about:about.html"></tabs>
```

## Auto-refresh Dashboard
```html
<refresh id="refresh1" target="stats:stats.html" interval="30">Refresh</refresh>
```

## Custom Function Call
```html
<button id="btn" inline="|&n:42|call:process:!n">Run</button>
<script>
function process(val){ alert(val); }
</script>
```

# DotPipe Inline Macro System

DotPipe is a lightweight, declarative inline-macro engine for HTML.
It allows you to manipulate the DOM, update variables, bind styles/attributes, run logic, and perform slice-indexing on class lists — all from a single `inline="..."` attribute.

No external frameworks required.

---

## ✨ Features

* **Inline variables** (`|&name:value|`, `!name`)
* **DOM bindings by id/class** (`#id.prop:val`, `.class[n].prop:val`)
* **Full index expressions** (`[n]`, `[]`, `[a,b]`, `[start:count]`, `[start:end:step]`, `[-n]`, etc.)
* **Style & class manipulation**
* **Chained operations** (`op1;op2;op3`)
* **Scoped shells** (`|+target:scopeName` / `|-scopeName`)
* **Negative indexing & clamped ranges**
* **Declarative, readable, framework-free**

---

# 1. Inline Macro Syntax

Each operation begins with a pipe (`|`) inside an element's `inline` attribute.

```html
<div inline="|operation1|operation2|..."></div>
```

Macros can declare variables, reference variables, target DOM elements, style them, update attributes, etc.

---

# 2. Variables

### Declare a variable

```
|&varname:value|
```

### Substitute a variable

```
!varname
```

### Example

```html
<div inline="|&msg:Hello World|#title.innerText:!msg"></div>
```

---

# 3. Targeting DOM Elements

DotPipe uses prefix operators for selecting DOM nodes:

| Prefix | Meaning                  |
| ------ | ------------------------ |
| `#`    | Select element by ID     |
| `.`    | Select elements by class |

Property to assign follows a dot:

```
#id.property:value
.class[n].property:value
```

---

# 4. Index Expressions

Indexes are placed in square brackets after the class name:

| Form            | Meaning                                          |
| --------------- | ------------------------------------------------ |
| `.box[0]`       | First element                                    |
| `.box[2]`       | Third element                                    |
| `.box[]`        | All elements                                     |
| `.box[0,3]`     | Elements 0 and 3                                 |
| `.box[0:3]`     | 3 items starting at index 0 → indices 0,1,2      |
| `.box[0:6:2]`   | Indices 0,2,4                                    |
| `.box[-1]`      | Last element                                     |
| `.box[-2]`      | Last two elements                                |
| `.box[-2:1]`    | 1 element starting from second-to-last           |
| `.box[-6:-1:2]` | Every 2nd element between those relative indices |

### Notes

* Negative indices are relative to the end (`-1` = last, `-2` = next-to-last).
* `[start:count]` is different from `[start:end]`:

  * `[0:2]` = 2 items → indices 0 and 1.
* Ranges are clamped to list length.

---

# 5. Supported Properties

### Content

```
innerText
innerHTML
```

### Element properties

```
value
checked
disabled
src
href
```

### Class operations

```
classList.add
classList.remove
classList.toggle
```

### Styling

```
style.<cssProperty>
```

Examples:

```
#box.style.background:red
.card[].style.color:#0af
```

---

# 6. Variable-Driven Operations

Since property values can include `!varname`:

```html
<div inline="|&c:#ff0|.highlight[].style.color:!c"></div>
```

---

# 7. Chaining Operations

Chain multiple instructions with semicolons:

```html
<div inline="|&msg:Hello|.title[0].innerText:!msg;.title[].style.color:blue"></div>
```

---

# 8. Shells (Scoped Execution)

Shells create temporary variable scopes.

### Open a shell

```
|+targetId:shellName
```

### Close a shell

```
|-shellName
```

### Example

```html
<div inline="
  |+sidebar:tick
  |&msg:Scoped
  |.note[].innerText:!msg
  |-tick
  |.note[0].innerText:Global
"></div>
```

---

# 9. Complete Examples

### Basic variable & ID assignment

```html
<div inline="|&msg:Rustic ain't it?|#status.innerText:!msg"></div>
```

### Target the second `.title`

```html
<div inline=".title[1].innerText:Hello"></div>
```

### Set style on all elements of a class

```html
<div inline=".badge[].style.color:blue"></div>
```

### Multiple, precise targets

```html
<div inline=".item[0,3,5].style.color:purple"></div>
```

### Slices & steps

```html
<div inline=".card[0:4].classList.add:featured"></div>       <!-- first four -->
<div inline=".card[1:5:2].style.border:1px solid #333"></div> <!-- indices 1,3 -->
<div inline=".card[-2].style.opacity:0.8"></div>              <!-- last two -->
```

### Mixed chain with variables

```html
<div inline="
  |&color:#0af
  |.badge[0].style.background:!color
  |.badge[2].classList.add:active
  |.badge[].style.color:white
"></div>
```

---

# 10. Attribute Binding

Attributes can be set directly:

```html
#avatar[src]:!imageURL
#panel[data-mode]:edit
```

Examples:

```html
<div inline="|&name:Sam|#card[data-user]:!name"></div>
```

---

# 11. Special Notes on Behavior

### Order matters

Later operations can override earlier ones.

### Variables are evaluated before assignment

So:

```
|&a:10|&b:!a|
```

stores `b = 10`.

### All index expressions are clamped

e.g., requesting `.card[200]` simply yields an empty set.

---

# 12. Quick Reference

```
Variables
  |&name:value|      Declare
  !name              Substitute

Targets
  #id.prop:val
  .class[n].prop:val
  .class[].prop:val
  .class[a,b].prop:val
  .class[start:count].prop:val
  .class[start:end:step].prop:val
  .class[-n].prop:val

Properties
  innerText, innerHTML
  style.<prop>
  classList.add/remove/toggle
  value, checked, disabled, src, href, etc.

Chaining
  op1;op2;op3

Shells
  |+targetId:shellName
  |-shellName
```

---

# 13. Implementation Notes

DotPipe’s inline processor (`runInline`) does the following:

1. **Extracts variables** declared with `|&name:value|`.
2. **Substitutes variables** (replacing `!name` with values).
3. **Parses DOM operations** using:

   ```
   ([#.][\w-]+)(?:\[(.*?)\])?\.(.+?):(.+)
   ```
4. **Resolves index expressions**:

   * single, multiple, empty, slice, range, step, negative
   * clamps indices to collection length
5. **Targets elements**:

   * `#id` → document.getElementById
   * `.class[...]` → elements via classQuery
6. **Assigns property**:

   * `innerText`, `innerHTML`
   * `.style.<prop>`
   * `.classList.add/remove/toggle`
   * generic property/mutation
7. **Applies chained operations** in sequence.
8. **Handles shells** by stacking and restoring dpVars.

---

# 14. Example: Everything Combined

```html
<div inline="
  |&username:Anthony
  |&color:#36f
  |.card[0].innerText:!username
  |.card[0].style.background:!color
  |.card[1,2].classList.add:highlight
  |.card[].style.color:white
  |.card[-1].style.opacity:0.75
"></div>
```