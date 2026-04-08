package com.sundev.sunpaste.util;

/**
 * Pre-bundled themes available in highlight.js.
 * These map directly to CSS files shipped with the npm package.
 */
public enum Theme {
    DEFAULT("default"),
    DARK("dark"),
    GITHUB("github"),
    GITHUB_DARK("github-dark"),
    MONOKAI("monokai"),
    MONOKAI_SUBLIME("monokai-sublime"),
    ATOM_ONE_DARK("atom-one-dark"),
    ATOM_ONE_LIGHT("atom-one-light"),
    DRACULA("dracula"),
    VS("vs"),
    VS2015("vs2015"),
    XCODE("xcode"),
    INTELLIJ_LIGHT("intellij-light"),
    NIGHT_OWL("night-owl"),
    TOKYO_NIGHT_DARK("tokyo-night-dark"),
    TOKYO_NIGHT_LIGHT("tokyo-night-light"),
    NORD("nord"),
    GRUVBOX_DARK("gruvbox-dark"),
    GRUVBOX_LIGHT("gruvbox-light"),
    SOLARIZED_DARK("base16/solarized-dark"),
    SOLARIZED_LIGHT("base16/solarized-light");

    private final String cssName;

    Theme(String cssName) {
        this.cssName = cssName;
    }

    public String getCssName() {
        return cssName;
    }
}

