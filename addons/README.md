# addons

This directory contains the browser-local chat example. `chat-demo.html` is the visible demo; `chat.html.js` wires the UI and exposes `window.chatAPI`; the other JavaScript files split session, queue, element, ownership, and channel concerns. `statelesschatmanager.js` keeps selected state in URL/session storage.

`get.php` and `send.php` read/write JSON session files under `addons/sessions` using a token. Treat this as a demonstration transport, not production authentication or a durable message store.
