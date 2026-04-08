package com.sundev.sunpaste.highlightJS;

import com.sundev.sunpaste.util.Theme;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class HighlightJsTest {

    @Test
    void defaultsAreSet() {
        HighlightJs hljs = new HighlightJs();
        assertEquals("github-dark", hljs.getTheme());
        assertEquals("auto", hljs.getLanguage());
        assertEquals("", hljs.getCode());
        assertFalse(hljs.isShowLineNumbers());
        assertTrue(hljs.isUseJavaHeuristic());
    }

    @Test
    void constructorSetsCodeAndLanguage() {
        HighlightJs hljs = new HighlightJs("int x = 1;", "java");
        assertEquals("int x = 1;", hljs.getCode());
        assertEquals("java", hljs.getLanguage());
    }

    @Test
    void setThemeEnum() {
        HighlightJs hljs = new HighlightJs();
        hljs.setTheme(Theme.DRACULA);
        assertEquals("dracula", hljs.getTheme());
    }

    @Test
    void setThemeCustomString() {
        HighlightJs hljs = new HighlightJs();
        hljs.setTheme("base16/solarized-dark");
        assertEquals("base16/solarized-dark", hljs.getTheme());
    }

    @Test
    void nullCodeBecomesEmptyString() {
        HighlightJs hljs = new HighlightJs();
        hljs.setCode(null);
        assertEquals("", hljs.getCode());
    }

    @Test
    void nullLanguageFallsBackToAuto() {
        HighlightJs hljs = new HighlightJs();
        hljs.setLanguage(null);
        assertEquals("auto", hljs.getLanguage());
    }

    @Test
    void javaHeuristicCanBeDisabled() {
        HighlightJs hljs = new HighlightJs();
        hljs.setUseJavaHeuristic(false);
        assertFalse(hljs.isUseJavaHeuristic());
    }

    @Test
    void tagNameIsCorrect() {
        HighlightJs hljs = new HighlightJs();
        assertEquals("highlightjs-code", hljs.getElement().getTag());
    }
}
