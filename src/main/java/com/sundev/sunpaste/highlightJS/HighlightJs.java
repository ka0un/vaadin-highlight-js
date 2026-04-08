package com.sundev.sunpaste.highlightJS;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;
import com.sundev.sunpaste.util.Theme;

/**
 * Vaadin Flow wrapper for Highlight.js (https://highlightjs.org/).
 *
 * <p>Provides server-side Java API for the {@code <highlightjs-code>} web component,
 * which performs client-side syntax highlighting using highlight.js.</p>
 *
 * <h3>Basic usage:</h3>
 * <pre>{@code
 * HighlightJs highlight = new HighlightJs();
 * highlight.setCode("public class Hello { }");
 * highlight.setLanguage("java");
 * highlight.setTheme(Theme.GITHUB_DARK);
 * add(highlight);
 * }</pre>
 */
@Tag("highlightjs-code")
@NpmPackage(value = "highlight.js", version = "11.9.0")
@NpmPackage(value = "js-beautify", version = "1.15.1")
@NpmPackage(value = "monaco-editor", version = "0.45.0")
@JsModule("./highlightjs-code.js")
public class HighlightJs extends Component implements HasSize {

    /**
     * Creates a new HighlightJs component with no code set.
     */
    public HighlightJs() {
        // defaults: theme=github-dark, line numbers off
        setTheme(Theme.GITHUB_DARK);
    }

    /**
     * Creates a new HighlightJs component with the given code and language.
     *
     * @param code     the source code to highlight
     * @param language the language key (e.g. "java", "javascript", "python")
     */
    public HighlightJs(String code, String language) {
        this();
        setCode(code);
        setLanguage(language);
    }

    // -----------------------------------------------------------------------
    // Code & Language
    // -----------------------------------------------------------------------

    /**
     * Sets the source code to be highlighted.
     *
     * @param code raw source code string
     */
    public void setCode(String code) {
        getElement().setProperty("code", code == null ? "" : code);
    }

    /**
     * Returns the current source code.
     */
    public String getCode() {
        return getElement().getProperty("code", "");
    }

    /**
     * Sets the language for syntax highlighting.
     * Use {@code "auto"} to let highlight.js detect the language automatically.
     *
     * @param language language key supported by highlight.js
     *                 (e.g. "java", "python", "sql", "auto")
     */
    public void setLanguage(String language) {
        getElement().setProperty("language", language == null ? "auto" : language);
    }

    /**
     * Returns the currently set language key.
     */
    public String getLanguage() {
        return getElement().getProperty("language", "auto");
    }

    /**
     * Enables or disables the built-in Java auto-detection heuristic used when
     * {@link #getLanguage()} is set to {@code "auto"}.
     *
     * <p>When enabled, Java-like code patterns are detected before delegating to
     * highlight.js auto-detection. This helps avoid false positives such as
     * classifying Java snippets as SQL dialects.</p>
     *
     * @param useJavaHeuristic {@code true} to enable Java-first detection
     */
    public void setUseJavaHeuristic(boolean useJavaHeuristic) {
        getElement().setProperty("useJavaHeuristic", useJavaHeuristic);
    }

    /**
     * Returns whether Java-first auto-detection heuristic is enabled.
     */
    public boolean isUseJavaHeuristic() {
        return getElement().getProperty("useJavaHeuristic", true);
    }

    // -----------------------------------------------------------------------
    // Theme
    // -----------------------------------------------------------------------

    /**
     * Sets the highlight.js theme using the built-in {@link Theme} enum.
     *
     * @param theme one of the pre-defined themes
     */
    public void setTheme(Theme theme) {
        setTheme(theme.getCssName());
    }

    /**
     * Sets the highlight.js theme by raw CSS name.
     * Allows using custom or future themes not listed in the {@link Theme} enum.
     *
     * @param themeCssName e.g. "monokai", "base16/solarized-dark"
     */
    public void setTheme(String themeCssName) {
        getElement().setProperty("theme", themeCssName == null ? "github-dark" : themeCssName);
    }

    /**
     * Returns the current theme CSS name.
     */
    public String getTheme() {
        return getElement().getProperty("theme", "github-dark");
    }

    // -----------------------------------------------------------------------
    // Display Options
    // -----------------------------------------------------------------------

    /**
     * Toggles line number display.
     *
     * @param showLineNumbers {@code true} to show line numbers
     */
    public void setShowLineNumbers(boolean showLineNumbers) {
        getElement().setProperty("showLineNumbers", showLineNumbers);
    }

    /**
     * Returns whether line numbers are displayed.
     */
    public boolean isShowLineNumbers() {
        return getElement().getProperty("showLineNumbers", false);
    }

    /**
     * Shows or hides the language badge in the top-right corner.
     *
     * @param showLanguageBadge {@code true} to show the badge
     */
    public void setShowLanguageBadge(boolean showLanguageBadge) {
        getElement().setProperty("showLanguageBadge", showLanguageBadge);
    }

    /**
     * Returns whether the language badge is displayed.
     */
    public boolean isShowLanguageBadge() {
        return getElement().getProperty("showLanguageBadge", true);
    }

    /**
     * Shows or hides the copy-to-clipboard button.
     *
     * @param showCopyButton {@code true} to show the copy button
     */
    public void setShowCopyButton(boolean showCopyButton) {
        getElement().setProperty("showCopyButton", showCopyButton);
    }

    /**
     * Returns whether the copy button is displayed.
     */
    public boolean isShowCopyButton() {
        return getElement().getProperty("showCopyButton", true);
    }

    /**
     * Shows or hides the clear-all button.
     *
     * @param showClearButton {@code true} to show the clear button
     */
    public void setShowClearButton(boolean showClearButton) {
        getElement().setProperty("showClearButton", showClearButton);
    }

    /**
     * Returns whether the clear button is displayed.
     */
    public boolean isShowClearButton() {
        return getElement().getProperty("showClearButton", true);
    }

    /**
     * Sets an optional filename label shown above the code block.
     *
     * @param filename e.g. "HelloWorld.java"
     */
    public void setFilename(String filename) {
        getElement().setProperty("filename", filename == null ? "" : filename);
    }

    /**
     * Returns the currently set filename label.
     */
    public String getFilename() {
        return getElement().getProperty("filename", "");
    }

    /**
     * Sets whether the code should be auto-formatted/beautified
     * before highlighting (useful for minified code).
     *
     * @param formatCode {@code true} to enable formatting
     */
    public void setFormatCode(boolean formatCode) {
        getElement().setProperty("formatCode", formatCode);
    }

    /**
     * Returns whether the code will be automatically formatted.
     */
    public boolean isFormatCode() {
        return getElement().getProperty("formatCode", false);
    }

    /**
     * Sets an optional badge label shown in the header (e.g., "ARCADE").
     *
     * @param badge the badge label text
     */
    public void setBadge(String badge) {
        getElement().setProperty("badge", badge == null ? "" : badge);
    }

    /**
     * Returns the currently set badge label.
     */
    public String getBadge() {
        return getElement().getProperty("badge", "");
    }
}
