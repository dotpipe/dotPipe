# xi-demo

This is the configured local XI XI watch site. `index.php` renders the page; `api/index.php` returns live JSON; `fragment/index.php` returns replaceable HTML; and `health/index.php` returns a health payload. `demo.css` styles the site. Run from the repository root with `php -S 127.0.0.1:8787 -t .` and open `/xi-demo/`.

The page uses `xi` timers to update targets without a document reload and `.listen` telemetry to show content changes. It is a local demonstration; configure ELSN and HTTPS before using the pattern on a public site.
