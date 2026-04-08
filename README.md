# HighlightJS Vaadin Wrapper

A modern, high-performance Vaadin Flow wrapper for [Highlight.js](https://highlightjs.org/), providing seamless syntax highlighting for your Java web applications.

![Vaadin](https://img.shields.io/badge/Vaadin-v24+-00B4F0?style=for-the-badge&logo=vaadin)
![Highlight.js](https://img.shields.io/badge/Highlight.js-v11.9-F05032?style=for-the-badge&logo=javascript)
![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk)

## ✨ Features

- **🚀 Client-side Performance**: Powered by Highlight.js for fast, browser-side syntax highlighting.
- **🎨 20+ Pre-bundled Themes**: Support for popular themes like GitHub Dark, Monokai, Dracula, Nord, and more.
- **🔢 Line Numbers**: Optional line numbering for better code readability.
- **📋 Copy to Clipboard**: Built-in button for easy code sharing.
- **🏷️ Language Badges**: Automatically displays the detected or specified language.
- **🪄 Auto-Formatting**: Integrated `js-beautify` to pretty-print minified or messy code.
- **🔍 Auto-Detection**: Let Highlight.js automatically identify the programming language.
- **📂 Filename Labels**: Support for displaying filenames above code blocks.

## 📖 Documentation

For a deep dive into the project structure, architectural logic, and production guidelines, please refer to the:
**👉 [Project Guidelines and Explanation Document](PROJECT_GUIDELINES.md)**

## 🚀 Getting Started

### Installation

Currently, this component is integrated directly into the project. To use it, ensure you have the following files in your project:

- `HighlightJs.java`: Core Vaadin component.
- `Theme.java`: Enum containing supported themes.
- `highlightjs-code.js`: JavaScript connector (located in `src/main/resources/META-INF/resources/frontend/`).

### Basic Usage

```java
HighlightJs codeBlock = new HighlightJs();
codeBlock.setCode("public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}");
codeBlock.setLanguage("java");
codeBlock.setTheme(Theme.GITHUB_DARK);
codeBlock.setShowLineNumbers(true);

add(codeBlock);
```

### Advanced Configuration

```java
HighlightJs advanced = new HighlightJs(myRawCode, "python");
advanced.setTheme(Theme.DRACULA);
advanced.setShowCopyButton(true);
advanced.setShowLanguageBadge(true);
advanced.setFilename("script.py");
advanced.setFormatCode(true); // Automatically prettify the input code
```

## 🛠️ Components

### `HighlightJs`
The main Vaadin component that extends `Component` and implements `HasSize` and `HasStyle`.

| Method | Description |
|--------|-------------|
| `setCode(String)` | Sets the raw source code to be highlighted. |
| `setLanguage(String)` | Sets the language (e.g., "java", "python", "auto"). |
| `setTheme(Theme)` | Sets the visual theme using the `Theme` enum. |
| `setShowLineNumbers(boolean)` | Toggles the display of line numbers. |
| `setShowCopyButton(boolean)` | Toggles the copy-to-clipboard button. |
| `setFormatCode(boolean)` | Enables/disables automatic code beautification. |
| `setFilename(String)` | Displays a filename label above the code block. |

### `Theme`
An enum containing a curated list of supported Highlight.js themes:

- `GITHUB_DARK` (Default)
- `MONOKAI`
- `DRACULA`
- `ATOM_ONE_DARK`
- `SOLARIZED_DARK`
- ... and many others.

## 🖥️ Demo View

The project includes a comprehensive demo accessible at `/highlight-demo`. It features:
- A real-time code editor (TextArea).
- Dynamic theme switching.
- Auto-detection and formatting toggles.

To run the demo, simply run the Spring Boot application and navigate to `http://localhost:8080/highlight-demo`.

## 📦 Dependencies

The wrapper utilizes the following npm packages:
- `highlight.js` (11.9.0)
- `js-beautify` (1.15.1)

---
Developed by **SunDev** 🚀
