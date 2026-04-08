# HighlightJS & Monaco Vaadin Wrapper

A premium Vaadin Flow component combining **Monaco Editor** (VS Code's editor) and **Highlight.js** for professional code viewing, editing, and syntax highlighting.

## Key Highlights

✨ **Monaco Editor Power** — Full-featured code editing with intelligent features like auto-indent, bracket matching, and live formatting.

🚀 **Smart Language Detection** — Auto-detects Java, Markdown, JSON, and 500+ other languages. Java and Markdown detection heuristics prevent misclassification.

🪄 **Auto-Formatting on Paste** — Intelligently beautifies code using js-beautify upon paste, with support for Java, JavaScript, Python, HTML/XML, and more.

🎨 **Customizable Themes** — Light and dark theme support with professional color schemes.

⌨️ **Developer-Friendly** — Tab-to-space conversion, smart indentation, copy-to-clipboard, and clear-all functionality built-in.

📝 **Real-Time Syntax Highlighting** — Instant visual feedback as users type, with hundreds of language grammars.

🔢 **Optional Line Numbers** — Toggle gutter line numbering for presentation or reference.

🏷️ **Status Badges** — Display detected language and custom project badges (e.g., "ARCADE", "PRO").

## Use Cases

- **Code Review Platforms** — Display and edit code snippets with rich formatting
- **Documentation Generators** — Embed interactive code examples
- **IDE Dashboards** — Dashboard components for code display
- **Learning Platforms** — Present and collect code from students
- **Configuration UIs** — Edit JSON, YAML, and code configs visually

## Component API

### Java (Vaadin Flow)
```java
HighlightJs codeBlock = new HighlightJs();
codeBlock.setCode("public class HelloWorld { ... }");
codeBlock.setLanguage("auto"); // or explicit: "java", "python", etc.
codeBlock.setTheme(Theme.GITHUB_DARK);
codeBlock.setShowLineNumbers(true);
codeBlock.setShowCopyButton(true);
codeBlock.setFormatCode(true);
add(codeBlock);
```

### Property Configuration
- **Language Detection** — Automatic or explicit language selection
- **Formatting** — Toggle auto-beautify on paste/blur
- **Display Options** — Line numbers, language badge, copy/clear buttons
- **Theming** — Multiple Monaco themes (Light/Dark)

## Dependencies

- **Vaadin Flow 24.3+** — Modern Vaadin version
- **Monaco Editor 0.45+** — VS Code editor engine
- **Highlight.js 11.9+** — Language auto-detection and syntax coloring
- **js-beautify** — Code formatting backend

## License

MIT License — Free for commercial and personal use

## GitHub Repository

https://github.com/ka0un/vaadin-highlight-js

