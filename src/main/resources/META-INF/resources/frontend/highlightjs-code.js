/**
 * highlightjs-code.js
 *
 * Vaadin Flow client-side web component wrapping highlight.js.
 * Located in: src/main/resources/META-INF/resources/frontend/
 *
 * The @JsModule annotation in HighlightJs.java points here.
 */

import { LitElement, html, css } from 'lit';
import hljs from 'highlight.js';
import beautify from 'js-beautify';

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

      /** Whether to attempt auto-formatting/beautifying the code */
      formatCode: { type: Boolean },

      /** Internal: detected language name after highlighting */
      _detectedLanguage: { type: String, state: true },

      /** Internal: tracks copy button state */
      _copied: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.code = '';
    this.language = 'auto';
    this.theme = 'github-dark';
    this.showLineNumbers = false;
    this.showLanguageBadge = true;
    this.showCopyButton = true;
    this.filename = '';
    this.formatCode = false;
    this._detectedLanguage = '';
    this._copied = false;
    this._themeLink = null;
  }

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  connectedCallback() {
    super.connectedCallback();
    this._loadTheme(this.theme);
  }

  updated(changedProps) {
    if (changedProps.has('theme')) {
      this._loadTheme(this.theme);
    }
  }

  // -------------------------------------------------------------------------
  // Theme loading  — injects a <link> into the shadow root
  // -------------------------------------------------------------------------

  _loadTheme(themeName) {
    // Remove old theme link if present
    if (this._themeLink) {
      this._themeLink.remove();
      this._themeLink = null;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    // highlight.js ships CSS under highlight.js/styles/
    link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${themeName}.min.css`;

    // Wait until the root is available
    if (this.shadowRoot) {
      this.shadowRoot.appendChild(link);
    } else {
      this.updateComplete.then(() => {
        this.shadowRoot.appendChild(link);
      });
    }
    this._themeLink = link;
  }

  // -------------------------------------------------------------------------
  // Syntax highlighting
  // -------------------------------------------------------------------------

  _highlight() {
    if (!this.code) return { value: '', language: '', formattedCode: '' };

    let codeToHighlight = this.code;
    let effectiveLanguage = (this.language || 'auto').toLowerCase();

    // 1. If language is auto, detect it first to pick the right formatter
    if (effectiveLanguage === 'auto' || effectiveLanguage === '') {
      const result = hljs.highlightAuto(codeToHighlight);
      effectiveLanguage = result.language || 'auto';
    }

    // 2. Format code if requested
    if (this.formatCode) {
      try {
        const lang = effectiveLanguage;
        // Check if beautify is loaded correctly
        const b = beautify || (window.beautify);
        
        if (b) {
          if (lang === 'html' || lang === 'xml') {
            codeToHighlight = b.html(codeToHighlight, { indent_size: 2, wrap_line_length: 120 });
          } else if (lang === 'css' || lang === 'scss' || lang === 'less') {
            codeToHighlight = b.css(codeToHighlight, { indent_size: 2 });
          } else if (['javascript', 'js', 'typescript', 'ts', 'json', 'java', 'c', 'cpp', 'cs', 'php', 'rust', 'go'].includes(lang)) {
            codeToHighlight = b.js(codeToHighlight, { indent_size: 4, space_in_empty_paren: true });
          } else if (lang === 'python') {
            codeToHighlight = this._beautifyPython(codeToHighlight);
          } else {
            // Default: try JS beautifier as it handles many brace-based languages decently
            codeToHighlight = b.js(codeToHighlight, { indent_size: 4 });
          }
        }
      } catch (e) {
        console.warn('highlightjs-code: Formatting failed', e);
      }
    }

    // 3. Highlight the (potentially formatted) code
    let highlightResult;
    if (this.language && this.language !== 'auto') {
      try {
        highlightResult = hljs.highlight(codeToHighlight, { language: this.language });
      } catch (e) {
        highlightResult = hljs.highlightAuto(codeToHighlight);
      }
    } else {
      highlightResult = hljs.highlightAuto(codeToHighlight);
    }

    return { 
      value: highlightResult.value, 
      language: highlightResult.language, 
      formattedCode: codeToHighlight 
    };
  }

  /**
   * Simple rule-based Python beautifier since js-beautify doesn't support it.
   * Handles basic indentation based on colons and keywords.
   */
  _beautifyPython(code) {
    if (!code) return '';
    const lines = code.split('\n');
    let indentLevel = 0;
    const indentStr = '    ';
    const result = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (line.length === 0) {
        result.push('');
        continue;
      }

      // Keywords that typically decrease indent of the CURRENT line
      if (/^(elif|else|except|finally)\b/.test(line)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Add the line with current indentation
      result.push(indentStr.repeat(indentLevel) + line);

      // Keywords that typically increase indent for the NEXT line
      if (line.endsWith(':')) {
        indentLevel++;
      }
      
      // Heuristic: if next line starts with a keyword that breaks a block, we might need to un-indent
      // But it's hard to do without looking ahead. 
      // For now, let's just use the basic logic.
    }
    return result.join('\n');
  }

  _buildLines(highlightedHtml) {
    if (!this.showLineNumbers) return highlightedHtml;

    const lines = highlightedHtml.split('\n');
    return lines
      .map((line, i) =>
        `<span class="line-number">${i + 1}</span>${line}`
      )
      .join('\n');
  }

  // -------------------------------------------------------------------------
  // Copy to clipboard
  // -------------------------------------------------------------------------

  async _copyCode() {
    try {
      const { formattedCode } = this._highlight();
      await navigator.clipboard.writeText(formattedCode || this.code);
      this._copied = true;
      setTimeout(() => { this._copied = false; }, 2000);
    } catch (e) {
      console.warn('highlightjs-code: clipboard write failed', e);
    }
  }

  // -------------------------------------------------------------------------
  // Styles
  // -------------------------------------------------------------------------

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
      .dots {
        display: flex;
        gap: 6px;
      }
      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
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
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        opacity: 0.6;
        padding: 2px 7px;
        border: 1px solid currentColor;
        border-radius: 4px;
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
      .copy-btn:hover { opacity: 1; background: rgba(255,255,255,0.1); }
      .copy-btn.copied { opacity: 1; border-color: #4ade80; color: #4ade80; }

      /* ---- Code area ---- */
      .code-wrapper {
        overflow: auto;
      }

      pre {
        margin: 0;
        padding: 18px;
        line-height: 1.5;
      }

      code {
        font-family: inherit;
      }

      /* Line number gutter */
      .line-number {
        display: inline-block;
        user-select: none;
        min-width: 2.5em;
        text-align: right;
        opacity: 0.4;
        margin-right: 16px;
        color: inherit;
      }
    `;
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  render() {
    const { value: highlighted, language: detectedLang } = this._highlight();
    const lang = detectedLang || this.language || '';
    const body = this._buildLines(highlighted);
    const hasHeader = this.filename || this.showLanguageBadge || this.showCopyButton;

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
          </div>
        </div>
      ` : ''}

      <div class="code-wrapper">
        <pre><code class="hljs" .innerHTML="${body}"></code></pre>
      </div>
    `;
  }
}

customElements.define('highlightjs-code', HighlightjsCode);
