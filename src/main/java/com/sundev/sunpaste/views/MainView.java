package com.sundev.sunpaste.views;

import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.data.value.ValueChangeMode;
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

        // ------------------------------------------------------------------
        // Interactive Example: Paste Code and Select Theme
        // ------------------------------------------------------------------

        // --- HighlightJs Component Initialization ---
        // Create a new instance of the HighlightJs component
        HighlightJs interactiveHighlightJs = new HighlightJs();
        // Set to occupy the full width of its container
        interactiveHighlightJs.setWidth("100%");
        // Display line numbers beside the code
        interactiveHighlightJs.setShowLineNumbers(true);
        // Let the component auto-detect the provided code language
        interactiveHighlightJs.setLanguage("auto"); // Enable auto-detection
        // Instruct the component to format the provided code
        interactiveHighlightJs.setFormatCode(true); // Enable formatting

        // --- Code Input Field Setup ---
        // Create an input area for the user to copy-paste code snippets
        TextArea codeInputField = new TextArea("Paste your code here");
        codeInputField.setWidth("100%");
        codeInputField.setMinHeight("150px");
        // Use LAZY mode so the component is updated as the user types with a slight delay
        codeInputField.setValueChangeMode(ValueChangeMode.LAZY);
        // Ensure that any input provided is passed into the HighlightJs component
        codeInputField.addValueChangeListener(e -> {
            interactiveHighlightJs.setCode(e.getValue() != null ? e.getValue() : "");
        });

        // --- Theme Selector Setup ---
        // Create a ComboBox to allow users to switch themes dynamically
        ComboBox<Theme> themeComboBox = new ComboBox<>("Select Theme");
        // Populate the combo box with available themes
        themeComboBox.setItems(Theme.values());
        // Display the standard enum name for each item
        themeComboBox.setItemLabelGenerator(Enum::name);

        // Apply the default dark theme (GITHUB_DARK) when initializing
        themeComboBox.setValue(Theme.GITHUB_DARK);
        interactiveHighlightJs.setTheme(Theme.GITHUB_DARK);

        // Update the HighlightJs component with the chosen theme when a selection is made
        themeComboBox.addValueChangeListener(e -> {
            if (e.getValue() != null) {
                interactiveHighlightJs.setTheme(e.getValue());
            }
        });

        // --- Layout Assembly ---
        // Place the theme selector inside a horizontal layout
        HorizontalLayout controlsLayout = new HorizontalLayout(themeComboBox);
        controlsLayout.setWidthFull();

        // Finally, add all created elements to the main VerticalLayout
        add(codeInputField, controlsLayout, interactiveHighlightJs);
    }
}
