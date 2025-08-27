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
