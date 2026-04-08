package com.sundev.sunpaste.views;

import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;
import com.sundev.sunpaste.highlightJS.HighlightJs;
import com.sundev.sunpaste.util.Theme;

/**
 * Demo view showing how to use the HighlightJs add-on in a Spring Boot / Vaadin app.
 *
 * Accessible at http://localhost:8080/
 */
@Route("")
public class MainView extends VerticalLayout {

    public MainView() {
        // --- View Configuration ---
        // Set basic layout properties for the view
        setSpacing(true);
        setPadding(true);
        setMaxWidth("900px");
        // Center the view on the screen horizontally
        getStyle().set("margin", "0 auto");

        // Add a primary heading for the page
        add(new H2("HighlightJs Vaadin Add-on"));

        // --- Interactive Example: Theme Selection and Unified Code Area ---
        // ------------------------------------------------------------------

        // --- HighlightJs Component Initialization ---
        HighlightJs interactiveHighlightJs = new HighlightJs();
        interactiveHighlightJs.setWidth("100%");
        interactiveHighlightJs.setShowLineNumbers(true);
        interactiveHighlightJs.setLanguage("auto");
        interactiveHighlightJs.setFormatCode(true);

        // --- Theme Selector Setup ---
        ComboBox<Theme> themeComboBox = new ComboBox<>("Select Theme");
        themeComboBox.setItems(Theme.values());
        themeComboBox.setItemLabelGenerator(Enum::name);
        themeComboBox.setValue(Theme.GITHUB_DARK);
        interactiveHighlightJs.setTheme(Theme.GITHUB_DARK);

        themeComboBox.addValueChangeListener(e -> {
            if (e.getValue() != null) {
                interactiveHighlightJs.setTheme(e.getValue());
            }
        });

        // --- Layout Assembly ---
        HorizontalLayout controlsLayout = new HorizontalLayout(themeComboBox);
        controlsLayout.setWidthFull();

        add(controlsLayout, interactiveHighlightJs);
    }
}
