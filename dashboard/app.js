(() => {
  'use strict';

  const siteScope = (() => { const explicit = document.documentElement.dataset.siteId; if (explicit) return explicit; const url = new URL(location.href); return `${url.origin}${url.pathname.replace(/[^/]+$/, '')}`; })();
  const scoped = key => `${key}:${siteScope}`;
  const STORAGE_KEY = scoped('domPipe.api-workspace.v1');
  const SESSION_TOKENS_KEY = scoped('domPipe.api-session-tokens.v1');
  const AUDIT_TOKEN_KEY = scoped('domPipe.audit-dashboard-token.v1');
  const XI_CONFIG_KEY = scoped('domPipe.xi-config.v1');
  const AUDIT_KEY = scoped('domPipe.control-audit.v1');
  const SITE_REGISTRY_KEY = 'xi.xi.sites.v1';
  const THEME_KEY = 'domPipe.api-workspace.theme';
  const DEFAULT_APIS = [
    { id: 'domPipe-ping', name: 'DomPipe health check', method: 'POST', url: '../endpoint.php', headers: '{\n  "Content-Type": "application/json"\n}', body: '{\n  "command": "ping"\n}' },
    { id: 'local-json', name: 'Local JSON sample', method: 'GET', url: '../inline/data.json', headers: '{}', body: '' }
  ];

  const state = { apis: loadApis(), selectedId: null, response: { body: '', headers: '', activity: '' }, pageJson: null, pageJsonBaseline: null, pageJsonBaselineHash: '', activeResponseTab: 'body', requestStartedAt: 0 };
  const sessionTokens = loadSessionTokens();
  let surfaceElements = [];
  let selectedSurfaceElement = null;
  let selectedJsonPath = null;
  const $ = id => document.getElementById(id);

  function loadApis() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return Array.isArray(saved) && saved.length ? saved : structuredClone(DEFAULT_APIS);
    } catch { return structuredClone(DEFAULT_APIS); }
  }

  function loadSessionTokens() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_TOKENS_KEY) || '{}'); }
    catch { return {}; }
  }

  function selectedApi() { return state.apis.find(api => api.id === state.selectedId) || null; }
  function methodKind(method) { return method === 'GET' || method === 'HEAD' ? 'get' : ['POST', 'PUT', 'PATCH'].includes(method) ? 'write' : 'other'; }
  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }

  function readLocalJson(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key) || 'null'); return value ?? fallback; } catch { return fallback; } }
  function writeLocalJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function validSiteUrl(rawUrl) { try { const url = new URL(String(rawUrl || ''), location.href); if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null; return url.href; } catch { return null; } }
  function isLoopbackSite(url) { try { return ['localhost', '127.0.0.1', '::1'].includes(new URL(url).hostname); } catch { return false; } }
  function loadSites() { const saved = readLocalJson(SITE_REGISTRY_KEY, []); const sites = (Array.isArray(saved) ? saved : []).map(site => { const url = validSiteUrl(site?.url); return url ? { id: url, name: String(site?.name || url), url } : null; }).filter(Boolean); if (!sites.some(site => site.id === siteScope)) sites.unshift({ id: siteScope, name: 'Current site', url: location.href }); return sites; }
  function renderSites() { const sites = loadSites(); $('siteList').innerHTML = sites.map(site => `<button class="site-card ${site.id === siteScope ? 'active' : ''}" type="button" data-site-url="${escapeHtml(site.url)}"><strong>${escapeHtml(site.name || site.id)}</strong><small>${escapeHtml(site.id)}</small></button>`).join(''); $('siteRegistryState').textContent = `${sites.length} registered site${sites.length === 1 ? '' : 's'}`; }
  function renderWebpages() { const files = ['xi-demo/index.php', 'xi-demo/api/index.php', 'xi-demo/health/index.php', 'xi-demo/fragment/index.php', 'landing/index.html', 'inline/index.html', 'cart/cart.html', 'tree-view/index.html']; $('webpageList').innerHTML = files.map(file => `<button class="webpage-card" type="button" data-webpage="${escapeHtml(file)}"><strong>${escapeHtml(file.split('/').pop())}</strong><small>${escapeHtml(file)}</small></button>`).join(''); }
  function openSiteRegistration() { $('siteRegisterForm').hidden = false; $('siteNameInput').focus(); }
  function closeSiteRegistration() { $('siteRegisterForm').hidden = true; $('siteRegisterForm').reset(); }
  async function registerSite(event) { event.preventDefault(); const name = $('siteNameInput').value.trim(); const rawUrl = $('siteUrlInput').value.trim(); if (!name || !rawUrl) return; const url = validSiteUrl(rawUrl); if (!url) { showToast('Enter a valid HTTP(S) site URL'); return; } if (new URL(url).origin === location.origin || isLoopbackSite(url)) { try { const response = await fetch(url, { method: 'GET', mode: new URL(url).origin === location.origin ? 'same-origin' : 'no-cors', cache: 'no-store', credentials: 'same-origin' }); if (response.type !== 'opaque' && !response.ok) throw new Error(`HTTP ${response.status}`); } catch (error) { showToast(`Site path is not reachable: ${error.message}`); return; } } const sites = loadSites(); if (sites.some(site => site.url === url)) { showToast('That site is already registered'); return; } sites.push({ id: url, name, url }); writeLocalJson(SITE_REGISTRY_KEY, sites); renderSites(); addAudit('Registered site', name); closeSiteRegistration(); showToast(`${name} registered`); }
  async function openRegisteredSite(url) { const normalized = validSiteUrl(url); if (!normalized) { showToast('This registered site has an invalid URL.'); return; } if (isLoopbackSite(normalized)) { try { const response = await fetch(normalized, { method: 'GET', mode: new URL(normalized).origin === location.origin ? 'same-origin' : 'no-cors', cache: 'no-store', credentials: 'same-origin' }); if (response.type !== 'opaque' && !response.ok) throw new Error(`HTTP ${response.status}`); } catch (error) { showToast(`Site path is not reachable: ${error.message}`); return; } } const opened = window.open(normalized, '_blank', 'noopener,noreferrer'); if (!opened) showToast('The browser blocked the new site tab. Allow pop-ups for the dashboard.'); }

  function addAudit(title, detail) {
    const events = readLocalJson(AUDIT_KEY, []);
    events.unshift({ title, detail, time: new Date().toISOString() });
    writeLocalJson(AUDIT_KEY, events.slice(0, 40));
    renderAudit();
  }

  function renderEndpoints() {
    const routes = state.apis;
    $('endpointCount').textContent = `${routes.length} route${routes.length === 1 ? '' : 's'}`;
    $('endpointTable').innerHTML = routes.length ? routes.map(api => {
      const paused = api.paused === true;
      return `<div class="endpoint-row"><div><span class="endpoint-name">${escapeHtml(api.name || api.id)}</span><span class="endpoint-url">${escapeHtml(api.method)} ${escapeHtml(api.url || 'No URL')}</span></div><span class="endpoint-state ${paused ? 'paused' : ''}">${paused ? '503 PAUSED' : '200 READY'}</span><button class="endpoint-action" type="button" data-endpoint-toggle="${escapeHtml(api.id)}">${paused ? 'Resume' : 'Pause'}</button></div>`;
    }).join('') : '<div class="empty-list">No named endpoints in the registry.</div>';
  }

  function renderAudit() {
    const events = readLocalJson(AUDIT_KEY, []);
    $('auditEventCount').textContent = events.length;
    $('auditList').innerHTML = events.length ? events.map(event => `<div class="audit-entry"><time class="audit-time">${escapeHtml(new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}</time><div><span class="audit-title">${escapeHtml(event.title)}</span><span class="audit-detail">${escapeHtml(event.detail)}</span></div></div>`).join('') : '<div class="empty-list">No local control-plane events yet.</div>';
  }

  function renderAttributes() {
    const attributes = window.domPipe?.xi?.getAttributes?.() || ['server', 'token', 'idempotency-key', 'inline', 'ajax', 'insert', 'modal', 'pages', 'style', 'listen'];
    $('attributeMap').innerHTML = attributes.map(name => `<div class="attribute-row"><code>${name}="…"</code><span>data-${name}="…"</span><span class="attribute-pill">recognized</span></div>`).join('');
    renderSurfaceElements();
  }

  function getSurfaceElements() {
    const names = window.domPipe?.xi?.getAttributes?.() || [];
    return Array.from(document.querySelectorAll('*')).filter(element => names.some(name => element.hasAttribute(name) || element.hasAttribute(`data-${name}`)) || element.classList.contains('mouse'));
  }

  function renderSurfaceElements() {
    surfaceElements = getSurfaceElements();
    const select = $('surfaceElement');
    select.innerHTML = surfaceElements.length ? surfaceElements.map((element, index) => `<option value="${index}">${escapeHtml(element.tagName.toLowerCase())}${element.id ? `#${escapeHtml(element.id)}` : ''}${element.className && typeof element.className === 'string' ? `.${escapeHtml(element.className.trim().split(/\s+/).filter(Boolean).join('.'))}` : ''}</option>`).join('') : '<option value="">No managed elements found</option>';
    if (surfaceElements.length) { select.value = selectedSurfaceElement ? String(Math.max(0, surfaceElements.indexOf(selectedSurfaceElement))) : '0'; selectSurfaceElement(Number(select.value)); }
    renderSurfaceScripts();
  }

  function selectSurfaceElement(index) {
    selectedSurfaceElement = surfaceElements[index] || null; const element = selectedSurfaceElement; if (!element) return;
    $('surfaceId').value = element.id || ''; $('surfaceClass').value = element.className || ''; $('surfaceText').value = element.innerText || ''; $('surfaceHtml').value = element.innerHTML || '';
    const attributes = {}; Array.from(element.attributes).forEach(attribute => { if (attribute.name !== 'id' && attribute.name !== 'class') attributes[attribute.name] = attribute.value; }); $('surfaceAttributes').value = JSON.stringify(attributes, null, 2); $('surfaceState').textContent = `${element.tagName.toLowerCase()} selected · live, unsaved`;
  }

  function applySurfaceElement() {
    const element = selectedSurfaceElement; if (!element) return;
    try {
      const attributes = parseJson($('surfaceAttributes').value, 'Attributes'); element.id = $('surfaceId').value.trim(); element.className = $('surfaceClass').value.trim(); element.innerText = $('surfaceText').value; element.innerHTML = $('surfaceHtml').value;
      Object.keys(element.attributes).forEach(() => {}); Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
      if (window.domPipe?.xi?.inspectDocument) window.domPipe.xi.inspectDocument(document); addAudit('Live element updated', `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}`); $('surfaceState').textContent = 'Applied to live document'; showToast('Element changes applied'); renderSurfaceElements();
    } catch (error) { showToast(error.message); }
  }

  function renderSurfaceScripts() {
    const scripts = Array.from(document.scripts).map(script => script.src || 'inline script'); const apis = state.apis.map(api => `${api.method} ${api.url || api.id}`); $('surfaceScripts').innerHTML = [...scripts, ...apis].map(item => `<div class="surface-script"><code>${escapeHtml(item)}</code><span class="attribute-pill">recognized</span></div>`).join('') || '<div class="empty-list">No script or fetch definitions found.</div>';
  }

  function jsonNodeValue(path) { return path.reduce((value, key) => value?.[key], state.pageJson); }
  function jsonNodeChildren(value) { if (!value || typeof value !== 'object') return []; if (Array.isArray(value)) return value.map((child, index) => [index, child]); return Object.entries(value).filter(([key]) => ['children', 'body', 'content', 'items'].includes(key)); }
  function renderJsonTree() { const tree = $('jsonTree'); if (!state.pageJson) { tree.innerHTML = '<div class="empty-list">Load JSON to map its containers.</div>'; return; } const rows = []; const visit = (value, path, depth) => { if (Array.isArray(value)) return value.forEach((child, index) => visit(child, path.concat(index), depth)); if (!value || typeof value !== 'object') return; const tag = value.tagname || value.tag || value.type; if (tag) rows.push(`<button class="json-node ${JSON.stringify(path) === JSON.stringify(selectedJsonPath) ? 'active' : ''}" style="--depth:${depth}" data-json-path="${escapeHtml(JSON.stringify(path))}" type="button"><code>${escapeHtml(String(tag))}</code><small>${escapeHtml(value.id || value.class || value.textContent || value.text || 'container')}</small></button>`); jsonNodeChildren(value).forEach(([key, child]) => visit(child, path.concat(key), depth + 1)); }; visit(state.pageJson, [], 0); tree.innerHTML = rows.join('') || '<div class="empty-list">No nested containers found.</div>'; }
  function selectJsonNode(path) { selectedJsonPath = path; const node = jsonNodeValue(path); if (!node || typeof node !== 'object') return; $('jsonNodeEditor').hidden = false; $('jsonNodeTag').value = node.tagname || node.tag || node.type || ''; $('jsonNodeClass').value = node.class || ''; $('jsonNodeText').value = node.textContent || node.text || ''; $('jsonNodeHtml').value = node.innerHTML || ''; renderJsonTree(); }
  function applyJsonNode() { const node = jsonNodeValue(selectedJsonPath || []); if (!node || typeof node !== 'object') return; node.tagname = $('jsonNodeTag').value.trim() || node.tagname || node.tag || 'div'; node.class = $('jsonNodeClass').value.trim(); node.textContent = $('jsonNodeText').value; if ($('jsonNodeHtml').value) node.innerHTML = $('jsonNodeHtml').value; $('controlPageJson').value = JSON.stringify(state.pageJson, null, 2); addAudit('JSON container updated', JSON.stringify(selectedJsonPath)); renderJsonTree(); showToast('Nested JSON container updated'); }

  function loadXIConfig() {
    const config = readLocalJson(XI_CONFIG_KEY, {});
    Object.entries({ xiRoot: 'root', xiEntry: 'endpointEntry', xiAudit: 'auditLog', xiMaxBytes: 'maxBytes', xiClockSkew: 'clockSkewSeconds', xiAllow: 'allow', xiDeny: 'deny' }).forEach(([id, key]) => { if (config[key] !== undefined) $(id).value = config[key]; });
    if (config.allowWrites !== undefined) $('xiWrites').checked = Boolean(config.allowWrites);
    $('auditServerUrl').value = config.serverUrl || '';
    $('auditServerToken').value = '';
  }

  function saveXIConfig() {
    const config = { root: $('xiRoot').value.trim() || '.', endpointEntry: $('xiEntry').value.trim() || 'index.php', auditLog: $('xiAudit').value.trim(), maxBytes: Number($('xiMaxBytes').value) || 1048576, clockSkewSeconds: Number($('xiClockSkew').value) || 60, allowWrites: $('xiWrites').checked, allow: $('xiAllow').value, deny: $('xiDeny').value, serverUrl: $('auditServerUrl').value.trim() };
    sessionStorage.removeItem(AUDIT_TOKEN_KEY);
    writeLocalJson(XI_CONFIG_KEY, config); $('xiConfigState').textContent = `Saved ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`; $('statusMessage').textContent = 'XI configuration updated locally'; addAudit('XI config saved', `${config.endpointEntry} · ${config.allowWrites ? 'writes enabled' : 'read-only'}`); showToast('XI config saved');
  }

  function auditServerUrl() { return $('auditServerUrl').value.trim().replace(/\/$/, ''); }
  function auditServerToken() { return $('auditServerToken').value.trim(); }
  async function requestAuditServer(action, path = '', body = undefined) {
    const base = auditServerUrl();
    const token = auditServerToken();
    if (!base) throw new Error('Set the XI server URL first.');
    const url = new URL(base);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('XI server URL must use HTTP or HTTPS.');
    url.searchParams.set('action', action);
    if (path) url.searchParams.set('path', path.replace(/^\/+/, ''));
    const headers = { Accept: 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(url, { method: ['write', 'patch'].includes(action) ? 'PUT' : 'GET', credentials: 'include', headers: { ...headers, ...(body === undefined ? {} : { 'Content-Type': action === 'patch' ? 'application/json' : 'application/octet-stream' }) }, body });
    const text = await response.text();
    let data; try { data = JSON.parse(text); } catch { data = { error: text }; }
    if (!response.ok) { if (response.status === 401) { sessionStorage.removeItem(AUDIT_TOKEN_KEY); $('auditServerToken').value = ''; } throw new Error(`${response.status} ${data.error || response.statusText}`); }
    return data;
  }
  function renderAuditPrograms(programs) {
    const list = $('auditProgramList');
    if (!Array.isArray(programs) || !programs.length) { list.innerHTML = '<div class="empty-list">The server has no audited programs configured.</div>'; return; }
    list.innerHTML = programs.map(program => `<article class="audit-program"><div><strong>${escapeHtml(program.name || program.id)}</strong><small>${escapeHtml(program.id)} · ${escapeHtml(program.root || '.')}</small></div><div class="audit-program-files">${(Array.isArray(program.files) ? program.files : []).map(file => `<button class="text-button" type="button" data-remote-source="${escapeHtml(file)}">${escapeHtml(file)}</button>`).join('') || '<span class="field-hint">No source files listed</span>'}</div></article>`).join('');
  }
  async function connectAuditServer() {
    try {
      $('auditServerState').textContent = 'Connecting…';
      const manifest = await requestAuditServer('manifest');
      renderAuditPrograms(manifest.programs);
      sessionStorage.removeItem(AUDIT_TOKEN_KEY);
      $('auditServerToken').value = '';
      const assertion = manifest.siteDigest;
      $('auditServerState').textContent = `${manifest.service || 'XI'} v${manifest.version || '?'} · ${manifest.programs?.length || 0} programs · digest ${assertion?.observations || 0}/2${assertion?.trusted ? ' trusted' : ''}`;
      addAudit('Remote audit connected', `${auditServerUrl()} · ${manifest.programs?.length || 0} programs`);
      showToast('Remote audited programs loaded');
    } catch (error) { $('auditServerState').textContent = error.message; showToast(error.message); }
  }
  function decodeRemoteSource(encoded) {
    const bytes = Uint8Array.from(atob(encoded), char => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  function notifyChangeAck(receipt) { if (!receipt || receipt.status !== 'applied') return; window.dispatchEvent(new CustomEvent('domPipe:change-ack', { detail: Object.freeze({ ...receipt }) })); }

  function cloneJson(value) { return JSON.parse(JSON.stringify(value)); }
  function jsonPointerPart(value) { return String(value).replaceAll('~', '~0').replaceAll('/', '~1'); }
  function createJsonPatch(before, after, path = '') {
    if (Object.is(before, after)) return [];
    if (Array.isArray(before) || Array.isArray(after)) return [{ op: 'replace', path, value: cloneJson(after) }];
    const beforeObject = before && typeof before === 'object';
    const afterObject = after && typeof after === 'object';
    if (!beforeObject || !afterObject) return [{ op: 'replace', path, value: cloneJson(after) }];
    const operations = [];
    Object.keys(before).filter(key => !Object.prototype.hasOwnProperty.call(after, key)).sort().forEach(key => operations.push({ op: 'remove', path: `${path}/${jsonPointerPart(key)}` }));
    Object.keys(after).sort().forEach(key => {
      const childPath = `${path}/${jsonPointerPart(key)}`;
      if (!Object.prototype.hasOwnProperty.call(before, key)) operations.push({ op: 'add', path: childPath, value: cloneJson(after[key]) });
      else operations.push(...createJsonPatch(before[key], after[key], childPath));
    });
    return operations;
  }

  async function publishPageJsonPatch() {
    const path = $('remoteJsonPath').value.trim();
    if (!path) return showToast('Choose a remote JSON path first');
    if (!state.pageJsonBaseline || !state.pageJsonBaselineHash) return showToast('Load the remote JSON before publishing a patch');
    try {
      const document = parseJson($('controlPageJson').value, 'Page JSON');
      const patch = createJsonPatch(state.pageJsonBaseline, document);
      if (!patch.length) return showToast('No JSON changes to publish');
      const result = await requestAuditServer('patch', path, JSON.stringify({ baseHash: state.pageJsonBaselineHash, document, patch }));
      state.pageJson = document;
      state.pageJsonBaseline = cloneJson(document);
      state.pageJsonBaselineHash = result.jsonHash || '';
      renderJsonTree();
      notifyChangeAck(result.changeReceipt);
      addAudit('Remote JSON patch published', `${path} · ${patch.length} operation${patch.length === 1 ? '' : 's'}`);
      showToast('JSON patch applied; server returned the new full document');
    } catch (error) { showToast(`JSON patch failed: ${error.message}`); }
  }
  async function fetchRemoteSource() {
    const path = $('remoteSourcePath').value.trim();
    if (!path) return showToast('Choose a remote source path');
    try {
      const result = await requestAuditServer('read', path);
      const source = decodeRemoteSource(result.content || '');
      $('filePath').value = path.replace(/^\/+/, '');
      $('fileEditor').value = source;
      if (path.toLowerCase().endsWith('.json')) {
        try {
          state.pageJson = JSON.parse(source);
          state.pageJsonBaseline = cloneJson(state.pageJson);
          state.pageJsonBaselineHash = result.jsonHash || '';
          $('controlPageJson').value = JSON.stringify(state.pageJson, null, 2);
          $('remoteJsonPath').value = path.replace(/^\/+/, '');
          renderJsonTree();
        } catch (error) { state.pageJson = null; state.pageJsonBaseline = null; state.pageJsonBaselineHash = ''; }
      }
      $('fileEditorState').textContent = `Remote source loaded ${path}`;
      addAudit('Remote source loaded', path);
      showToast('Audited source loaded into the editor');
    } catch (error) { $('fileEditorState').textContent = error.message; showToast(error.message); }
  }
  async function publishRemoteSource() {
    const path = $('remoteSourcePath').value.trim();
    if (!path) return showToast('Choose a remote source path');
    try {
      const result = await requestAuditServer('write', path, $('fileEditor').value);
      notifyChangeAck(result.changeReceipt);
      $('fileEditorState').textContent = `Published ${path}; session rotated`;
      addAudit('Remote source published', `${path} · ${result.siteDigest?.digest || 'digest updated'}`);
      showToast('Source published and exchange token rotated');
    } catch (error) { $('fileEditorState').textContent = error.message; showToast(error.message); }
  }

  function switchControlView(view) {
    document.querySelectorAll('[data-control-view]').forEach(button => { const active = button.dataset.controlView === view; button.classList.toggle('active', active); button.setAttribute('aria-current', active ? 'page' : 'false'); });
    document.querySelectorAll('[data-control-panel]').forEach(panel => { panel.hidden = panel.dataset.controlPanel !== view; });
    if (view === 'endpoints') renderEndpoints();
    if (view === 'audit') renderAudit();
    if (view === 'attributes') renderAttributes();
    if (view === 'json') { $('controlPageJson').value = state.pageJson ? JSON.stringify(state.pageJson, null, 2) : ''; renderJsonTree(); }
  }

  function registerExternalApis(apis, source = 'extension') {
    if (!Array.isArray(apis)) return;
    apis.forEach(incoming => {
      if (!incoming || !incoming.id || !incoming.method || !incoming.url) return;
      const normalized = { headers: '{}', body: '', ...incoming, source };
      const existing = state.apis.find(api => api.id === normalized.id);
      if (existing) Object.assign(existing, normalized);
      else state.apis.push(normalized);
    });
    if (!state.selectedId && state.apis[0]) state.selectedId = state.apis[0].id;
    persist(); renderList(); renderEditor(); $('statusMessage').textContent = `${apis.length} API definition${apis.length === 1 ? '' : 's'} registered from ${source}`;
    showToast(`${apis.length} PHP API${apis.length === 1 ? '' : 's'} synced`);
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.apis));
    syncEngine();
    $('savedTimestamp').textContent = `Saved ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  function syncEngine() {
    if (!window.domPipe?.registerApis) return;
    const currentIds = new Set(state.apis.map(api => api.id));
    Array.from(window.domPipe.apiRegistry?.keys?.() || []).forEach(id => {
      if (!currentIds.has(id)) window.domPipe.removeApi(id, { persist: false, source: 'dashboard' });
    });
    window.domPipe.registerApis(state.apis, { persist: false, source: 'dashboard' });
  }

  function renderList() {
    const term = $('apiSearch').value.trim().toLowerCase();
    const visible = state.apis.filter(api => `${api.name} ${api.url} ${api.method}`.toLowerCase().includes(term));
    $('apiCount').textContent = state.apis.length;
    $('apiList').innerHTML = visible.length ? visible.map(api => `
      <button class="api-card ${api.id === state.selectedId ? 'active' : ''}" type="button" data-api-id="${escapeHtml(api.id)}">
        <span class="api-card-top"><span class="api-card-name">${escapeHtml(api.name || 'Untitled API')}</span><span class="method-label">${escapeHtml(api.method)}</span></span>
        <span class="api-card-bottom"><span>${escapeHtml(api.url || 'No URL')}</span><span class="method-dot ${methodKind(api.method)}"></span></span>
      </button>`).join('') : '<div class="empty-list">No APIs match this filter.</div>';
  }

  function renderEditor() {
    const api = selectedApi();
    if (!api) return;
    $('requestTitle').textContent = api.name || 'Untitled API';
    $('apiName').value = api.name || '';
    $('apiMethod').value = api.method || 'GET';
    $('apiUrl').value = api.url || '';
    $('apiServer').value = api.serverUrl || '';
    $('apiToken').value = sessionTokens[api.id] || '';
    $('apiIdempotency').value = api.idempotencyKey || '';
    $('apiHeaders').value = api.headers || '{}';
    $('apiBody').value = api.body || '';
    $('dirtyState').textContent = 'Saved';
    $('dirtyState').classList.remove('dirty');
  }

  function updateSelectedFromEditor() {
    const api = selectedApi();
    if (!api) return;
    api.name = $('apiName').value.trim() || 'Untitled API';
    api.method = $('apiMethod').value;
    api.url = $('apiUrl').value.trim();
    api.serverUrl = $('apiServer').value.trim();
    api.idempotencyKey = $('apiIdempotency').value.trim();
    sessionTokens[api.id] = $('apiToken').value;
    sessionStorage.setItem(SESSION_TOKENS_KEY, JSON.stringify(sessionTokens));
    api.headers = $('apiHeaders').value;
    api.body = $('apiBody').value;
    $('requestTitle').textContent = api.name;
    $('dirtyState').textContent = 'Unsaved changes';
    $('dirtyState').classList.add('dirty');
    renderList();
  }

  function createApi(copy = false) {
    const source = copy && selectedApi() ? selectedApi() : { name: 'New API', method: 'GET', url: '', headers: '{}', body: '' };
    const api = { ...source, id: `api-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: copy ? `${source.name} copy` : source.name };
    state.apis.push(api); state.selectedId = api.id; persist(); renderList(); renderEditor();
    $('apiName').focus(); showToast(copy ? 'API duplicated' : 'New API created');
  }

  function saveApi() {
    updateSelectedFromEditor();
    const api = selectedApi();
    if (!api.url) { showToast('Add a request URL before saving'); $('apiUrl').focus(); return; }
    persist(); $('dirtyState').textContent = 'Saved'; $('dirtyState').classList.remove('dirty'); showToast('API definition saved locally');
  }

  function deleteApi() {
    if (state.apis.length === 1) { showToast('Keep at least one API in the registry'); return; }
    const api = selectedApi();
    if (!api || !window.confirm(`Delete “${api.name}”?`)) return;
    state.apis = state.apis.filter(item => item.id !== api.id); state.selectedId = state.apis[0].id; persist(); renderList(); renderEditor(); showToast('API removed');
  }

  function parseJson(text, label) {
    try { return text.trim() ? JSON.parse(text) : {}; }
    catch (error) { throw new Error(`${label} must be valid JSON: ${error.message}`); }
  }

  function formatJsonField(id, label) {
    try { $(id).value = JSON.stringify(parseJson($(id).value, label), null, 2); updateSelectedFromEditor(); }
    catch (error) { showToast(error.message); }
  }

  async function sendRequest(event) {
    event?.preventDefault();
    const api = selectedApi();
    if (!api) return;
    updateSelectedFromEditor();
    if (!api.url) { showToast('Add a request URL first'); return; }
    let headers;
    try { headers = parseJson(api.headers, 'Headers'); }
    catch (error) { showToast(error.message); return; }
    const method = api.method || 'GET';
    const options = { method, headers };
    if (!['GET', 'HEAD'].includes(method) && api.body.trim()) {
      try { options.body = JSON.stringify(parseJson(api.body, 'Body')); if (!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/json'; }
      catch (error) { showToast(error.message); return; }
    }
    $('sendRequest').disabled = true; $('responseStatus').textContent = 'Sending…'; $('responseStatus').classList.remove('error'); $('statusMessage').textContent = `Sending ${method} request`; state.requestStartedAt = performance.now();
    try {
      const requestUrl = api.serverUrl ? new URL(api.url, `${api.serverUrl.replace(/\/$/, '')}/`).toString() : api.url;
      const token = sessionTokens[api.id] || '';
      if (token && !options.headers.Authorization && !options.headers.authorization) options.headers.Authorization = `Bearer ${token}`;
      if (!options.headers['Idempotency-Key'] && !options.headers['idempotency-key']) options.headers['Idempotency-Key'] = api.idempotencyKey || `domPipe-${api.id}`;
      const response = await fetch(requestUrl, options);
      const text = await response.text();
      const elapsed = Math.round(performance.now() - state.requestStartedAt);
      let body = text;
      try {
        const parsed = JSON.parse(text);
        body = JSON.stringify(parsed, null, 2);
        if (parsed && typeof parsed === 'object') { state.pageJson = parsed; renderJsonTree(); }
      } catch { /* preserve non-JSON responses */ }
      state.response = { body, headers: Array.from(response.headers.entries()).map(([key, value]) => `${key}: ${value}`).join('\n') || 'No response headers', activity: `${new Date().toLocaleTimeString()}  ${method} ${api.url}  ${response.status} ${response.statusText}` };
      $('responseStatus').textContent = `${response.status} ${response.statusText}`; $('responseStatus').classList.toggle('error', !response.ok); $('responseTiming').textContent = `${elapsed} ms`; $('statusMessage').textContent = response.ok ? 'Request completed' : 'Request returned an error'; renderResponse();
      addAudit(`${method} ${response.status}`, api.url);
    } catch (error) {
      state.response = { body: `Request failed\n\n${error.message}`, headers: '', activity: `${new Date().toLocaleTimeString()}  ${method} ${api.url}  NETWORK ERROR` };
      $('responseStatus').textContent = 'Network error'; $('responseStatus').classList.add('error'); $('responseTiming').textContent = 'Request failed'; $('statusMessage').textContent = 'Could not reach endpoint'; renderResponse();
      addAudit('Request failed', `${method} ${api.url}`);
    } finally { $('sendRequest').disabled = false; }
  }

  function renderResponse() {
    if (state.activeResponseTab === 'page') { renderPagePreview(); return; }
    const content = state.response[state.activeResponseTab] || 'No data';
    $('responseViewer').innerHTML = `<pre class="response-code">${escapeHtml(content)}</pre>`;
    document.querySelectorAll('[data-response-tab]').forEach(tab => { const active = tab.dataset.responseTab === state.activeResponseTab; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); });
  }

  function renderPagePreview() {
    const viewer = $('responseViewer');
    viewer.innerHTML = '';
    if (!state.pageJson) {
      viewer.innerHTML = '<div class="empty-response"><div class="empty-icon">▣</div><h3>No page JSON loaded</h3><p>Use “Load page JSON” or send a JSON API response, then open this Page tab.</p></div>';
      return;
    }
    const definition = state.pageJson.body && typeof state.pageJson.body === 'object' ? state.pageJson.body : state.pageJson;
    const preview = document.createElement('div');
    preview.className = 'page-preview';
    viewer.appendChild(preview);
    if (state.pageJson.frontend && window.DomPipeXIExtension) window.DomPipeXIExtension.applyFrontendTrace(state.pageJson.frontend);
    if (typeof window.modala === 'function') window.modala(definition, preview);
    else preview.innerHTML = `<pre class="response-code">${escapeHtml(JSON.stringify(state.pageJson, null, 2))}</pre>`;
  }

  function loadPageJson(event) {
    const file = event.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        state.pageJson = JSON.parse(reader.result); renderJsonTree();
        state.activeResponseTab = 'page';
        renderResponse();
        $('statusMessage').textContent = `Page JSON loaded from ${file.name}`;
        showToast('JSON page component loaded');
      } catch (error) { showToast(`Page JSON failed: ${error.message}`); }
      event.target.value = '';
    };
    reader.readAsText(file);
  }

  function exportApis() {
    const blob = new Blob([JSON.stringify(state.apis, null, 2)], { type: 'application/json' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'domPipe-apis.json'; link.click(); URL.revokeObjectURL(link.href); showToast('API registry exported');
  }

  function importApis(event) {
    const file = event.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { try { const imported = JSON.parse(reader.result); if (!Array.isArray(imported) || imported.some(api => !api.id || !api.name || !api.method)) throw new Error('Expected an array of API definitions.'); state.apis = imported; state.selectedId = imported[0].id; persist(); renderList(); renderEditor(); showToast(`${imported.length} APIs imported`); } catch (error) { showToast(`Import failed: ${error.message}`); } event.target.value = ''; };
    reader.readAsText(file);
  }

  function showToast(message) { const toast = $('toast'); toast.textContent = message; toast.classList.add('visible'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('visible'), 2500); }

  function openRemoteConsole() { $('remoteConsoleModal').showModal(); $('sshConsoleState').textContent = 'Not connected'; $('sshConsoleOutput').textContent = 'Broker is not connected.'; $('sshBrokerToken').focus(); }
  function closeRemoteConsole() { $('remoteConsoleModal').close(); }
  function sshBrokerUrl() { const value = $('sshBrokerUrl').value.trim().replace(/\/$/, ''); if (!/^https?:\/\//i.test(value)) throw new Error('Broker URL must use HTTP(S).'); return value; }
  function sshCommand() { const operation = $('sshOperation').value; if (operation === 'get') { const remotePath = $('sshRemotePath').value.trim(); if (!remotePath || remotePath.length > 512 || /[\0\r\n]/.test(remotePath)) throw new Error('Enter a valid remote file path.'); return `get ${remotePath}`; } if (operation === 'install') { const packageName = $('sshPackage').value.trim(); if (!/^[A-Za-z0-9][A-Za-z0-9._+:-]{0,127}$/.test(packageName)) throw new Error('Enter a valid allowlisted package name.'); return `install ${packageName}`; } return operation; }
  async function loadSshProfiles() { const response = await fetch(`${sshBrokerUrl()}/profiles`, { headers: { 'X-XI-Local-Token': $('sshBrokerToken').value.trim() }, cache: 'no-store' }); const result = await response.json().catch(() => ({})); if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`); const select = $('sshSite'); select.replaceChildren(...(Array.isArray(result.sites) ? result.sites : []).map(site => { const option = document.createElement('option'); option.value = site.id; option.textContent = `${site.name} · allow: ${(site.allow || []).join(', ')}`; return option; })); if (!select.options.length) { const option = document.createElement('option'); option.value = 'default'; option.textContent = 'Default site'; select.appendChild(option); } }
  async function testSshBroker() { try { const url = `${sshBrokerUrl()}/health`; const response = await fetch(url, { headers: { 'X-XI-Local-Token': $('sshBrokerToken').value.trim() }, cache: 'no-store' }); const result = await response.json().catch(() => ({})); if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`); await loadSshProfiles(); $('sshConsoleState').textContent = 'Broker connected'; $('sshConsoleOutput').textContent = JSON.stringify(result, null, 2); } catch (error) { $('sshConsoleState').textContent = error.message; $('sshConsoleOutput').textContent = `SSH broker error: ${error.message}`; } }
  async function runSshOperation() { try { const response = await fetch(`${sshBrokerUrl()}/run`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-XI-Local-Token': $('sshBrokerToken').value.trim() }, body: JSON.stringify({ site: $('sshSite').value, command: sshCommand() }), cache: 'no-store' }); const result = await response.json().catch(() => ({})); if (!response.ok) throw new Error(result.error || result.stderr || `HTTP ${response.status}`); $('sshConsoleState').textContent = `Completed ${$('sshOperation').value} on ${result.site || $('sshSite').value}`; $('sshConsoleOutput').textContent = result.stdout || '(no output)'; addAudit('SSH operation completed', `${result.site || $('sshSite').value} · ${$('sshOperation').value}`); } catch (error) { $('sshConsoleState').textContent = error.message; $('sshConsoleOutput').textContent = `SSH operation failed: ${error.message}`; } }

  function togglePanelMinimize() { const shell = document.querySelector('.workspace-shell'); const minimized = shell.classList.toggle('panel-minimized'); $('minimizePanel').setAttribute('aria-pressed', String(minimized)); $('minimizePanel').setAttribute('aria-label', minimized ? 'Restore' : 'Minimize'); }
  function closePanel() { if (window.opener) window.close(); else window.location.href = '../xi-demo/'; }

  function resetApi() { renderEditor(); showToast('Unsaved changes discarded'); }

  async function loadFileEditor() { const path = $('filePath').value.trim(); if (!path) return; try { const response = await fetch(`../${path.replace(/^\/+/, '')}`); if (!response.ok) throw new Error(`File returned ${response.status}`); $('fileEditor').value = await response.text(); $('fileEditorState').textContent = `Loaded ${path}`; addAudit('File loaded', path); } catch (error) { $('fileEditorState').textContent = error.message; showToast(error.message); } }
  function saveFileDraft() { const path = $('filePath').value.trim(); if (!path) return; writeLocalJson(scoped(`domPipe.file-draft:${path}`), $('fileEditor').value); $('fileEditorState').textContent = `Draft saved ${new Date().toLocaleTimeString()}`; addAudit('File draft saved', path); showToast('File draft saved locally'); }
  async function stageFile() { const path = $('filePath').value.trim(); if (!path) return; const filename = path.split('/').pop() || 'replacement.txt'; const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([$('fileEditor').value], { type: 'text/plain' })); link.download = filename; link.click(); URL.revokeObjectURL(link.href); await navigator.clipboard?.writeText(`xi -e /${path} ${filename}`); $('fileEditorState').textContent = 'Replacement downloaded; xi command copied'; showToast('Replacement file downloaded'); }

  function runXICommand() {
    const raw = $('xiCommand').value.trim(); if (!raw) return; const args = raw.replace(/^(?:xi|xi)\s*/i, '').match(/"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|\S+/g)?.map(value => value.replace(/^['"]|['"]$/g, '')) || []; const command = args.shift()?.toLowerCase(); let output;
    if (command === 'help') output = ['xi status', 'xi list', 'xi inspect', 'xi get <api-id>', 'xi pause <api-id>', 'xi resume <api-id>', 'xi set <api-id> <name|method|url> <value>'].join('\n');
    else if (command === 'status') output = JSON.stringify({ site: siteScope, apis: state.apis.length, paused: state.apis.filter(api => api.paused).map(api => api.id), attributes: window.domPipe?.xi?.getAttributes?.().length || 0 }, null, 2);
    else if (command === 'list') output = state.apis.map(api => `${api.paused ? '503 PAUSED' : '200 READY'}  ${api.id}  ${api.method} ${api.url}`).join('\n') || 'No API definitions.';
    else if (command === 'inspect') output = JSON.stringify(window.domPipe?.xi?.inspectDocument?.(document) || [], null, 2);
    else if (command === 'get') { const api = state.apis.find(item => item.id === args[0]); output = api ? JSON.stringify(api, null, 2) : `Unknown API: ${args[0] || ''}`; }
    else if (command === 'pause' || command === 'resume') { const api = state.apis.find(item => item.id === args[0]); if (!api) output = `Unknown API: ${args[0] || ''}`; else { api.paused = command === 'pause'; persist(); renderEndpoints(); addAudit(`${api.paused ? 'Paused' : 'Resumed'} endpoint`, api.id); output = `${api.paused ? '503 PAUSED' : '200 READY'} ${api.id}`; } }
    else if (command === 'set') { const api = state.apis.find(item => item.id === args[0]); const field = args[1]; const value = args.slice(2).join(' '); if (!api || !['name', 'method', 'url'].includes(field)) output = 'Usage: xi set <api-id> <name|method|url> <value>'; else { api[field] = field === 'method' ? value.toUpperCase() : value; persist(); renderList(); renderEditor(); output = `Updated ${api.id}.${field}`; } }
    else output = `Unknown command: ${command || '(empty)'}. Type “xi help”.`;
    $('xiOutput').textContent = output; $('xiCommand').select();
  }

  function init() {
    state.selectedId = state.apis[0]?.id || null;
    const theme = localStorage.getItem(THEME_KEY) || 'dark'; document.documentElement.dataset.theme = theme;
    $('connectionLabel').textContent = `Site scope · ${siteScope}`;
    loadXIConfig(); renderSites(); renderWebpages(); renderList(); renderEditor(); renderEndpoints(); renderAudit(); renderAttributes(); renderJsonTree(); syncEngine();
    $('minimizePanel').addEventListener('click', togglePanelMinimize); $('closePanel').addEventListener('click', closePanel);
    $('openRemoteConsole').addEventListener('click', openRemoteConsole); $('testSshBroker').addEventListener('click', testSshBroker); $('runSshOperation').addEventListener('click', runSshOperation); $('sshOperation').addEventListener('change', () => { const operation = $('sshOperation').value; $('sshPathField').hidden = operation !== 'get'; $('sshPackageField').hidden = operation !== 'install'; }); $('remoteConsoleForm').addEventListener('submit', event => { if (event.submitter?.value === 'cancel') closeRemoteConsole(); });
    window.addEventListener('storage', event => {
      if (event.key !== STORAGE_KEY) return;
      state.apis = loadApis();
      if (!state.apis.some(api => api.id === state.selectedId)) state.selectedId = state.apis[0]?.id || null;
      renderList(); renderEditor(); $('statusMessage').textContent = 'API registry replaced from another workspace';
    });
    window.addEventListener('domPipe:api-registered', event => registerExternalApis(event.detail?.apis, event.detail?.source));
    document.querySelectorAll('[data-control-view]').forEach(button => button.addEventListener('click', () => switchControlView(button.dataset.controlView)));
    $('siteList').addEventListener('click', event => { const card = event.target.closest('[data-site-url]'); if (card?.dataset.siteUrl && card.dataset.siteUrl !== location.href) openRegisteredSite(card.dataset.siteUrl); }); $('siteRegisterForm').addEventListener('submit', registerSite); $('newSite').addEventListener('click', openSiteRegistration); $('cancelSiteRegistration').addEventListener('click', closeSiteRegistration);
    $('webpageList').addEventListener('click', event => { const card = event.target.closest('[data-webpage]'); if (card) window.open(`file-editor.html?file=${encodeURIComponent(card.dataset.webpage)}`, '_blank', 'noopener'); });
    $('endpointTable').addEventListener('click', event => { const button = event.target.closest('[data-endpoint-toggle]'); if (!button) return; const api = state.apis.find(item => item.id === button.dataset.endpointToggle); if (!api) return; api.paused = !api.paused; persist(); renderEndpoints(); addAudit(`${api.paused ? 'Paused' : 'Resumed'} endpoint`, api.name || api.id); showToast(`${api.paused ? 'Paused' : 'Resumed'} ${api.name || api.id}`); });
    $('surfaceElement').addEventListener('change', event => selectSurfaceElement(Number(event.target.value))); $('refreshSurface').addEventListener('click', renderSurfaceElements); $('applySurface').addEventListener('click', applySurfaceElement);
    $('loadFile').addEventListener('click', loadFileEditor); $('saveFileDraft').addEventListener('click', saveFileDraft); $('stageFile').addEventListener('click', stageFile); $('fetchRemoteSource').addEventListener('click', fetchRemoteSource); $('publishRemoteSource').addEventListener('click', publishRemoteSource); $('connectAuditServer').addEventListener('click', connectAuditServer); $('auditProgramList').addEventListener('click', event => { const button = event.target.closest('[data-remote-source]'); if (!button) return; $('remoteSourcePath').value = button.dataset.remoteSource; fetchRemoteSource(); });
    $('saveXIConfig').addEventListener('click', saveXIConfig); $('publishPageJsonPatch').addEventListener('click', publishPageJsonPatch); $('clearAudit').addEventListener('click', () => { writeLocalJson(AUDIT_KEY, []); renderAudit(); showToast('Local audit cleared'); });
    $('runXI').addEventListener('click', runXICommand); $('xiCommand').addEventListener('keydown', event => { if (event.key === 'Enter') runXICommand(); });
    $('previewControlJson').addEventListener('click', () => { try { state.pageJson = parseJson($('controlPageJson').value, 'Page JSON'); state.activeResponseTab = 'page'; switchControlView('apis'); renderResponse(); addAudit('Page preview rendered', 'JSON component editor'); showToast('Page preview loaded'); } catch (error) { showToast(error.message); } });
    $('jsonTree').addEventListener('click', event => { const node = event.target.closest('[data-json-path]'); if (node) selectJsonNode(JSON.parse(node.dataset.jsonPath)); }); $('applyJsonNode').addEventListener('click', applyJsonNode);
    $('apiList').addEventListener('click', event => { const card = event.target.closest('[data-api-id]'); if (!card) return; state.selectedId = card.dataset.apiId; renderList(); renderEditor(); });
    $('apiSearch').addEventListener('input', renderList);
    ['apiName', 'apiMethod', 'apiUrl', 'apiServer', 'apiToken', 'apiIdempotency', 'apiHeaders', 'apiBody'].forEach(id => $(id).addEventListener('input', updateSelectedFromEditor));
    $('requestForm').addEventListener('submit', sendRequest); $('newApi').addEventListener('click', () => createApi()); $('duplicateApi').addEventListener('click', () => createApi(true)); $('saveApi').addEventListener('click', saveApi); $('deleteApi').addEventListener('click', deleteApi); $('resetApi').addEventListener('click', resetApi); $('formatHeaders').addEventListener('click', () => formatJsonField('apiHeaders', 'Headers')); $('exportApis').addEventListener('click', exportApis); $('importApis').addEventListener('change', importApis); $('loadPageJson').addEventListener('change', loadPageJson); $('syncExtensions').addEventListener('click', async () => { try { $('statusMessage').textContent = 'Syncing background PHP APIs…'; await window.DomPipeXIExtension.sync(); } catch (error) { $('statusMessage').textContent = 'PHP API sync failed'; showToast(error.message); } }); $('copyResponse').addEventListener('click', () => navigator.clipboard?.writeText(state.response[state.activeResponseTab] || '').then(() => showToast('Response copied'))); $('themeToggle').addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; localStorage.setItem(THEME_KEY, next); });
    document.querySelectorAll('[data-response-tab]').forEach(tab => tab.addEventListener('click', () => { state.activeResponseTab = tab.dataset.responseTab; renderResponse(); }));
    document.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') sendRequest(event); });
  }

  window.domPipeApiWorkspace = Object.freeze({ registerApis: registerExternalApis, loadPageJson: json => { state.pageJson = json; state.activeResponseTab = 'page'; renderJsonTree(); renderResponse(); } });

  document.addEventListener('DOMContentLoaded', init);
})();
