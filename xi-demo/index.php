<!doctype html>
<html lang="en" data-theme="dark" data-site-id="xi-demo"><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>XI XI Demo Site</title>
  <link rel="stylesheet" href="demo.css">
  <script src="../domPipe.js"></script>
</head>
<body>
  <main class="demo-shell">
    <header class="hero">
      <div><p class="eyebrow">XI XI / LIVE SITE</p><h1 class="">Dashboard live edit verified</h1><p class="lede">A watchable site configuration: live JSON, HTML fragments, endpoint state, and domPipe bindings.</p></div>
      <div class="hero-state"><span class="pulse"></span><span id="siteState">CONNECTING</span></div>
    </header>
    <nav class="demo-tabs" aria-label="Demo site tabs"><button class="demo-tab active" data-demo-tab="watch" type="button">Watch site</button><button class="demo-tab" data-demo-tab="pages" type="button">Pages</button><button class="demo-tab" data-demo-tab="nest" type="button">JSON Modala Nest Finder</button></nav>
    <div class="demo-tab-panel active" data-demo-panel="watch">
    <section class="metric-grid">
      <article class="metric-card"><span class="eyebrow">API STATUS</span><strong id="apiStatus">—</strong><small id="apiTimestamp">Waiting for response</small></article>
      <article class="metric-card"><span class="eyebrow">HEALTH</span><strong id="healthStatus">—</strong><small id="healthTimestamp">Waiting for response</small></article>
      <article class="metric-card"><span class="eyebrow">REQUESTS</span><strong id="requestCount">0</strong><small>poll cycles completed</small></article>
    </section>
    <section class="demo-grid">
      <article class="panel live-panel"><div class="panel-head"><div><p class="eyebrow">LIVE JSON</p><h2>API response stream</h2></div><span class="tag" id="apiCode">—</span></div><pre id="apiPayload">Waiting…</pre></article>
      <article class="panel fragment-panel"><div class="panel-head"><div><p class="eyebrow">XI FRAGMENT</p><h2 id="fragmentTitle">Waiting for fragment</h2></div><span class="tag">HTML</span></div><div id="fragmentContent" class="fragment-content">The fragment endpoint will appear here.</div></article>
    </section>
    </div>
    <section class="demo-tab-panel pages-panel" data-demo-panel="pages" hidden=""><div class="panel-head"><div><p class="eyebrow">SITE / PAGE TABS</p><h2>Registered pages</h2><p class="lede">Open each page in another browser tab. Edit in the Nest Finder, then publish and refresh the site.</p></div><span class="tag">MULTI-PAGE</span></div><div class="page-links"><a href="./" target="_blank"><strong>Watch site</strong><small>xi-demo/</small></a><a href="api/" target="_blank"><strong>API response</strong><small>api/index.php</small></a><a href="health/" target="_blank"><strong>Health endpoint</strong><small>health/index.php</small></a><a href="fragment/" target="_blank"><strong>HTML fragment</strong><small>fragment/index.php</small></a><a href="../dashboard/" target="_blank"><strong>XI XI Control Panel</strong><small>dashboard/</small></a></div></section>
    <section class="demo-tab-panel nest-finder" data-demo-panel="nest" hidden="">
      <div class="panel-head"><div><p class="eyebrow">HTML → JSON / MODALA</p><h2>Nested container finder</h2><p class="lede">Hover any real HTML container to open that nest in the editor. The structure uses domPipe’s <code>htmlToJson</code> shape.</p></div><span class="tag">WYSIWYG</span></div>
      <div class="nest-modes"><button class="nest-mode active" data-nest-mode="view" type="button">View</button><button class="nest-mode" data-nest-mode="preview" type="button">Preview</button><button class="nest-mode" data-nest-mode="json" type="button">JSON</button></div>
      <div class="nest-grid"><div><label class="eyebrow" for="nestSource">SOURCE HTML</label><textarea id="nestSource" class="nest-editor" spellcheck="false">&lt;section class="nest-sample"&gt;&lt;div class="nest-card"&gt;&lt;h3&gt;Hover this card&lt;/h3&gt;&lt;p&gt;Every nested container becomes an editable JSON nest.&lt;/p&gt;&lt;button type="button"&gt;Action&lt;/button&gt;&lt;/div&gt;&lt;/section&gt;</textarea><button id="loadNest" class="nest-button" type="button">Render HTML</button><div id="nestTrail" class="nest-trail">Hover a container to see its nest path.</div></div><div><div class="nest-mode-panel active" data-nest-panel="view"><label class="eyebrow">FLAT HTML</label><pre id="nestFlatView" class="nest-flat-view"></pre></div><div class="nest-mode-panel" data-nest-panel="preview" hidden=""><label class="eyebrow">RENDERED PREVIEW</label><div id="nestPreview" class="nest-preview"></div></div><div class="nest-mode-panel" data-nest-panel="json" hidden=""><label class="eyebrow" for="nestJson">SELECTED NEST JSON</label><textarea id="nestJson" class="nest-editor" spellcheck="false" placeholder="Hover a container…"></textarea><button id="applyNest" class="nest-button" type="button">Apply JSON to hovered nest</button></div></div></div>
      <div class="publish-bar"><span id="publishState">Draft changes are local until published.</span><button id="publishNest" class="nest-button" type="button">Publish and refresh site</button></div>
    </section>
    <footer><span>Site scope: <code>xi-demo</code></span><span>Rules: <code>.xi</code></span><a href="../dashboard/">Open XI XI Control Panel →</a></footer>
  </main>
  <script>
    (() => {
      const $ = id => document.getElementById(id); const PUBLISHED_KEY = 'xi-demo.published-html'; let cycles = 0; let hoveredNest = null;
      const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
      function jsonToHtml(node) { if (!node || typeof node !== 'object') return ''; if (node.type === 'text') return escapeHtml(node.content || ''); const tag = String(node.tagName || node.tagname || 'div').replace(/[^a-z0-9-]/gi, '') || 'div'; const attrs = Object.entries(node.attributes || {}).map(([key, value]) => ` ${key.replace(/[^a-z0-9_:-]/gi, '')}="${escapeHtml(value)}"`).join(''); return `<${tag}${attrs}>${(node.children || []).map(jsonToHtml).join('')}</${tag}>`; }
      function bindNestHover() { const preview = $('nestPreview'); preview.querySelectorAll('*').forEach(element => element.addEventListener('mouseenter', event => { event.stopPropagation(); hoveredNest = element; preview.querySelectorAll('.nest-hovered').forEach(item => item.classList.remove('nest-hovered')); element.classList.add('nest-hovered'); $('nestJson').value = JSON.stringify(window.htmlToJson ? htmlToJson(element.outerHTML) : { tagName: element.tagName.toLowerCase(), attributes: Object.fromEntries(Array.from(element.attributes).map(attr => [attr.name, attr.value])), children: [] }, null, 2); $('nestTrail').textContent = Array.from(element.parentElement?.querySelectorAll('*') || []).includes(element) ? `Hovered: ${element.tagName.toLowerCase()} · ${element.className || 'container'}` : 'Hovered container'; })); }
      function setNestMode(mode) { document.querySelectorAll('[data-nest-mode]').forEach(button => button.classList.toggle('active', button.dataset.nestMode === mode)); document.querySelectorAll('[data-nest-panel]').forEach(panel => { panel.hidden = panel.dataset.nestPanel !== mode; panel.classList.toggle('active', panel.dataset.nestPanel === mode); }); if (mode === 'view') $('nestFlatView').textContent = $('nestSource').value; }
      function renderNest() { const published = localStorage.getItem(PUBLISHED_KEY); if (published && !$('nestSource').dataset.edited) $('nestSource').value = published; $('nestFlatView').textContent = $('nestSource').value; $('nestPreview').innerHTML = $('nestSource').value; bindNestHover(); setNestMode('preview'); }
      document.querySelectorAll('[data-demo-tab]').forEach(tab => tab.addEventListener('click', () => { document.querySelectorAll('[data-demo-tab]').forEach(item => item.classList.toggle('active', item === tab)); document.querySelectorAll('[data-demo-panel]').forEach(panel => { panel.hidden = panel.dataset.demoPanel !== tab.dataset.demoTab; panel.classList.toggle('active', panel.dataset.demoPanel === tab.dataset.demoTab); }); if (tab.dataset.demoTab === 'nest') renderNest(); }));
      document.querySelectorAll('[data-nest-mode]').forEach(button => button.addEventListener('click', () => setNestMode(button.dataset.nestMode)));
      $('loadNest').addEventListener('click', () => { $('nestSource').dataset.edited = 'true'; renderNest(); }); $('nestSource').addEventListener('input', () => { $('nestSource').dataset.edited = 'true'; }); $('applyNest').addEventListener('click', () => { if (!hoveredNest) return; try { const replacement = document.createRange().createContextualFragment(jsonToHtml(JSON.parse($('nestJson').value))); hoveredNest.replaceWith(replacement); hoveredNest = null; bindNestHover(); $('nestTrail').textContent = 'Applied JSON to the hovered nest.'; } catch (error) { $('nestTrail').textContent = error.message; } }); $('publishNest').addEventListener('click', () => { localStorage.setItem(PUBLISHED_KEY, $('nestSource').value); $('publishState').textContent = 'Published. Refreshing site…'; setTimeout(() => location.reload(), 250); });
      async function poll() {
        try {
          const [apiResponse, healthResponse, fragmentResponse] = await Promise.all([fetch('api/'), fetch('health/'), fetch('fragment/')]);
          const api = await apiResponse.json(); const health = await healthResponse.json();
          $('apiStatus').textContent = api.status || 'OK'; $('apiTimestamp').textContent = api.timestamp || '—'; $('apiCode').textContent = apiResponse.status;
          $('healthStatus').textContent = health.status || 'OK'; $('healthTimestamp').textContent = health.timestamp || '—';
          $('apiPayload').textContent = JSON.stringify(api, null, 2); $('fragmentContent').innerHTML = localStorage.getItem(PUBLISHED_KEY) || await fragmentResponse.text();
          $('siteState').textContent = apiResponse.ok && healthResponse.ok ? 'LIVE / 200' : 'DEGRADED'; cycles += 1; $('requestCount').textContent = cycles;
        } catch (error) { $('siteState').textContent = 'OFFLINE'; $('apiPayload').textContent = error.message; }
      }
      poll(); setInterval(poll, 2000);
    })();
  </script>


</body></html>