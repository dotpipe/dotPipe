# domPipe runtime

## Initialization

The runtime initializes on `DOMContentLoaded` and can be re-run after dynamic insertion. It recognizes the custom elements `pipe`, `cart`, `item`, `dyn`, `search`, `csv`, `tabs`, `login`, `checkout`, `carousel`, `columns`, `timer`, `timed`, `refresh`, `order-confirmation`, `lnk`, and `csv-foreach`.

`timed` is a compatibility alias for `timer`. Active elements must have IDs. The runtime repairs missing/duplicate IDs but generated IDs should not be used as durable application identifiers.

## Attribute finishing

The recognized attribute list is defined in `DOMPIPE_ATTRIBUTE_NAMES` in `domPipe.js`. It includes request attributes (`ajax`, `insert`, `query`, `headers`, `mode`, `callback`), rendering attributes (`modal`, `style`, `append`), form/auth attributes, component options, timer options, `server`, `token`, and `idempotency-key`.

For each recognized name, the runtime mirrors `name` and `data-name`. The `data-*` spelling is the normalized runtime form: initial markup remains backwards-compatible, edits to either spelling synchronize the other, and data-only spelling is copied back for active domPipe elements. Use `domPipe.xi.attributes.get/set/remove` or `domPipe.xi.getDataAttributes()` when programming against normalized `data-*` attributes. Internal component data attributes are not indiscriminately overwritten.

## Inline macros

`domPipe.register(selector)` indexes inline elements. `domPipe.runInline(id)` executes pipe-delimited operations. The implementation supports variables (`|&name:value`), substitution (`!name`), ID/class targets (`#id.prop:value`, `.class[index].prop:value`), class slices, style/property assignment, `nop`, `log`, `ajax`, `modala`, `call`, and scoped shells (`|+target:name` / `|-name`).

The element's `dpVars` holds runtime values. Macros run when registered event handlers or application code invokes them; they are not a general-purpose background scheduler.

## JSON rendering

`modala(value, target)` accepts a JSON-like component definition. `tagname`/`tagName` selects the element (default `div`), `children` nests definitions, primitive keys become attributes, and special keys include `text`, `textContent`, `innerHTML`, `innerText`, `style`, `css`, `js`, `append`, and component data. `renderTree` supports tree output. The renderer validates supported tag names and calls domPipe initialization after inserting dynamic elements.

## Markdown and listeners

`.markdown` containers are rendered once from `data-markdown` or the existing text. The built-in parser supports headings, paragraphs, emphasis, strong, strike, links, images, lists, quotes, rules, inline code, and fenced code. Input is escaped before the supported markup is emitted.

`.listen` uses a `MutationObserver`. It emits bubbling `domPipe:listen` on the container and a second event on `window`; `event.detail` contains `element`, `html`, `text`, `changedAt`, and a source such as `initial`, `mutation`, or `xi`.

## Visual restoration classes

Use `class="viz"` when a real HTML element should retain a visible underline/interactive cue after domPipe processing. Use `class="viz-all"` when the element and all of its descendants should receive that treatment. Add `class="viz-off"` to suppress the visualization underline and interactive cursor for that element; descendants are also suppressed when the element is inside `viz-all`. The runtime adds `data-dompipe-viz="self|all|off"` for inspection. Elements carrying `ajax`/`data-ajax`, and `<lnk>` elements, also receive an accessible interactive label when visualized.

## Component index

- Columns: multiple remote pages or JSON sources with refreshable columns.
- Refresh: manual, timed, page, column, JSON, HTML, and generic target refresh.
- Checkout/cart/order confirmation: browser cart state, validation, order summary, and confirmation rendering.
- Tabs/login: tabbed remote content and login/registration UI builders.
- Search/CSV: content/table filtering, CSV loading, sorting, paging, lazy loading, table/list/card display.
- Carousel/mouse/support classes: image/content rotation, tooltips, downloads, redirects, class toggles, and response modes.
