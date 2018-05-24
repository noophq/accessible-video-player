import * as React from "react";
import * as ReactDOM from "react-dom";
import * as injectTapEventPlugin from "react-tap-event-plugin";

import { HashRouter } from "react-router-dom";

import { App } from "app/react/components/App";

import * as polyfill from "app/polyfill";

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
    // Install polyfills
    console.log("Install fullscreen");
    polyfill.install();
}
