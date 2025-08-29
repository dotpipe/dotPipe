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
