package com.sundev.sunpaste.views;

import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route("")
public class MainView extends VerticalLayout {

    public MainView() {
        // Set up the layout
        setAlignItems(Alignment.CENTER);
        setJustifyContentMode(JustifyContentMode.CENTER);
        setSizeFull();

        // Add components
        H1 title = new H1("Welcome to HighlightJS Vaadin Wrapper");
        Paragraph description = new Paragraph("This is the default view.");

        add(title, description);
    }
}

