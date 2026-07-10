// input: DOM controls in blank-text-generator.html (char select, count input, quick btns, generate btn, copy btn, analyzer)
// output: generated blank text in result textarea; detection stats in analyzer results panel
// pos: loaded with defer after clipboard.js; update when adding new character types or analyzer metrics

'use strict';

(function () {

  /* ─── Character definitions ─────────────────────────────────────────────── */
  var CHARS = {
    u2800: { char: '\u2800', name: 'Braille Pattern Blank', code: 'U+2800', visible: 'Yes' },
    u200B: { char: '\u200B', name: 'Zero Width Space',       code: 'U+200B', visible: 'No'  },
    u3164: { char: '\u3164', name: 'Hangul Filler',          code: 'U+3164', visible: 'Usually' }
  };

  var MIN_COUNT = 1;
  var MAX_COUNT = 1000;

  /* ─── DOM references (resolved after DOMContentLoaded) ─────────────────── */
  var countInput, countError, generateBtn, resultTextarea, statusEl, copyResultBtn;
  var statsCharType, statsUnicode, statsCount, statsVisible, statsGenerated;
  var analyzeInput, analyzeBtn, clearAnalyzeBtn, analyzeResults;
  var analyzeSummary, analyzeRows, charTagList;

  /* ─── Internal state ────────────────────────────────────────────────────── */
  var lastGenerated = '';   // only updated on a successful generate

  /* ─── Utility: get selected character key ───────────────────────────────── */
  function getSelectedKey() {
    var radios = document.querySelectorAll('input[name="btg-char"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return 'u2800';  // safe default
  }

  /* ─── Utility: validate count input ────────────────────────────────────── */
  // Returns a positive integer on success, or null on failure (sets error message).
  function validateCount() {
    var raw = countInput.value.trim();
    countInput.classList.remove('btg-input-error');
    countError.textContent = '';

    if (raw === '') {
      showCountError('Please enter a number of characters.');
      return null;
    }

    // Reject decimals and non-numeric strings at the raw level
    if (!/^-?\d+$/.test(raw)) {
      showCountError('Enter a whole number between 1 and 1000.');
      return null;
    }

    var n = parseInt(raw, 10);

    if (n < MIN_COUNT) {
      showCountError('Minimum is 1 character.');
      return null;
    }
    if (n > MAX_COUNT) {
      showCountError('Maximum is 1000 characters.');
      return null;
    }

    return n;
  }

  function showCountError(msg) {
    countInput.classList.add('btg-input-error');
    countError.textContent = msg;
  }

  /* ─── Generate ──────────────────────────────────────────────────────────── */
  function generate() {
    var n = validateCount();
    if (n === null) {
      setStatusError('Fix the count error above, then generate again.');
      return;
    }

    var key = getSelectedKey();
    var def = CHARS[key];
    if (!def) { return; }

    var result = def.char.repeat(n);

    // Write to result textarea (not to a variable only)
    resultTextarea.value = result;
    resultTextarea.classList.add('btg-has-content');
    lastGenerated = result;

    // Update status
    setStatusOk('Generated ' + n + ' character' + (n > 1 ? 's' : '') +
      ' using ' + def.name + ' (' + def.code + ').');

    // Update stats panel
    if (statsCharType)  statsCharType.textContent  = def.name;
    if (statsUnicode)   statsUnicode.textContent   = def.code;
    if (statsCount)     statsCount.textContent     = n;
    if (statsVisible)   statsVisible.textContent   = def.visible;
    if (statsGenerated) statsGenerated.textContent = n + ' × ' + def.code;

    // Enable copy button
    if (copyResultBtn) copyResultBtn.disabled = false;
  }

  /* ─── Copy result ───────────────────────────────────────────────────────── */
  function copyResult() {
    // Always read from textarea, not from cached lastGenerated, to capture manual edits
    var text = resultTextarea.value;
    if (!text) {
      setStatusError('Nothing to copy. Generate blank text first.');
      return;
    }

    var btn = copyResultBtn;

    // Prefer existing ClipboardManager; fall back to native API; fall back to execCommand
    if (window.clipboardManager && typeof window.clipboardManager.copyText === 'function') {
      window.clipboardManager.copyText(text, btn);
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(function () { showCopySuccess(btn); })
        .catch(function () { execCommandFallback(text, btn); });
    } else {
      execCommandFallback(text, btn);
    }
  }

  function execCommandFallback(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { /* noop */ }
    document.body.removeChild(ta);
    if (ok) {
      showCopySuccess(btn);
    } else {
      showCopyFail(btn);
    }
  }

  function showCopySuccess(btn) {
    var original = btn.getAttribute('data-original-text') || btn.textContent;
    btn.textContent = 'Copied';
    btn.classList.add('is-success');
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove('is-success');
    }, 2000);
  }

  function showCopyFail(btn) {
    var original = btn.getAttribute('data-original-text') || btn.textContent;
    btn.textContent = 'Copy failed. Select the text manually.';
    setTimeout(function () {
      btn.textContent = original;
    }, 3000);
  }

  /* ─── Status helpers ────────────────────────────────────────────────────── */
  function setStatusOk(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'btg-status';
  }

  function setStatusError(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'btg-status btg-status-error';
  }

  function setStatusEmpty() {
    if (!statusEl) return;
    statusEl.textContent = 'Ready. Choose a character and a count, then click Generate.';
    statusEl.className = 'btg-status btg-status-empty';
  }

  /* ─── Quick count buttons ───────────────────────────────────────────────── */
  function handleQuickCount(n) {
    countInput.value = n;
    countInput.classList.remove('btg-input-error');
    countError.textContent = '';
    // highlight active button
    var btns = document.querySelectorAll('.btg-quick-btn');
    btns.forEach(function (b) {
      b.classList.toggle('is-active', parseInt(b.dataset.count, 10) === n);
    });
    // auto-generate
    generate();
  }

  /* ─── Analyzer ──────────────────────────────────────────────────────────── */
  function analyze() {
    var text = analyzeInput.value;
    if (!text) {
      analyzeResults.classList.add('btg-hidden');
      return;
    }

    // Use Array.from for correct Unicode code point iteration (handles surrogate pairs)
    var codePoints = Array.from(text);
    var total = codePoints.length;

    var counts = {
      u2800: 0,   // Braille Pattern Blank
      u200B: 0,   // Zero Width Space
      u3164: 0,   // Hangul Filler
      space: 0,   // U+0020 ordinary space
      newline: 0, // U+000A line feed
      tab: 0,     // U+0009 horizontal tab
      other: 0    // everything else
    };

    var uniqueCodes = {};

    codePoints.forEach(function (cp) {
      var code = cp.codePointAt(0);
      var hex  = 'U+' + code.toString(16).toUpperCase().padStart(4, '0');
      uniqueCodes[hex] = (uniqueCodes[hex] || 0) + 1;

      switch (code) {
        case 0x2800: counts.u2800++;  break;
        case 0x200B: counts.u200B++;  break;
        case 0x3164: counts.u3164++;  break;
        case 0x0020: counts.space++;  break;
        case 0x000A: counts.newline++; break;
        case 0x0009: counts.tab++;    break;
        default:     counts.other++;  break;
      }
    });

    // Build summary
    analyzeSummary.textContent = total + ' character' + (total !== 1 ? 's' : '') + ' detected.';

    // Build rows
    var rows = [
      ['Total characters',          total],
      ['Braille Blank (U+2800)',     counts.u2800],
      ['Zero Width Space (U+200B)', counts.u200B],
      ['Hangul Filler (U+3164)',     counts.u3164],
      ['Ordinary spaces (U+0020)',  counts.space],
      ['Newlines (U+000A)',          counts.newline],
      ['Tabs (U+0009)',              counts.tab],
      ['Other characters',          counts.other]
    ];

    analyzeRows.innerHTML = '';  // safe: not user input, static strings
    rows.forEach(function (pair) {
      var row = document.createElement('div');
      row.className = 'btg-analyze-row';

      var keyEl = document.createElement('span');
      keyEl.className = 'btg-analyze-key';
      keyEl.textContent = pair[0];   // static string, safe

      var valEl = document.createElement('span');
      valEl.className = 'btg-analyze-val' + (pair[1] > 0 ? ' btg-nonzero' : '');
      valEl.textContent = pair[1];   // numeric, safe

      row.appendChild(keyEl);
      row.appendChild(valEl);
      analyzeRows.appendChild(row);
    });

    // Unique code points list
    var codeList = Object.keys(uniqueCodes);
    charTagList.innerHTML = '';  // safe: static strings only
    codeList.forEach(function (hex) {
      var tag = document.createElement('span');
      tag.className = 'btg-char-tag';
      tag.textContent = hex + ' ×' + uniqueCodes[hex];  // numeric + static prefix
      charTagList.appendChild(tag);
    });

    analyzeResults.classList.remove('btg-hidden');
  }

  function clearAnalyze() {
    analyzeInput.value = '';
    analyzeResults.classList.add('btg-hidden');
    analyzeSummary.textContent = '';
  }

  /* ─── Bind all events ────────────────────────────────────────────────────── */
  function bindEvents() {
    // Generate button
    if (generateBtn) {
      generateBtn.addEventListener('click', generate);
    }

    // Copy result button
    if (copyResultBtn) {
      copyResultBtn.addEventListener('click', copyResult);
    }

    // Count input: clear error and reset quick btn highlight on manual change
    if (countInput) {
      countInput.addEventListener('input', function () {
        countInput.classList.remove('btg-input-error');
        countError.textContent = '';
        var btns = document.querySelectorAll('.btg-quick-btn');
        btns.forEach(function (b) { b.classList.remove('is-active'); });
      });

      // Allow Enter to trigger generate
      countInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); generate(); }
      });
    }

    // Quick count buttons
    var quickBtns = document.querySelectorAll('.btg-quick-btn');
    quickBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var n = parseInt(btn.dataset.count, 10);
        if (!isNaN(n)) handleQuickCount(n);
      });
    });

    // Character radio: auto-regenerate if there is already a result
    var radios = document.querySelectorAll('input[name="btg-char"]');
    radios.forEach(function (r) {
      r.addEventListener('change', function () {
        if (resultTextarea && resultTextarea.value) generate();
      });
    });

    // Analyzer buttons
    if (analyzeBtn) analyzeBtn.addEventListener('click', analyze);
    if (clearAnalyzeBtn) clearAnalyzeBtn.addEventListener('click', clearAnalyze);
  }

  /* ─── Init ─────────────────────────────────────────────────────────────── */
  function init() {
    countInput     = document.getElementById('btg-count');
    countError     = document.getElementById('btg-count-error');
    generateBtn    = document.getElementById('btg-generate');
    resultTextarea = document.getElementById('btg-result');
    statusEl       = document.getElementById('btg-status');
    copyResultBtn  = document.getElementById('btg-copy-result');

    statsCharType  = document.getElementById('btg-stat-char-type');
    statsUnicode   = document.getElementById('btg-stat-unicode');
    statsCount     = document.getElementById('btg-stat-count');
    statsVisible   = document.getElementById('btg-stat-visible');
    statsGenerated = document.getElementById('btg-stat-generated');

    analyzeInput     = document.getElementById('btg-analyze-input');
    analyzeBtn       = document.getElementById('btg-analyze-btn');
    clearAnalyzeBtn  = document.getElementById('btg-analyze-clear');
    analyzeResults   = document.getElementById('btg-analyze-results');
    analyzeSummary   = document.getElementById('btg-analyze-summary');
    analyzeRows      = document.getElementById('btg-analyze-rows');
    charTagList      = document.getElementById('btg-char-tags');

    if (!countInput || !generateBtn || !resultTextarea) {
      // Required elements missing; abort silently (page may be offline or stripped)
      return;
    }

    setStatusEmpty();
    if (copyResultBtn) copyResultBtn.disabled = true;

    bindEvents();

    // Expose minimal public interface for E2E tests
    window.blankTextGenerator = {
      generate:    generate,
      analyze:     analyze,
      clearAnalyze: clearAnalyze,
      getResult:   function () { return resultTextarea.value; },
      CHARS:       CHARS
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
