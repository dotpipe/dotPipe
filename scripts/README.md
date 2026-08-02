# scripts

`validate.mjs` is the repository check used by `npm test`. It recursively walks the checkout, runs Node syntax checks for JavaScript, and checks relative `src`, `href`, and `action` references in HTML/PHP. It does not lint PHP, execute browsers, follow `ajax` URLs, or validate remote endpoints.
