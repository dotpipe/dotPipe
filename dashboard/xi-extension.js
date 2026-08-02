(() => {
  'use strict';

  const STYLE_ID = 'domPipe-xi-extension-css';

  function applyFrontendTrace(frontend = {}) {
    const body = document.body;
    const bodyTag = frontend.bodyTag || {};
    Object.entries(bodyTag).forEach(([name, value]) => {
      if (/^(data-|aria-|class$|id$)/i.test(name)) body.setAttribute(name, String(value));
    });
    body.dataset.domPipeExtension = 'xi';
    if (typeof frontend.css === 'string' && frontend.css.trim()) {
      let style = document.getElementById(STYLE_ID);
      if (!style) { style = document.createElement('style'); style.id = STYLE_ID; style.dataset.domPipeExtension = 'xi'; document.head.appendChild(style); }
      style.textContent = frontend.css;
    }
  }

  async function sync(manifestUrl = 'xi-extension.php') {
    const response = await fetch(manifestUrl, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Extension manifest returned ${response.status}`);
    const manifest = await response.json();
    applyFrontendTrace(manifest.frontend);
    const apis = Array.isArray(manifest.apis) ? manifest.apis : [];
    const event = new CustomEvent('domPipe:api-registered', { detail: { source: manifest.source || manifestUrl, apis, frontend: manifest.frontend || {} } });
    window.dispatchEvent(event);
    return manifest;
  }

  window.DomPipeXIExtension = Object.freeze({ sync, applyFrontendTrace });
})();
