import { GlobalSettings } from "lib/models/settings";
import { PlayerData } from "lib/models/player";

import { DEFAULT_DATA, DEFAULT_SETTINGS } from "lib/core/constants";

import { Player } from "lib/core/player";
import { Translator } from "lib/core/translator";
import { MarkerManager } from "lib/core/marker";

import { PlayerComponent } from "./components/player";

import { install as installPolyfills } from "lib/polyfill";
import { closeAllPopins }  from "lib/utils/popin";

import "lib/assets/css/player.css";

// Install polyfills
installPolyfills();

const popinCloseHandler = (event: any) => {
    if (event.key && event.key != "Escape") {
        return;
    }

    closeAllPopins();
};

window.addEventListener(
    "click",
    popinCloseHandler,
);
window.addEventListener(
    "keydown",
    popinCloseHandler,
);

export async function init(
    containerElement: HTMLElement,
    data: PlayerData,
    settings = {}
): Promise<any> {
    const newData = Object.assign({}, DEFAULT_DATA, data);
    const newSettings: GlobalSettings = Object.assign(
        {},
        DEFAULT_SETTINGS,
        settings,
    );

    // Initialize player, marker manager, transaltor ant he others
    const player = new Player();
    const markerManager = new MarkerManager();
    markerManager.markers = newData.markers;
    const i18n = new Translator(newSettings.locale);
    await i18n.initialize();
    const avp = {
        i18n,
        markerManager,
        player,
        settings: newSettings,
    };

    // Initialize renderer
    const playerRenderer = new PlayerComponent(
        avp,
        newData,
        containerElement,
    );
    await playerRenderer.render();
    return avp;
}
