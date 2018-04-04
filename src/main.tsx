import "reflect-metadata";

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as injectTapEventPlugin from "react-tap-event-plugin";

import { HashRouter } from "react-router-dom";

import { Store } from "redux";

import { App } from "app/components/App";

import { container } from "app/di";

// Render React App component
export function start() {
    // Needed for onTouchTap
    // http://stackoverflow.com/a/34015469/988941
    injectTapEventPlugin();

    ReactDOM.render(
        (
            <App/>
        ),
        document.getElementById("app"),
    );
}

export function init() {
    const store = container.get<Store<any>>("store");
}
