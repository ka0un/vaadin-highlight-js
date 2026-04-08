/**
 * highlightjs-code.js
 *
 * Vaadin Flow client-side web component wrapping highlight.js.
 * Located in: src/main/resources/META-INF/resources/frontend/
 *
 * The @JsModule annotation in HighlightJs.java points here.
 *
 * Unified panel behaviour:
 *  - When empty   → shows a styled placeholder / paste-target
 *  - On paste     → auto-detects language, beautifies, syntax-highlights in-place
 *  - While filled → the same area is contenteditable; editing triggers live re-highlight
 *  - No secondary textarea is needed.
 */

import { LitElement, html, css } from 'lit';
import hljs from 'highlight.js';
import * as monaco from 'monaco-editor';
import beautify from 'js-beautify';

// Configure Monaco environment for Vite
if (!window.MonacoEnvironment) {
  window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      if (label === 'json') {
        return './monaco-editor/min/vs/language/json/jsonWorker.js';
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return './monaco-editor/min/vs/language/css/cssWorker.js';
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return './monaco-editor/min/vs/language/html/htmlWorker.js';
      }
      if (label === 'typescript' || label === 'javascript') {
        return './monaco-editor/min/vs/language/typescript/tsWorker.js';
      }
      return './monaco-editor/min/vs/editor/editorWorker.js';
    }
  };
}

class HighlightjsCode extends LitElement {

  static get properties() {
    return {
      /** Raw source code to highlight */
      code: { type: String },

      /** Language key, e.g. "java", "python", "auto" */
      language: { type: String },

      /** highlight.js theme CSS name, e.g. "github-dark", "monokai" */
      theme: { type: String },

      /** Whether to show gutter line numbers */
      showLineNumbers: { type: Boolean },

      /** Whether to show the detected/set language badge */
      showLanguageBadge: { type: Boolean },

      /** Whether to show a copy-to-clipboard button */
      showCopyButton: { type: Boolean },

      /** Optional filename label shown in the header bar */
      filename: { type: String },

      /** Whether to show a clear-all button */
      showClearButton: { type: Boolean },

      /** Whether to attempt auto-formatting/beautifying the code on paste */
      formatCode: { type: Boolean },

      /** Internal: detected language name after highlighting */
      _detectedLanguage: { type: String, state: true },

      /** Internal: tracks copy button state */
      _copied: { type: Boolean, state: true },

      /** Internal: whether the panel has any content */
      _hasContent: { type: Boolean, state: true },

      /** Internal: suppress re-render while user is mid-edit */
      _editing: { type: Boolean, state: true },

      /** Optional badge label shown in the header (e.g., "ARCADE") */
      badge: { type: String },
    };
  }

  constructor() {
    super();
    this.code = '';
    this.language = 'auto';
    this.theme = 'vs-dark';
    this.showLineNumbers = false;
    this.showLanguageBadge = true;
    this.showCopyButton = true;
    this.showClearButton = true;
    this.filename = '';
    this.formatCode = true;          // default ON — paste auto-beautifies
    this._detectedLanguage = '';
    this._copied = false;
    this._hasContent = false;
    this._editing = false;
    this._themeLink = null;
    this._debounceTimer = null;
    this.badge = 'ARCADE'; // Default badge as seen in image
    this._monacoInstance = null;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated() {
    // We must mount Monaco in the Light DOM so it can inherit its global CSS that it injects into document.head
    // To do this while keeping our Shadow DOM header, we create a container and slot it.
    const container = document.createElement('div');
    container.slot = 'editor';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.minHeight = '500px';
    container.style.display = 'block';

    // Clear out any previous slotted content just in case
    this.innerHTML = '';
    this.appendChild(container);

    let initialValue = this.code || '';
    let initialLang = this.language === 'auto' ? 'javascript' : this.language;
    if (this.language === 'auto' && initialValue.trim()) {
       initialLang = this._detectLanguage(initialValue);
       this._detectedLanguage = initialLang;
    }

    if (this.formatCode && initialValue.trim()) {
      initialValue = this._beautify(initialValue, initialLang);
    }

    this._monacoInstance = monaco.editor.create(container, {
      value: initialValue,
        language: initialLang,
        theme: this.theme === 'github-dark' ? 'vs-dark' : 'vs-dark',
        automaticLayout: true,
        wordWrap: 'on',
        minimap: { enabled: false },
        lineNumbers: this.showLineNumbers ? 'on' : 'off',
        scrollBeyondLastLine: false,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        fontSize: 14,
        padding: { top: 18, bottom: 18 },
        formatOnPaste: false,
      });

      this._hasContent = !!this.code;

      // Ensure initial theme is applied correctly
      const isLightInit = this.theme.includes('light') || ['default','github','vs','xcode'].includes(this.theme);
      monaco.editor.setTheme(isLightInit ? 'vs' : 'vs-dark');

      this._monacoInstance.onDidPaste((e) => {
        if (this.formatCode) {
          setTimeout(() => {
            const currentText = this._monacoInstance.getValue();
            if (!currentText.trim()) return;

            let lang = this._detectLanguage(currentText);
            this._detectedLanguage = lang;

            // Map common aliases that hljs spits out
            let monacoLang = lang;
            if (lang === 'html' || lang === 'xml') monacoLang = 'html';
            else if (lang === 'js') monacoLang = 'javascript';
            else if (lang === 'ts') monacoLang = 'typescript';

            monaco.editor.setModelLanguage(this._monacoInstance.getModel(), monacoLang);

            const formatted = this._beautify(currentText, lang);
            if (formatted !== currentText) {
              const fullRange = this._monacoInstance.getModel().getFullModelRange();
              this._monacoInstance.executeEdits('formatter', [{
                range: fullRange,
                text: formatted
              }]);
              this._plainCode = formatted;
              this._fireChange(formatted);
            }
          }, 50);
        }
      });

      this._monacoInstance.onDidChangeModelContent((e) => {
        this._editing = true;
        const currentText = this._monacoInstance.getValue();
        const hasContent = !!currentText.trim();

        if (this._hasContent !== hasContent) {
          this._hasContent = hasContent;
        }

        clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
          this._plainCode = currentText;
          this._fireChange(currentText);
        }, 400);
      });

      this._monacoInstance.onDidBlurEditorText(() => {
        const currentText = this._monacoInstance.getValue();
        if (this.formatCode && currentText.trim()) {
           let lang = this._detectLanguage(currentText);
           const formatted = this._beautify(currentText, lang);
           if (formatted !== currentText) {
             const fullRange = this._monacoInstance.getModel().getFullModelRange();
             this._monacoInstance.executeEdits('formatter', [{
               range: fullRange,
               text: formatted
             }]);
             this._plainCode = formatted;
             this._fireChange(formatted);
           }
        }
        setTimeout(() => {
          this._editing = false;
        }, 500);
      });
  }

  updated(changedProps) {
    if (changedProps.has('theme') && this._monacoInstance) {
      // mapping theme
      const isLight = this.theme.includes('light') || ['default','github','vs','xcode'].includes(this.theme);
      monaco.editor.setTheme(isLight ? 'vs' : 'vs-dark');

      // Update background of wrapper to match theme
      const wrapper = this.shadowRoot.querySelector('.code-wrapper');
      if (wrapper) {
        wrapper.style.background = isLight ? '#ffffff' : '#1e1e1e';
      }
    }

    if (changedProps.has('code') && !this._editing && this._monacoInstance) {
      const currentText = this._monacoInstance.getValue();
      let newText = this.code || '';

      if (this.formatCode && newText.trim()) {
        newText = this._beautify(newText, this._detectLanguage(newText));
      }

      if (newText !== currentText) {
        this._monacoInstance.setValue(newText);
        this._hasContent = !!newText;
      }
    }

    if (changedProps.has('showLineNumbers') && this._monacoInstance) {
        this._monacoInstance.updateOptions({ lineNumbers: this.showLineNumbers ? 'on' : 'off' });
    }
  }

  // ---------------------------------------------------------------------------
  // Core: apply code → format → highlight → paint editor
  // ---------------------------------------------------------------------------

  _applyCode(rawCode, skipFormatting = false) {
    if (!rawCode || !rawCode.trim()) {
      this._hasContent = false;
      const editor = this._editor();
      if (editor) editor.innerHTML = '';
      return;
    }

    const { highlightedHtml, detectedLang, formattedCode } = this._processCode(rawCode, skipFormatting);

    this._detectedLanguage = detectedLang;
    this._hasContent = true;

    // Store the plain formatted text as the canonical value
    this._plainCode = formattedCode;

    const editor = this._editor();
    if (!editor) return;

    // Paint highlighted HTML into the editor
    const body = this._buildLines(highlightedHtml);
    editor.innerHTML = body;

    // Move caret to end so the user can keep typing naturally
    this._moveCursorToEnd(editor);
  }

  _processCode(rawCode, skipFormatting = false) {
    let codeToProcess = rawCode;
    let effectiveLanguage = this._detectLanguage(codeToProcess);

    // 2. Beautify if requested and not skipped
    if (this.formatCode && !skipFormatting) {
      codeToProcess = this._beautify(codeToProcess, effectiveLanguage);
    }

    // 3. Syntax-highlight
    let highlightResult;
    if (this.language && this.language !== 'auto') {
      try {
        highlightResult = hljs.highlight(codeToProcess, { language: this.language });
      } catch (_) {
        highlightResult = hljs.highlightAuto(codeToProcess);
      }
    } else {
      highlightResult = hljs.highlightAuto(codeToProcess);
    }

    return {
      highlightedHtml: highlightResult.value,
      detectedLang: highlightResult.language || effectiveLanguage,
      formattedCode: codeToProcess,
    };
  }

  _beautify(code, lang) {
    try {
      const b = beautify || window.beautify;

      const trimmed = code.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          return JSON.stringify(JSON.parse(trimmed), null, 4);
        } catch (e) {
          // not valid json, fall through
        }
      }

      if (!b) return code;

      // If language auto-detection failed or is overly vague, let's peek at the code
      // If it starts with '<' or has '<div', it's almost certainly HTML/XML, so do not let b.js() touch it!
      const isLikelyHtml = /^\s*</.test(code) || /<\/?[a-z][\s\S]*>/i.test(code);

      const effectiveLang = (lang === 'auto' || !lang) ? (isLikelyHtml ? 'html' : 'javascript') : lang?.toLowerCase();

      if (effectiveLang === 'html' || effectiveLang === 'xml') {
        return b.html(code, { indent_size: 2, wrap_line_length: 120 });
      } else if (effectiveLang === 'json') {
        try {
          return JSON.stringify(JSON.parse(code), null, 4);
        } catch (e) {
          return b.js(code, { indent_size: 4 });
        }
      } else if (['javascript', 'js', 'typescript', 'ts',
        'java', 'c', 'cpp', 'cs', 'csharp', 'php', 'rust', 'go', 'kotlin'].includes(effectiveLang)) {
        return b.js(code, { indent_size: 4, space_in_empty_paren: true });
      } else if (effectiveLang === 'python') {
        return this._beautifyPython(code);
      } else {
        // If not in our explicitly supported beautifier list, fallback to HTML heuristically or ignore
        if (isLikelyHtml) {
           return b.html(code, { indent_size: 2, wrap_line_length: 120 });
        }
        return code;
      }
    } catch (e) {
      console.warn('highlightjs-code: Formatting failed', e);
      return code;
    }
  }

  /**
   * Simple rule-based Python beautifier (js-beautify doesn't support Python).
   */
  _beautifyPython(code) {
    if (!code) return '';
    const lines = code.split('\n');
    let indentLevel = 0;
    const indentStr = '    ';
    const result = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (line.length === 0) { result.push(''); continue; }

      if (/^(elif|else|except|finally)\b/.test(line)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      result.push(indentStr.repeat(indentLevel) + line);
      if (line.endsWith(':')) indentLevel++;
    }
    return result.join('\n');
  }

  _buildLines(highlightedHtml) {
    // We wrap each line in a <div class="code-line">.
    // This makes line numbering much easier via CSS counters
    // and keeps the gutter out of the .innerText property.
    const lines = highlightedHtml.split('\n');
    
    // If the last line is empty, it's often a trailing newline from hljs
    // but we want to preserve it so the user can click into the empty last line.
    // We use min-height in CSS instead of &#8203; to avoid messing with char offsets.
    return lines
      .map(line => `<div class="code-line">${line}</div>`)
      .join('');
  }

  // ---------------------------------------------------------------------------
  // DOM helpers
  // ---------------------------------------------------------------------------

  _detectLanguage(code) {
    if (this.language !== 'auto' && this.language) return this.language.toLowerCase();
    const trimmed = code.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        JSON.parse(trimmed);
        return 'json';
      } catch(e) {}
    }
    const detected = hljs.highlightAuto(code);
    return detected.language || 'auto';
  }

  _editor() {
    return this.shadowRoot?.querySelector('.code-editor');
  }

  _moveCursorToEnd(el) {
    try {
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (_) { /* non-fatal */ }
  }

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  /** Intercept paste: strip rich formatting → apply raw text through pipeline */
  _onPaste(e) {
    e.preventDefault();
    const plain = (e.clipboardData || window.clipboardData).getData('text/plain');
    if (!plain) return;

    this._editing = false;            // allow full re-process
    this._applyCode(plain);
    this._fireChange(this._plainCode || plain);
  }

  _onInput(e) {
    this._editing = true;

    // *** FIX: capture caret position SYNCHRONOUSLY right now, before any async
    // work. Inside the debounce (400 ms later) the Shadow-DOM selection is
    // unreliable and frequently returns 0, which snaps the cursor to the
    // top-left corner of the editor.
    const editorNow = this._editor();
    const caretOffset = editorNow ? this._getCaretCharOffset(editorNow) : 0;

    clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => {
      const editor = this._editor();
      if (!editor) return;

      const currentText = editor.innerText;
      const hasContent = !!currentText.trim();

      // Only trigger Lit re-render for placeholder if state changed
      if (this._hasContent !== hasContent) {
        this._hasContent = hasContent;
      }

      if (!hasContent) {
        this._editing = false;
        return;
      }

      // Highlight but SKIP beautify while typing
      const { highlightedHtml, detectedLang, formattedCode } = this._processCode(currentText, true);

      // Update badge only if language changed to avoid badge-induced re-renders
      if (this._detectedLanguage !== detectedLang) {
        this._detectedLanguage = detectedLang;
      }

      this._plainCode = formattedCode;

      // Update the DOM manually
      const body = this._buildLines(highlightedHtml);

      // Only swap HTML if highlighting actually changed something
      if (editor.innerHTML !== body) {
        editor.innerHTML = body;
        // Restore caret using the offset we captured before the debounce
        this._setCaretCharOffset(editor, caretOffset);
      }

      // Notify server
      this._fireChange(formattedCode);
    }, 400);
  }

  _onFocus() {
    this._editing = true;
  }

  _onBlur() {
    // When the user stops interacting, we finally apply formatting if enabled
    const editor = this._editor();
    if (!editor) {
      this._editing = false;
      return;
    }

    const currentText = editor.innerText;
    if (this.formatCode && currentText.trim()) {
      this._applyCode(currentText, false); // force format now
      this._fireChange(this._plainCode);
    }
    
    // Short delay before allowing property updates to override local state
    // to account for server-side round-trip time.
    setTimeout(() => {
      this._editing = false;
    }, 500);
   }

   _onKeyDown(e) {
     const editor = this._editor();
     if (!editor) return;

     // Tab key → insert spaces instead of leaving focus
     if (e.key === 'Tab') {
       e.preventDefault();
       document.execCommand('insertText', false, '    ');
       return;
     }

     // Enter key → smart indentation like VS Code
     if (e.key === 'Enter') {
       e.preventDefault();

       // Get current caret position and the line content
       const sel = window.getSelection();
       if (!sel || sel.rangeCount === 0) return;

       const range = sel.getRangeAt(0);
       const preRange = document.createRange();
       preRange.selectNodeContents(editor);
       preRange.setEnd(range.endContainer, range.endOffset);
       const textBeforeCursor = preRange.toString();

       // Find the indentation of the current line
       const lines = textBeforeCursor.split('\n');
       const currentLine = lines[lines.length - 1];

       // Extract leading whitespace (indentation) from the current line
       const indentMatch = currentLine.match(/^(\s*)/);
       const indent = indentMatch ? indentMatch[1] : '';

       // Check if the current line ends with an opening bracket/brace
       const trimmedLine = currentLine.trim();
       const endsWithOpenBracket = /[\{\[\(]$/.test(trimmedLine);

       // Insert newline and matching indentation
       let newlineText = '\n' + indent;
       if (endsWithOpenBracket) {
         // Add extra indentation for nested content
         newlineText = '\n' + indent + '    ';
       }

       document.execCommand('insertText', false, newlineText);
     }
   }

  _fireChange(newCode) {
    this.dispatchEvent(new CustomEvent('code-change', {
      detail: { code: newCode, language: this._detectedLanguage },
      bubbles: true,
      composed: true,
    }));
  }

  // ---------------------------------------------------------------------------
  // Caret position helpers (char-offset based — works across text nodes)
  // ---------------------------------------------------------------------------

  _getCaretCharOffset(el) {
    // Support Shadow-DOM-aware getSelection (Firefox exposes it on shadowRoot)
    const root = el.getRootNode();
    const sel = (root && root.getSelection) ? root.getSelection() : window.getSelection();
    if (!sel || sel.rangeCount === 0) return 0;
    try {
      const range = sel.getRangeAt(0);
      const preRange = document.createRange();
      preRange.selectNodeContents(el);
      preRange.setEnd(range.endContainer, range.endOffset);
      return preRange.toString().length;
    } catch (_) {
      return 0;
    }
  }

  _setCaretCharOffset(el, offset) {
    try {
      // Ensure the editor has focus so the restored range is actually visible
      if (document.activeElement !== el) {
        el.focus({ preventScroll: true });
      }

      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let remaining = offset;
      let lastNode = null;
      let node;

      while ((node = walker.nextNode())) {
        lastNode = node;
        // Use > so that a cursor exactly at the end of a node stays on that
        // node rather than moving to the start of the next one (avoids the
        // off-by-one jump that looks like the cursor moved backwards).
        if (remaining <= node.length) {
          const range = document.createRange();
          const sel = window.getSelection();
          range.setStart(node, remaining);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          return;
        }
        remaining -= node.length;
      }

      // Fallback: offset exceeded total text length → place cursor at very end
      if (lastNode) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(lastNode, lastNode.length);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } catch (_) { /* non-fatal */ }
  }

  // ---------------------------------------------------------------------------
  // Copy to clipboard
  // ---------------------------------------------------------------------------

  async _copyCode() {
    try {
      const text = this._plainCode || this.code;
      await navigator.clipboard.writeText(text);
      this._copied = true;
      setTimeout(() => { this._copied = false; }, 2000);
    } catch (e) {
      console.warn('highlightjs-code: clipboard write failed', e);
    }
  }

  _clearCode() {
    this.code = '';
    this._plainCode = '';
    this._hasContent = false;
    if (this._monacoInstance) {
      this._monacoInstance.setValue('');
    }
    this._fireChange('');
  }

  // ---------------------------------------------------------------------------
  // Styles
  // ---------------------------------------------------------------------------

  static get styles() {
    return css`
      :host {
        display: block;
        border-radius: 8px;
        overflow: hidden;
        font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
        font-size: 0.875rem;
        line-height: 1.6;
        box-shadow: 0 4px 24px rgba(0,0,0,0.18);
        display: flex;
        flex-direction: column;
      }

      /* ---- Header bar ---- */
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 14px;
        background: rgba(0,0,0,0.25);
        backdrop-filter: blur(4px);
        gap: 8px;
        min-height: 36px;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      /* macOS-style traffic lights (decorative) */
      .dots { display: flex; gap: 6px; }
      .dot  { width: 12px; height: 12px; border-radius: 50%; }
      .dot-red    { background: #ff5f57; }
      .dot-yellow { background: #ffbd2e; }
      .dot-green  { background: #28c840; }

      .filename {
        font-size: 0.78rem;
        opacity: 0.7;
        letter-spacing: 0.02em;
        color: inherit;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .language-badge {
        font-size: 0.65rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        opacity: 0.6;
        padding: 2px 8px;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 4px;
        background: rgba(255,255,255,0.05);
      }

      .arcade-badge {
        font-size: 0.65rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        opacity: 0.5;
        padding: 3px 8px;
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 4px;
        background: rgba(255,255,255,0.1);
        margin-right: 4px;
      }

      .copy-btn {
        background: none;
        border: 1px solid rgba(255,255,255,0.25);
        border-radius: 5px;
        color: inherit;
        cursor: pointer;
        font-size: 0.72rem;
        padding: 3px 9px;
        opacity: 0.7;
        transition: opacity 0.15s, background 0.15s;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .copy-btn:hover  { opacity: 1; background: rgba(255,255,255,0.1); }
      .copy-btn.copied { opacity: 1; border-color: #4ade80; color: #4ade80; }

      .clear-btn {
        background: none;
        border: 1px solid rgba(255,255,255,0.25);
        border-radius: 5px;
        color: inherit;
        cursor: pointer;
        font-size: 0.72rem;
        padding: 3px 9px;
        opacity: 0.7;
        transition: opacity 0.15s, background 0.15s;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .clear-btn:hover { 
        opacity: 1; 
        background: rgba(255, 69, 58, 0.15); 
        border-color: rgba(255, 69, 58, 0.5); 
        color: #ff453a; 
      }

      /* ---- Unified code panel ---- */
      .code-wrapper {
        position: relative;
        overflow: hidden;
        background: #1e1e1e; /* Monaco dark background */
        flex: 1;
        min-height: 500px;
        display: flex;
      }

      /* Placeholder shown when empty */
      .code-wrapper::before {
        content: attr(data-placeholder);
        position: absolute;
        top: 18px;
        left: 56px; /* Offset for gutter */
        right: 18px;
        pointer-events: none;
        opacity: 0.3;
        white-space: pre-wrap;
        font-style: italic;
        transition: opacity 0.2s;
        z-index: 10;
      }
      .code-wrapper.has-content::before {
        opacity: 0;
      }

      .code-editor-container {
        width: 100%;
        height: 100%;
        min-height: 500px;
        display: block;
      }
    `;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  render() {
    const lang = this._detectedLanguage || this.language || '';
    const hasHeader = this.filename || this.showLanguageBadge || this.showCopyButton;
    const placeholder = 'Paste your code here…\\n\\nCode will be automatically detected, formatted, and highlighted.\\nYou can then edit it directly in this panel.';

    return html`
      ${hasHeader ? html`
        <div class="header">
          <div class="header-left">
            <div class="dots">
              <div class="dot dot-red"></div>
              <div class="dot dot-yellow"></div>
              <div class="dot dot-green"></div>
            </div>
            ${this.filename ? html`<span class="filename">${this.filename}</span>` : ''}
          </div>
          <div class="header-right">
            ${this.badge ? html`<span class="arcade-badge">${this.badge}</span>` : ''}
            ${this.showLanguageBadge && lang ? html`
              <span class="language-badge">${lang}</span>
            ` : ''}
            ${this.showCopyButton ? html`
              <button
                class="copy-btn ${this._copied ? 'copied' : ''}"
                @click="${this._copyCode}"
                title="Copy to clipboard"
              >
                ${this._copied
            ? html`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied`
            : html`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`
          }
              </button>
            ` : ''}
            ${this.showClearButton ? html`
              <button
                class="clear-btn"
                @click="${this._clearCode}"
                title="Clear all text"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
                </svg>
                Clear
              </button>
            ` : ''}
          </div>
        </div>
      ` : ''}

      <div
        class="code-wrapper ${this._hasContent ? 'has-content' : ''}"
        data-placeholder="${placeholder}"
      >
        <slot name="editor"></slot>
      </div>
    `;
  }
}

customElements.define('highlightjs-code', HighlightjsCode);
