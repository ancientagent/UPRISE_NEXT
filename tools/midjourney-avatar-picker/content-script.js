(() => {
  if (window.__midjourneyAvatarPickerLoaded) return;
  window.__midjourneyAvatarPickerLoaded = true;

  const STATE = {
    panelOpen: false,
    currentCard: null,
    rows: 2,
    cols: 4,
    outerX: 24,
    outerY: 24,
    gapX: 12,
    gapY: 12,
    selected: new Set(),
    autoFitRects: null,
    syncTimer: null,
  };

  const IDS = {
    launcher: 'mj-avatar-picker-launcher',
    hud: 'mj-avatar-picker-hud',
    modal: 'mj-avatar-picker-modal',
    grid: 'mj-avatar-picker-grid',
    preview: 'mj-avatar-picker-preview',
    presetWrap: 'mj-avatar-picker-presets',
  };

  const STYLE = `
    #${IDS.launcher} {
      position: fixed;
      right: 16px;
      top: 16px;
      z-index: 2147483600;
      border: 1px solid #111;
      background: #d8ff3e;
      color: #111;
      font: 600 13px/1.2 Arial, sans-serif;
      padding: 10px 12px;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      cursor: pointer;
    }
    .mj-avatar-picker-card-wrap {
      position: relative !important;
    }
    .mj-avatar-picker-open-btn {
      position: absolute;
      top: 8px;
      left: 8px;
      z-index: 10;
      border: 1px solid #111;
      background: rgba(216,255,62,0.94);
      color: #111;
      padding: 6px 8px;
      font: 600 11px/1 Arial, sans-serif;
      border-radius: 999px;
      cursor: pointer;
      display: none;
    }
    .mj-avatar-picker-enabled .mj-avatar-picker-open-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    #${IDS.modal} {
      position: fixed;
      inset: 0;
      z-index: 2147483640;
      background: rgba(12,12,16,0.84);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 24px;
      font-family: Arial, sans-serif;
      color: #f6f6f6;
    }
    #${IDS.modal}.is-open { display: flex; }
    .mj-avatar-picker-dialog {
      width: min(1320px, 96vw);
      height: min(92vh, 920px);
      background: #0f1117;
      border: 1px solid #3a3f52;
      border-radius: 16px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 340px;
      overflow: hidden;
      box-shadow: 0 24px 80px rgba(0,0,0,0.45);
    }
    .mj-avatar-picker-stage {
      background: #161922;
      padding: 18px;
      overflow: auto;
      position: relative;
    }
    .mj-avatar-picker-sidebar {
      border-left: 1px solid #2b3040;
      background: #11141c;
      padding: 16px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .mj-avatar-picker-title {
      font-size: 18px;
      font-weight: 700;
      margin: 0;
    }
    .mj-avatar-picker-subtle {
      font-size: 12px;
      color: #a8afc3;
      margin: 0;
      line-height: 1.4;
    }
    .mj-avatar-picker-preview-wrap {
      position: relative;
      width: fit-content;
      max-width: 100%;
      margin: 0 auto;
    }
    #${IDS.preview} {
      display: block;
      max-width: min(100%, 920px);
      max-height: calc(92vh - 120px);
      border-radius: 12px;
      border: 1px solid #2f3444;
      background: #090b10;
    }
    #${IDS.grid} {
      position: absolute;
      inset: 0;
      pointer-events: auto;
    }
    .mj-avatar-picker-cell {
      position: absolute;
      border: 1px solid rgba(216,255,62,0.58);
      background: rgba(216,255,62,0.08);
      box-sizing: border-box;
      cursor: pointer;
      transition: background 120ms ease, border-color 120ms ease, transform 120ms ease;
    }
    .mj-avatar-picker-cell:hover {
      background: rgba(216,255,62,0.16);
      border-color: rgba(216,255,62,0.9);
    }
    .mj-avatar-picker-cell.is-selected {
      background: rgba(216,255,62,0.28);
      border: 2px solid #d8ff3e;
      box-shadow: inset 0 0 0 1px #111;
    }
    .mj-avatar-picker-cell-label {
      position: absolute;
      right: 6px;
      bottom: 6px;
      font: 700 10px/1 Arial, sans-serif;
      color: #111;
      background: rgba(216,255,62,0.92);
      border-radius: 999px;
      padding: 4px 6px;
      pointer-events: none;
    }
    .mj-avatar-picker-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      border: 1px solid #2b3040;
      border-radius: 12px;
      background: #161922;
    }
    .mj-avatar-picker-group h3 {
      margin: 0;
      font-size: 13px;
      font-weight: 700;
    }
    .mj-avatar-picker-row {
      display: grid;
      grid-template-columns: 1fr 72px;
      gap: 10px;
      align-items: center;
      font-size: 12px;
    }
    .mj-avatar-picker-row input {
      width: 100%;
      background: #0f1117;
      border: 1px solid #353b4e;
      color: #fff;
      padding: 6px 8px;
      border-radius: 8px;
    }
    .mj-avatar-picker-btn-row,
    #${IDS.presetWrap} {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .mj-avatar-picker-btn {
      border: 1px solid #3d4255;
      background: #1a1f2b;
      color: #fff;
      border-radius: 10px;
      padding: 8px 10px;
      cursor: pointer;
      font: 600 12px/1 Arial, sans-serif;
    }
    .mj-avatar-picker-btn.is-primary {
      background: #d8ff3e;
      color: #111;
      border-color: #d8ff3e;
    }
    .mj-avatar-picker-btn.is-danger {
      background: #25161a;
      border-color: #7a3f4d;
      color: #ffbcc7;
    }
    .mj-avatar-picker-btn.is-quiet {
      background: #141823;
      border-color: #2e3547;
      color: #dbe1f0;
    }
    .mj-avatar-picker-code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
      color: #a8afc3;
      word-break: break-all;
    }
  `;

  function injectStyle() {
    const style = document.createElement('style');
    style.textContent = STYLE;
    document.documentElement.appendChild(style);
  }

  function getVisibleCard(cards) {
    const viewportTop = 0;
    const viewportBottom = window.innerHeight || document.documentElement.clientHeight;
    return cards
      .map((card) => ({ card, rect: card.anchor.getBoundingClientRect() }))
      .filter(({ rect }) => rect.bottom > viewportTop + 40 && rect.top < viewportBottom - 40)
      .sort((a, b) => Math.abs(a.rect.top - 120) - Math.abs(b.rect.top - 120))[0]?.card || null;
  }

  function createLauncher() {
    const btn = document.createElement('button');
    btn.id = IDS.launcher;
    btn.textContent = 'Avatar Picker';
    btn.title = 'Open the picker on the first visible Midjourney sheet';
    btn.addEventListener('click', () => {
      document.documentElement.classList.add('mj-avatar-picker-enabled');
      syncCardButtons();
      const cards = collectCards();
      const visibleCard = getVisibleCard(cards) || cards[0] || null;
      if (visibleCard) {
        openPicker(visibleCard);
      }
    });
    document.body.appendChild(btn);
  }

  function ensureModal() {
    if (document.getElementById(IDS.modal)) return;
    const modal = document.createElement('div');
    modal.id = IDS.modal;
    modal.innerHTML = `
      <div class="mj-avatar-picker-dialog">
        <div class="mj-avatar-picker-stage">
          <div class="mj-avatar-picker-preview-wrap">
            <img id="${IDS.preview}" alt="Avatar sheet preview" />
            <div id="${IDS.grid}"></div>
          </div>
        </div>
        <aside class="mj-avatar-picker-sidebar">
          <div>
            <p class="mj-avatar-picker-title">Avatar Picker</p>
            <p class="mj-avatar-picker-subtle">Pick a sheet from the current page, fine-tune the grid only if needed, then export just the avatars you want.</p>
          </div>
          <div class="mj-avatar-picker-group">
            <h3>Presets</h3>
            <div id="${IDS.presetWrap}"></div>
          </div>
          <div class="mj-avatar-picker-group" data-group="grid-controls"></div>
          <div class="mj-avatar-picker-group">
            <h3>Selection</h3>
            <p class="mj-avatar-picker-subtle" id="mj-avatar-picker-selection-count">0 tiles selected</p>
            <div class="mj-avatar-picker-btn-row">
              <button class="mj-avatar-picker-btn is-quiet" data-action="autofit">Magic Wand</button>
              <button class="mj-avatar-picker-btn" data-action="clear-selection">Clear Selection</button>
              <button class="mj-avatar-picker-btn is-primary" data-action="export">Export Selected</button>
            </div>
          </div>
          <div class="mj-avatar-picker-group">
            <h3>Source</h3>
            <div class="mj-avatar-picker-code" id="mj-avatar-picker-source"></div>
          </div>
          <div class="mj-avatar-picker-btn-row">
            <button class="mj-avatar-picker-btn is-danger" data-action="close">Close</button>
          </div>
        </aside>
      </div>`;
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
    modal.querySelector('[data-action="close"]').addEventListener('click', closeModal);
    modal.querySelector('[data-action="autofit"]').addEventListener('click', autoFitGrid);
    modal.querySelector('[data-action="clear-selection"]').addEventListener('click', () => {
      STATE.selected.clear();
      renderGrid();
      updateSelectionLabel();
    });
    modal.querySelector('[data-action="export"]').addEventListener('click', exportSelected);
    document.body.appendChild(modal);
    buildPresetButtons();
    buildControls();
  }

  function buildPresetButtons() {
    const wrap = document.getElementById(IDS.presetWrap);
    const presets = [
      ['4 x 2', 4, 2],
      ['4 x 3', 4, 3],
      ['3 x 3', 3, 3],
      ['5 x 2', 5, 2],
    ];
    wrap.innerHTML = '';
    for (const [label, cols, rows] of presets) {
      const btn = document.createElement('button');
      btn.className = 'mj-avatar-picker-btn';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        STATE.cols = cols;
        STATE.rows = rows;
        syncControlInputs();
        renderGrid();
      });
      wrap.appendChild(btn);
    }
  }

  function buildControls() {
    const container = document.querySelector('[data-group="grid-controls"]');
    const controls = [
      ['Columns', 'cols', 1, 8],
      ['Rows', 'rows', 1, 6],
      ['Outer X', 'outerX', 0, 120],
      ['Outer Y', 'outerY', 0, 120],
      ['Gap X', 'gapX', 0, 80],
      ['Gap Y', 'gapY', 0, 80],
    ];
    container.innerHTML = '<h3>Grid controls</h3>';
    for (const [label, key, min, max] of controls) {
      const row = document.createElement('label');
      row.className = 'mj-avatar-picker-row';
      row.innerHTML = `<span>${label}</span><input type="number" min="${min}" max="${max}" step="1" data-key="${key}">`;
      const input = row.querySelector('input');
      input.value = String(STATE[key]);
      input.addEventListener('input', () => {
        STATE[key] = Math.max(min, Math.min(max, Number(input.value || 0)));
        STATE.autoFitRects = null;
        renderGrid();
      });
      container.appendChild(row);
    }
  }

  function syncControlInputs() {
    document.querySelectorAll('#' + IDS.modal + ' input[data-key]').forEach((input) => {
      input.value = String(STATE[input.dataset.key]);
    });
  }

  function collectCards() {
    return Array.from(document.querySelectorAll('a[href*="/jobs/"]'))
      .map((anchor) => ({ anchor, img: anchor.querySelector('img') }))
      .filter(({ img }) => img && (img.currentSrc || img.src).includes('cdn.midjourney.com'));
  }

  function syncCardButtons() {
    const cards = collectCards();
    for (const { anchor, img } of cards) {
      const wrap = anchor.parentElement || anchor;
      wrap.classList.add('mj-avatar-picker-card-wrap');
      let btn = wrap.querySelector(':scope > .mj-avatar-picker-open-btn');
      if (!btn) {
        btn = document.createElement('button');
        btn.className = 'mj-avatar-picker-open-btn';
        btn.textContent = 'Pick avatars';
        btn.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          openPicker({ anchor, img });
        });
        wrap.appendChild(btn);
      }
      btn.dataset.src = img.currentSrc || img.src;
      btn.dataset.href = anchor.href;
    }
  }

  function queueSync() {
    clearTimeout(STATE.syncTimer);
    STATE.syncTimer = setTimeout(syncCardButtons, 150);
  }

  function guessRowsCols(img) {
    const ratio = img.naturalWidth / img.naturalHeight;
    if (ratio > 1.45) {
      return { cols: 4, rows: 2 };
    }
    return { cols: 4, rows: 3 };
  }

  function openPicker(card) {
    ensureModal();
    STATE.currentCard = {
      href: card.anchor.href,
      src: card.img.currentSrc || card.img.src,
      naturalWidth: card.img.naturalWidth,
      naturalHeight: card.img.naturalHeight,
    };
    STATE.selected = new Set();
    STATE.autoFitRects = null;
    const guessed = guessRowsCols(card.img);
    STATE.cols = guessed.cols;
    STATE.rows = guessed.rows;
    STATE.outerX = 24;
    STATE.outerY = 24;
    STATE.gapX = 12;
    STATE.gapY = 12;
    syncControlInputs();
    document.getElementById(IDS.preview).src = STATE.currentCard.src;
    document.getElementById('mj-avatar-picker-source').textContent = STATE.currentCard.href;
    document.getElementById(IDS.modal).classList.add('is-open');
    renderGrid();
    updateSelectionLabel();
  }

  function closeModal() {
    document.getElementById(IDS.modal)?.classList.remove('is-open');
  }

  function getCellRects() {
    if (STATE.autoFitRects?.length) return STATE.autoFitRects;
    const { naturalWidth, naturalHeight } = STATE.currentCard;
    const cols = Math.max(1, STATE.cols);
    const rows = Math.max(1, STATE.rows);
    const usableW = naturalWidth - STATE.outerX * 2 - STATE.gapX * (cols - 1);
    const usableH = naturalHeight - STATE.outerY * 2 - STATE.gapY * (rows - 1);
    const cellW = usableW / cols;
    const cellH = usableH / rows;
    const rects = [];
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = STATE.outerX + col * (cellW + STATE.gapX);
        const y = STATE.outerY + row * (cellH + STATE.gapY);
        rects.push({ row, col, x, y, width: cellW, height: cellH, key: `${row}:${col}` });
      }
    }
    return rects;
  }

  function renderGrid() {
    const img = document.getElementById(IDS.preview);
    const grid = document.getElementById(IDS.grid);
    if (!img || !grid || !STATE.currentCard) return;
    const displayW = img.clientWidth;
    const displayH = img.clientHeight;
    if (!displayW || !displayH) {
      img.onload = renderGrid;
      return;
    }
    grid.innerHTML = '';
    const scaleX = displayW / STATE.currentCard.naturalWidth;
    const scaleY = displayH / STATE.currentCard.naturalHeight;
    for (const rect of getCellRects()) {
      const cell = document.createElement('button');
      cell.className = 'mj-avatar-picker-cell';
      if (STATE.selected.has(rect.key)) cell.classList.add('is-selected');
      cell.style.left = `${rect.x * scaleX}px`;
      cell.style.top = `${rect.y * scaleY}px`;
      cell.style.width = `${rect.width * scaleX}px`;
      cell.style.height = `${rect.height * scaleY}px`;
      cell.dataset.key = rect.key;
      cell.title = `Row ${rect.row + 1}, Col ${rect.col + 1}`;
      cell.innerHTML = `<span class="mj-avatar-picker-cell-label">${rect.row + 1}.${rect.col + 1}</span>`;
      cell.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (STATE.selected.has(rect.key)) {
          STATE.selected.delete(rect.key);
        } else {
          STATE.selected.add(rect.key);
        }
        cell.classList.toggle('is-selected');
        updateSelectionLabel();
      });
      grid.appendChild(cell);
    }
  }

  function updateSelectionLabel() {
    const el = document.getElementById('mj-avatar-picker-selection-count');
    if (el) el.textContent = `${STATE.selected.size} tile${STATE.selected.size === 1 ? '' : 's'} selected`;
  }

  async function loadSourceImage() {
    const response = await fetch(STATE.currentCard.src, { mode: 'cors', credentials: 'omit' });
    if (!response.ok) throw new Error(`Image fetch failed: ${response.status}`);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.src = blobUrl;
    await img.decode();
    return { img, blobUrl };
  }

  function colorDistance(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
  }

  function averagePixels(samples) {
    if (samples.length === 0) return [0, 0, 0];
    const total = samples.reduce((acc, sample) => {
      acc[0] += sample[0];
      acc[1] += sample[1];
      acc[2] += sample[2];
      return acc;
    }, [0, 0, 0]);
    return total.map((value) => Math.round(value / samples.length));
  }

  function detectBackgroundColor(ctx, width, height) {
    const points = [
      [8, 8],
      [width - 8, 8],
      [8, height - 8],
      [width - 8, height - 8],
      [Math.floor(width / 2), 8],
      [Math.floor(width / 2), height - 8],
    ];
    const samples = points
      .filter(([x, y]) => x >= 0 && y >= 0 && x < width && y < height)
      .map(([x, y]) => Array.from(ctx.getImageData(x, y, 1, 1).data.slice(0, 3)));
    return averagePixels(samples);
  }

  function findContentBounds(ctx, rect, backgroundColor) {
    const left = Math.max(0, Math.floor(rect.x));
    const top = Math.max(0, Math.floor(rect.y));
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    const imageData = ctx.getImageData(left, top, width, height).data;

    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const idx = (y * width + x) * 4;
        const alpha = imageData[idx + 3];
        if (alpha < 24) continue;
        const pixel = [imageData[idx], imageData[idx + 1], imageData[idx + 2]];
        if (colorDistance(pixel, backgroundColor) <= 80) continue;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }

    if (maxX === -1 || maxY === -1) return rect;

    const padding = 10;
    return {
      ...rect,
      x: Math.max(0, left + minX - padding),
      y: Math.max(0, top + minY - padding),
      width: Math.min(rect.width, maxX - minX + 1 + padding * 2),
      height: Math.min(rect.height, maxY - minY + 1 + padding * 2),
    };
  }

  async function autoFitGrid() {
    if (!STATE.currentCard) return;
    const { img, blobUrl } = await loadSourceImage();
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const backgroundColor = detectBackgroundColor(ctx, canvas.width, canvas.height);
      STATE.autoFitRects = getCellRects().map((rect) => findContentBounds(ctx, rect, backgroundColor));
      renderGrid();
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error || new Error('Failed to read blob'));
      reader.readAsDataURL(blob);
    });
  }

  async function requestExtensionDownload(blob, filename) {
    if (!window.chrome?.runtime?.id) return false;
    const url = await blobToDataUrl(blob);
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { type: 'MJ_AVATAR_PICKER_DOWNLOAD', filename, url },
        (response) => {
          resolve(Boolean(response?.ok));
        },
      );
    });
  }

  async function downloadBlob(blob, filename) {
    if (await requestExtensionDownload(blob, filename)) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  async function exportSelected() {
    if (!STATE.currentCard || STATE.selected.size === 0) return;
    const { img, blobUrl } = await loadSourceImage();
    try {
      const url = new URL(STATE.currentCard.href);
      const jobId = url.pathname.split('/').filter(Boolean).pop() || 'job';
      const rects = getCellRects().filter((rect) => STATE.selected.has(rect.key));
      const manifest = {
        sourceHref: STATE.currentCard.href,
        sourceImage: STATE.currentCard.src,
        rows: STATE.rows,
        cols: STATE.cols,
        outerX: STATE.outerX,
        outerY: STATE.outerY,
        gapX: STATE.gapX,
        gapY: STATE.gapY,
        exportedAt: new Date().toISOString(),
        selections: [],
      };
      for (const rect of rects) {
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(rect.width);
        canvas.height = Math.round(rect.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          img,
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        const filename = `${jobId}-r${rect.row + 1}-c${rect.col + 1}.png`;
        await downloadBlob(blob, filename);
        manifest.selections.push({
          key: rect.key,
          row: rect.row,
          col: rect.col,
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          filename,
        });
      }
      const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
      await downloadBlob(manifestBlob, `${jobId}-manifest.json`);
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  }

  function initObserver() {
    const observer = new MutationObserver(queueSync);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    queueSync();
  }

  injectStyle();
  createLauncher();
  ensureModal();
  initObserver();
})();
