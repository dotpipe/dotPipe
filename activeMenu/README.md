# activeMenu

`index.php` is a page shell with a narrow menu area. It loads `domPipe.js` and asks `activeMenu/draft.json` to render the collective menu into `#collective-content` with `modala`.

`getarrow.php` maps the `main` query value 1–11 to a named menu page and returns a JSON component definition. `draft.json` is the menu definition; `menu_pages/` contains page-level payloads and its own README.
