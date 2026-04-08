# HighlightJS & Monaco Vaadin Wrapper

A modern, high-performance Vaadin Flow wrapper combining the power of [Monaco Editor](https://microsoft.github.io/monaco-editor/) and [Highlight.js](https://highlightjs.org/), providing a premium, unified code viewing and editing experience.

![Vaadin](https://img.shields.io/badge/Vaadin-v24+-00B4F0?style=for-the-badge&logo=vaadin)
![Monaco](https://img.shields.io/badge/Monaco_Editor-v0.45+-007ACC?style=for-the-badge&logo=visual-studio-code)
![Highlight.js](https://img.shields.io/badge/Highlight.js-v11.9-F05032?style=for-the-badge&logo=javascript)

## ✨ Features

- **🎨 Premium Editing Experience**: Powered by the **Monaco Editor** (the engine behind VS Code) for professional-grade code interaction.
- **🔄 Unified Interface**: A single, seamless panel for both viewing and editing. Paste code to see it beautifully highlighted instantly.
- **🪄 Intelligent Auto-Formatting**: Integrated `js-beautify` and Monaco's internal logic to pretty-print messy code automatically on paste.
- **🚀 Live Syntax Highlighting**: Real-time coloring as you type, supporting hundreds of languages via Highlight.js and Monaco.
- **⌨️ Smart Coding Helpers**: Includes Tab-to-space conversion and intelligent indentation logic for a natural IDE feel.
- **🔢 Gutter & Line Numbers**: Professional line numbering that can be toggled on/off.
- **📋 Management Tools**: Built-in "Copy to Clipboard" and "Clear All" buttons with visual feedback.
- **🏷️ Status Badges**: Displays detected languages and custom project badges (e.g., "ARCADE").
- **📂 macOS Aesthetics**: Premium header bar with decorative "traffic light" dots and filename labels.

## 📖 Documentation

For a deep dive into the project structure, architectural logic, and production guidelines, please refer to the:
**👉 [Project Guidelines and Explanation Document](PROJECT_GUIDELINES.md)**

## 🚀 Getting Started

### Installation

Currently, this component is integrated directly into the project. To use it, ensure you have the following files:

- `HighlightJs.java`: Core Vaadin component.
- `Theme.java`: Enum containing supported themes.
- `highlightjs-code.js`: The Lit/Monaco frontend connector.

### Basic Usage

```java
HighlightJs codeBlock = new HighlightJs();
codeBlock.setCode("public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}");
codeBlock.setLanguage("java");
codeBlock.setTheme(Theme.GITHUB_DARK); // Maps to Monaco Dark
codeBlock.setShowLineNumbers(true);

add(codeBlock);
```

### Advanced Configuration

```java
HighlightJs advanced = new HighlightJs(myRawCode, "python");
advanced.setTheme(Theme.DRACULA);
advanced.setShowCopyButton(true);
advanced.setShowClearButton(true);
advanced.setBadge("PRO-EDIT");
advanced.setFilename("main.py");
advanced.setFormatCode(true); // Automatically prettify input on paste/blur
```

## 🛠️ Components

### `HighlightJs`
The main Vaadin component that acts as a proxy for the Monaco-based frontend.

| Method | Description |
|--------|-------------|
| `setCode(String)` | Sets the code. Updates the editor live if not being edited. |
| `setLanguage(String)` | Sets the language. Supports "auto" for smart detection. |
| `setTheme(Theme)` | Switches between Light and Dark Monaco themes. |
| `setShowClearButton(bool)` | Toggles the red "Clear All" button. |
| `setShowCopyButton(bool)` | Toggles the clipboard action. |
| `setFormatCode(boolean)` | Enables/disables auto-beautification. |
| `setBadge(String)` | Sets the text for the header badge. |

## 🖥️ Demo View

The project includes a comprehensive demo `/highlight-demo` showing:
- Real-time interaction between Java and Monaco.
- Theme toggling (Light/Dark).
- Dynamic property updates (Line numbers, Badges, etc.).

## 📦 Dependencies

The wrapper utilizes the following npm packages:
- `monaco-editor`: The core editor engine.
- `highlight.js`: Used for language auto-detection logic.
- `js-beautify`: Backend for the "Format on Paste" feature.

---
Developed with ❤️ by **SunDev** 🚀
