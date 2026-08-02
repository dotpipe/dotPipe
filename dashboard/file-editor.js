(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const file = new URLSearchParams(location.search).get('file') || 'xi-xi-demo/index.php';
  let editableFiles = ['xi-xi-demo/index.php', 'xi-xi-demo/api/index.php', 'xi-xi-demo/health/index.php', 'xi-xi-demo/fragment/index.php', 'landing/index.html', 'inline/index.html', 'cart/cart.html', 'tree-view/index.html'];
  let selectedElement = null;
  let baselineSource = '';
  let lastGoodSource = '';
  const jsonSuggestions = ['tagName', 'attributes', 'children', 'type', 'content', 'data-xi-fragment'];
  let autocompleteIndex = -1;
  let undoStages = [];

  function setWarning(message, code) {
    const warning = $('fileWarning');
    warning.hidden = false;
    warning.textContent = `Warning ${code}: ${message} Future use: verify the selected container before publishing.`;
  }

  function clearWarning() {
    $('fileWarning').hidden = true;
    $('fileWarning').textContent = '';
  }

  function setStatus(message, code, warning = false) {
    $('fileState').textContent = code ? `${message} [${code}]` : message;
    if (warning) setWarning(message, code || 'XI-WARN');
    else clearWarning();
  }

  function renderFileNavigator() {
    const tree = { folders: {}, files: [] };
    editableFiles.forEach(path => {
      let node = tree;
      const parts = path.split('/');
      parts.forEach((part, index) => {
        if (index === parts.length - 1) node.files.push({ name: part, path });
        else node = node.folders[part] ||= { folders: {}, files: [] };
      });
    });
    const renderNode = (parent, node, prefix = '') => {
      Object.keys(node.folders).sort().forEach(name => {
        const details = document.createElement('details');
        details.className = 'file-tree-folder';
        const folderPath = prefix ? `${prefix}/${name}` : name;
        details.open = file === folderPath || file.startsWith(`${folderPath}/`);
        const summary = document.createElement('summary');
        summary.textContent = name;
        details.appendChild(summary);
        renderNode(details, node.folders[name], folderPath);
        parent.appendChild(details);
      });
      node.files.sort((a, b) => a.name.localeCompare(b.name)).forEach(item => {
        const link = document.createElement('a');
        link.className = `file-navigator-item${item.path === file ? ' active' : ''}`;
        link.href = `file-editor.html?file=${encodeURIComponent(item.path)}`;
        link.innerHTML = `<strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.path)}</small>`;
        parent.appendChild(link);
      });
    };
    $('fileNavigator').replaceChildren();
    const treeRoot = document.createElement('div');
    treeRoot.className = 'file-tree';
    renderNode(treeRoot, tree);
    $('fileNavigator').appendChild(treeRoot);
  }

  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character])); }

  function previewSource(source) {
    const normalizedFile = file.replace(/^\/+/, '').split('/').filter(part => part && part !== '.' && part !== '..').join('/');
    const fileUrl = new URL(`../${normalizedFile}`, location.href);
    fileUrl.pathname = fileUrl.pathname.replace(/[^/]*$/, '');
    const baseTag = `<base href="${escapeHtml(fileUrl.href)}">`;
    if (/<base\b/i.test(source)) return source;
    return /<head\b[^>]*>/i.test(source) ? source.replace(/<head\b[^>]*>/i, match => `${match}${baseTag}`) : `${baseTag}${source}`;
  }

  async function fileOperation(payload) {
    const response = await fetch('file-ops.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);
    await loadFileHistory();
    return result;
  }

  async function loadFileHistory() {
    try {
      const response = await fetch('file-ops.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list-history' }) });
      const result = await response.json();
      undoStages = Array.isArray(result.items) ? result.items.slice(-20) : [];
      renderTrash();
    } catch (error) { setStatus(`File history unavailable: ${error.message}`, 'XI-HISTORY', true); }
  }

  function renderTrash() {
    const bin = $('trashBin');
    const deleted = undoStages.filter(item => item.action === 'delete');
    bin.innerHTML = deleted.length ? deleted.map(item => `<div class="trash-item"><span>${escapeHtml(item.path)}</span><button class="text-button" type="button" data-restore-trash="${escapeHtml(item.id)}">Restore</button></div>`).join('') : '<small class="file-ops-note">Trash is empty.</small>';
  }

  async function createFile() {
    const path = window.prompt('New file path', 'xi-xi-demo/new-page.html');
    if (!path) return;
    try { const result = await fileOperation({ action: 'create', path, content: '' }); if (!editableFiles.includes(path)) editableFiles.push(path); renderFileNavigator(); setStatus(`Created ${path}.`, 'XI-CREATE'); } catch (error) { setStatus(`Create failed: ${error.message}`, 'XI-CREATE', true); }
  }

  async function copyCurrentFile() {
    const suggestion = file.replace(/(\.[^./]+)$/, '-copy$1');
    const destination = window.prompt('Copy current file to', suggestion);
    if (!destination) return;
    try { await fileOperation({ action: 'copy', source: file, destination }); if (!editableFiles.includes(destination)) editableFiles.push(destination); renderFileNavigator(); setStatus(`Copied ${file} to ${destination}.`, 'XI-COPY'); } catch (error) { setStatus(`Copy failed: ${error.message}`, 'XI-COPY', true); }
  }

  async function moveCurrentFile() {
    const destination = window.prompt('Move current file to', file);
    if (!destination || destination === file) return;
    try { await fileOperation({ action: 'move', source: file, destination }); editableFiles = editableFiles.filter(path => path !== file); editableFiles.push(destination); setStatus(`Moved to ${destination}.`, 'XI-MOVE'); window.setTimeout(() => { location.href = `file-editor.html?file=${encodeURIComponent(destination)}`; }, 250); } catch (error) { setStatus(`Move failed: ${error.message}`, 'XI-MOVE', true); }
  }

  async function deleteCurrentFile() {
    if (!window.confirm(`Move ${file} to the temporary trash bin?`)) return;
    try { await fileOperation({ action: 'delete', path: file }); editableFiles = editableFiles.filter(path => path !== file); setStatus(`${file} moved to Trash.`, 'XI-TRASH'); window.setTimeout(() => { location.href = 'file-editor.html?file=xi-xi-demo%2Findex.php'; }, 250); } catch (error) { setStatus(`Delete failed: ${error.message}`, 'XI-TRASH', true); }
  }

  async function undoFileOperation(id = undoStages.at(-1)?.id) {
    if (!id) { setStatus('No file operation is available to undo.', 'XI-UNDO', true); return; }
    try { await fileOperation({ action: 'undo', id }); setStatus('Last file operation undone.', 'XI-UNDO'); location.reload(); } catch (error) { setStatus(`Undo failed: ${error.message}`, 'XI-UNDO', true); }
  }

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function zipStore(entries) {
    const chunks = [];
    const central = [];
    let offset = 0;
    const write = (size, callback) => { const bytes = new Uint8Array(size); callback(new DataView(bytes.buffer)); chunks.push(bytes); offset += size; };
    entries.forEach(entry => {
      const name = new TextEncoder().encode(entry.path);
      const data = new TextEncoder().encode(entry.content);
      const crc = crc32(data);
      const localOffset = offset;
      write(30 + name.length + data.length, view => { view.setUint32(0, 0x04034b50, true); view.setUint16(4, 20, true); view.setUint16(6, 0x800, true); view.setUint16(8, 0, true); view.setUint16(10, 0, true); view.setUint16(12, 0, true); view.setUint32(14, crc, true); view.setUint32(18, data.length, true); view.setUint32(22, data.length, true); view.setUint16(26, name.length, true); view.setUint16(28, 0, true); new Uint8Array(view.buffer).set(name, 30); new Uint8Array(view.buffer).set(data, 30 + name.length); });
      central.push({ name, crc, size: data.length, offset: localOffset });
    });
    const centralOffset = offset;
    central.forEach(item => write(46 + item.name.length, view => { view.setUint32(0, 0x02014b50, true); view.setUint16(4, 20, true); view.setUint16(6, 20, true); view.setUint16(8, 0x800, true); view.setUint16(10, 0, true); view.setUint16(12, 0, true); view.setUint16(14, 0, true); view.setUint32(16, item.crc, true); view.setUint32(20, item.size, true); view.setUint32(24, item.size, true); view.setUint16(28, item.name.length, true); view.setUint16(30, 0, true); view.setUint16(32, 0, true); view.setUint16(34, 0, true); view.setUint16(36, 0, true); view.setUint32(38, 0, true); view.setUint32(42, item.offset, true); new Uint8Array(view.buffer).set(item.name, 46); }));
    const centralSize = offset - centralOffset;
    write(22, view => { view.setUint32(0, 0x06054b50, true); view.setUint16(4, 0, true); view.setUint16(6, 0, true); view.setUint16(8, entries.length, true); view.setUint16(10, entries.length, true); view.setUint32(12, centralSize, true); view.setUint32(16, centralOffset, true); view.setUint16(20, 0, true); });
    return new Blob(chunks, { type: 'application/zip' });
  }

  async function zipPackage() {
    try {
      const entries = await Promise.all(editableFiles.map(async path => { const response = await fetch(`../${path}`); if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`); return { path, content: await response.text() }; }));
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipStore(entries));
      link.download = 'xi-xi-files.zip';
      link.click();
      URL.revokeObjectURL(link.href);
      setStatus(`Zipped ${entries.length} registered files.`, 'XI-ZIP');
    } catch (error) {
      setStatus(`ZIP could not be created: ${error.message}`, 'XI-ZIP', true);
    }
  }

  function toJson(html) {
    const source = `<div data-xi-fragment="true">${String(html ?? '')}</div>`;
    const root = new DOMParser().parseFromString(source, 'text/html').body.firstElementChild;
    const visit = node => {
      if (!node) return null;
      if (node.nodeType === 3) return { type: 'text', content: node.textContent || '' };
      if (node.nodeType !== 1) return null;
      return {
        tagName: String(node.tagName || 'div').toLowerCase(),
        attributes: Object.fromEntries(Array.from(node.attributes || []).map(attr => [attr.name, attr.value])),
        children: Array.from(node.childNodes || []).map(visit).filter(Boolean)
      };
    };
    return visit(root);
  }

  function fromJson(node) {
    if (!node || typeof node !== 'object') return '';
    if (node.type === 'text') return String(node.content || '');
    const tag = String(node.tagName || node.tagname || 'div').replace(/[^a-z0-9-]/gi, '') || 'div';
    const attrs = Object.entries(node.attributes || {}).map(([key, value]) => ` ${key}="${String(value).replace(/"/g, '&quot;')}`).join('');
    const html = (Array.isArray(node.children) ? node.children : []).map(fromJson).join('');
    return tag === 'div' && node.attributes?.['data-xi-fragment'] === 'true' ? html : `<${tag}${attrs}>${html}</${tag}>`;
  }

  function jsonCompletionContext(force = false) {
    const editor = $('jsonEditor');
    const caret = editor.selectionStart;
    const before = editor.value.slice(0, caret);
    const lineStart = before.lastIndexOf('\n') + 1;
    const line = before.slice(lineStart);
    const match = line.match(/(?:^[ \t]*|[,{][ \t]*)"([^"]*)"?$|(?:^[ \t]*|[,{][ \t]*)([A-Za-z_$][\w$-]*)?$/);
    if (!match && !force) return null;
    const prefix = match ? (match[1] ?? match[2] ?? '') : '';
    const quoted = Boolean(match && match[1] !== undefined);
    const closed = Boolean(match && match[1] !== undefined && line.endsWith('"'));
    return { prefix, quoted, closed, start: match ? lineStart + line.length - prefix.length - (closed ? 1 : 0) : caret };
  }

  function hideJsonAutocomplete() {
    const menu = $('jsonAutocomplete');
    menu.hidden = true;
    menu.replaceChildren();
    autocompleteIndex = -1;
  }

  function chooseJsonSuggestion(value, context) {
    const editor = $('jsonEditor');
    const caret = editor.selectionStart;
    const before = editor.value.slice(0, context.start);
    let after = editor.value.slice(caret);
    const existingQuotedColon = after.match(/^":\s*/);
    const existingColon = after.match(/^:\s*/);
    let insertion;
    if (existingQuotedColon) {
      insertion = context.quoted ? `${value}": ` : `"${value}": `;
      after = after.slice(existingQuotedColon[0].length);
    } else if (existingColon) {
      insertion = context.quoted ? `${value}": ` : `"${value}": `;
      after = after.slice(existingColon[0].length);
    } else {
      if (context.quoted && after.startsWith('"')) after = after.slice(1);
      insertion = context.quoted ? `${value}": ` : `"${value}": `;
    }
    editor.value = `${before}${insertion}${after}`;
    const nextCaret = before.length + insertion.length;
    editor.setSelectionRange(nextCaret, nextCaret);
    hideJsonAutocomplete();
    editor.focus();
  }

  function showJsonAutocomplete(force = false) {
    const context = jsonCompletionContext(force);
    if (!context) {
      hideJsonAutocomplete();
      return;
    }
    const values = jsonSuggestions.filter(value => value.toLowerCase().startsWith(context.prefix.toLowerCase()));
    const menu = $('jsonAutocomplete');
    menu.replaceChildren();
    if (!values.length) {
      hideJsonAutocomplete();
      return;
    }
    values.forEach((value, index) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'json-autocomplete-option';
      option.setAttribute('role', 'option');
      option.textContent = `"${value}"`;
      option.addEventListener('mousedown', event => {
        event.preventDefault();
        chooseJsonSuggestion(value, context);
      });
      menu.appendChild(option);
      if (index === autocompleteIndex) option.classList.add('active');
    });
    menu.hidden = false;
  }

  function moveJsonAutocomplete(step) {
    const options = Array.from($('jsonAutocomplete').querySelectorAll('.json-autocomplete-option'));
    if (!options.length) return;
    autocompleteIndex = (autocompleteIndex + step + options.length) % options.length;
    options.forEach((option, index) => option.classList.toggle('active', index === autocompleteIndex));
  }

  function fullPageSource() {
    const doc = $('filePreview').contentDocument;
    if (!doc?.documentElement) throw new Error('Preview document is unavailable');
    const root = doc.documentElement.cloneNode(true);
    root.querySelector('#xi-editor-style')?.remove();
    root.querySelectorAll('.xi-selected').forEach(element => element.classList.remove('xi-selected'));
    return `<!doctype html>\n${root.outerHTML}`;
  }

  function restoreLastGood(message, code) {
    selectedElement = null;
    $('sourceEditor').value = lastGoodSource || baselineSource;
    $('jsonEditor').value = JSON.stringify(toJson($('sourceEditor').value), null, 2);
    $('filePreview').srcdoc = previewSource(lastGoodSource || baselineSource);
    setStatus(message, code, true);
  }

  function selectElement(element) {
    try {
      selectedElement = element;
      $('sourceEditor').value = element.innerHTML;
      $('jsonEditor').value = JSON.stringify(toJson(element.innerHTML), null, 2);
      element.ownerDocument.querySelectorAll('.xi-selected').forEach(item => item.classList.remove('xi-selected'));
      element.classList.add('xi-selected');
      setStatus(`Selected ${String(element.tagName || 'container').toLowerCase()} · innerHTML ready`, 'XI-EDIT', true);
    } catch (error) {
      restoreLastGood(`Could not select this container: ${error.message}`, 'XI-SELECT');
    }
  }

  function bindPreview() {
    const documentRoot = $('filePreview').contentDocument;
    if (!documentRoot) return;
    let style = documentRoot.getElementById('xi-editor-style');
    if (!style) {
      style = documentRoot.createElement('style');
      style.id = 'xi-editor-style';
      style.textContent = '.xi-selected{outline:2px solid #1db7ff!important;background:#1db7ff18!important;cursor:pointer!important}';
      documentRoot.head.appendChild(style);
    }
    documentRoot.addEventListener('click', event => {
      if (event.target !== documentRoot.body) {
        event.preventDefault();
        event.stopPropagation();
        selectElement(event.target);
      }
    }, true);
  }

  async function load() {
    $('fileTitle').textContent = file;
    try {
      const response = await fetch(`../${file.replace(/^\/+/, '')}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      baselineSource = await response.text();
      lastGoodSource = baselineSource;
      $('sourceEditor').value = baselineSource;
      $('jsonEditor').value = JSON.stringify(toJson(baselineSource), null, 2);
      $('filePreview').srcdoc = previewSource(baselineSource);
      $('filePreview').addEventListener('load', bindPreview);
      setStatus('Loaded full webpage · no section selected');
    } catch (error) {
      setStatus(`Could not load ${file}: ${error.message}`, 'XI-LOAD', true);
    }
  }

  function setView(view) {
    document.querySelectorAll('[data-file-view]').forEach(tab => tab.classList.toggle('active', tab.dataset.fileView === view));
    document.querySelectorAll('[data-file-panel]').forEach(panel => { panel.hidden = panel.dataset.filePanel !== view; });
    // Preview remains the full webpage. Selecting a container only changes the editor fields.
  }

  function applySource() {
    if (!selectedElement) {
      setStatus('Select a section in Preview first; the full webpage remains visible.', 'XI-NO-SELECTION', true);
      return;
    }
    try {
      selectedElement.innerHTML = $('sourceEditor').value;
      $('jsonEditor').value = JSON.stringify(toJson(selectedElement.innerHTML), null, 2);
      lastGoodSource = fullPageSource();
      setStatus('Selected container patched; the rest of the webpage was preserved.', 'XI-PATCH');
    } catch (error) {
      restoreLastGood(`Selected HTML was not applied: ${error.message}`, 'XI-PATCH');
    }
  }

  function applyJson() {
    if (!selectedElement) {
      setStatus('Select a section in Preview first; the full webpage remains visible.', 'XI-NO-SELECTION', true);
      return;
    }
    try {
      const replacement = fromJson(JSON.parse($('jsonEditor').value));
      selectedElement.innerHTML = replacement;
      $('sourceEditor').value = selectedElement.innerHTML;
      lastGoodSource = fullPageSource();
      setStatus('Selected container patched from JSON; the rest of the webpage was preserved.', 'XI-PATCH');
    } catch (error) {
      restoreLastGood(`HTML → JSON could not be applied: ${error.message}`, 'XI-JSON');
    }
  }

  function prettifyJson() {
    const editor = $('jsonEditor');
    try {
      editor.value = JSON.stringify(JSON.parse(editor.value), null, 2);
      hideJsonAutocomplete();
      setStatus('JSON prettified; preview was not changed.', 'XI-PRETTY');
    } catch (error) {
      setStatus(`JSON cannot be prettified: ${error.message}`, 'XI-PRETTY', true);
    }
  }

  async function publish() {
    try {
      const source = fullPageSource();
      const response = await fetch('file-ops.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'write', path: file, content: source }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);
      lastGoodSource = source;
      baselineSource = source;
      setStatus(`Published ${file}; refresh the site tab to verify.`, 'XI-PUBLISH');
    } catch (error) {
      restoreLastGood(`Publish preview failed: ${error.message}`, 'XI-PUBLISH');
    }
  }

  document.querySelectorAll('[data-file-view]').forEach(tab => tab.addEventListener('click', () => setView(tab.dataset.fileView)));
  renderFileNavigator();
  $('sourceEditor').addEventListener('input', () => {
    try {
      if (selectedElement) selectedElement.innerHTML = $('sourceEditor').value;
      else $('filePreview').srcdoc = previewSource($('sourceEditor').value);
      setStatus(selectedElement ? 'Unsaved selected-container patch' : 'Unsaved full-page draft', 'XI-DRAFT', true);
    } catch (error) {
      restoreLastGood(`Draft preview failed: ${error.message}`, 'XI-DRAFT');
    }
  });
  $('applySource').addEventListener('click', applySource);
  $('applyJson').addEventListener('click', applyJson);
  $('prettifyJson').addEventListener('click', prettifyJson);
  $('zipPackage').addEventListener('click', zipPackage);
  $('newFile').addEventListener('click', createFile);
  $('copyFile').addEventListener('click', copyCurrentFile);
  $('moveFile').addEventListener('click', moveCurrentFile);
  $('deleteFile').addEventListener('click', deleteCurrentFile);
  $('undoFile').addEventListener('click', () => undoFileOperation());
  $('toggleTrash').addEventListener('click', () => { $('trashBin').hidden = !$('trashBin').hidden; });
  $('trashBin').addEventListener('click', event => { const button = event.target.closest('[data-restore-trash]'); if (button) undoFileOperation(button.dataset.restoreTrash); });
  loadFileHistory();
  $('jsonEditor').addEventListener('input', () => showJsonAutocomplete());
  $('jsonEditor').addEventListener('keydown', event => {
    const menu = $('jsonAutocomplete');
    if (event.key === 'Escape') {
      hideJsonAutocomplete();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.code === 'Space') {
      event.preventDefault();
      showJsonAutocomplete(true);
      return;
    }
    if (menu.hidden) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveJsonAutocomplete(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if (event.key === 'Enter' || event.key === 'Tab') {
      const options = menu.querySelectorAll('.json-autocomplete-option');
      const option = options[autocompleteIndex >= 0 ? autocompleteIndex : 0];
      if (option) {
        event.preventDefault();
        chooseJsonSuggestion(option.textContent.slice(1, -1), jsonCompletionContext());
      }
    }
  });
  $('jsonEditor').addEventListener('blur', () => setTimeout(hideJsonAutocomplete, 120));
  $('saveDraft').addEventListener('click', () => {
    try {
      localStorage.setItem(`xi-xi.file-draft:${file}`, fullPageSource());
      setStatus('Full webpage draft saved.', 'XI-DRAFT');
    } catch (error) {
      setStatus(`Draft could not be saved: ${error.message}`, 'XI-DRAFT', true);
    }
  });
  $('publishFile').addEventListener('click', publish);
  load();
})();
