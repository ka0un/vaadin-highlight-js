package com.sundev.sunpaste.util;

/**
 * Pre-bundled themes available in highlight.js.
 * These map directly to CSS files shipped with the npm package.
 */
public enum Theme {
    /** Default theme */
    DEFAULT("default"),
    /** Dark theme */
    DARK("dark"),
    /** GitHub theme */
    GITHUB("github"),
    /** GitHub Dark theme */
    GITHUB_DARK("github-dark"),
    /** Monokai theme */
    MONOKAI("monokai"),
    /** Monokai Sublime theme */
    MONOKAI_SUBLIME("monokai-sublime"),
    /** Atom One Dark theme */
    ATOM_ONE_DARK("atom-one-dark"),
    /** Atom One Light theme */
    ATOM_ONE_LIGHT("atom-one-light"),
    /** Dracula theme */
    DRACULA("dracula"),
    /** Visual Studio theme */
    VS("vs"),
    /** Visual Studio 2015 theme */
    VS2015("vs2015"),
    /** Xcode theme */
    XCODE("xcode"),
    /** IntelliJ Light theme */
    INTELLIJ_LIGHT("intellij-light"),
    /** Night Owl theme */
    NIGHT_OWL("night-owl"),
    /** Tokyo Night Dark theme */
    TOKYO_NIGHT_DARK("tokyo-night-dark"),
    /** Tokyo Night Light theme */
    TOKYO_NIGHT_LIGHT("tokyo-night-light"),
    /** Nord theme */
    NORD("nord"),
    /** Gruvbox Dark theme */
    GRUVBOX_DARK("gruvbox-dark"),
    /** Gruvbox Light theme */
    GRUVBOX_LIGHT("gruvbox-light"),
    /** Solarized Dark theme */
    SOLARIZED_DARK("base16/solarized-dark"),
    /** Solarized Light theme */
    SOLARIZED_LIGHT("base16/solarized-light");

    private final String cssName;

    Theme(String cssName) {
        this.cssName = cssName;
    }

    public String getCssName() {
        return cssName;
    }
}

