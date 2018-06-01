import { GlobalSettings } from "lib/models/settings";

import { DEFAULT_SETTINGS } from "lib/core/constants";

import { Player } from "lib/core/player";
import { Translator } from "lib/core/translator";
import { MarkerManager } from "lib/core/marker";
import { SettingsManager } from "lib/core/settings";

import { PlayerComponent } from "./components/player";

import { install as installPolyfills } from "lib/polyfill";
import { closeAllPopins }  from "lib/utils/popin";

import "lib/assets/css/player.css";
import { ComponentRenderer } from "app/vanilla/renderer";

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
    settings = {}
): Promise<any> {
    const newSettings: GlobalSettings = Object.assign(
        {},
        DEFAULT_SETTINGS,
        settings,
    );

    // Initialize player, marker manager, translator ant he others
    const markerManager = new MarkerManager();
    const i18n = new Translator(newSettings.locale);
    await i18n.initialize();
    const settingsManager = new SettingsManager(newSettings);
    const player = new Player(settingsManager);
    const avp = {
        i18n,
        markerManager,
        player,
        settingsManager,
    };

    // Render player
    const renderer = new ComponentRenderer(
        new PlayerComponent({ settings: newSettings }),
        i18n
    );
    containerElement.innerHTML = await renderer.render();
    await renderer.update();

    // Attach rendered HTML player to core player
    const playerElement = containerElement
        .getElementsByClassName("avp-player")[0] as HTMLElement;
    player.attachPlayer(playerElement);

    // Attach content
    const mainVideoContainerElement = containerElement
        .getElementsByClassName("avp-main-video-container")[0];
    const secondaryVideoContainerElement = containerElement
        .getElementsByClassName("avp-secondary-video-container")[0];
    const thumbnailContainerElement = containerElement
        .getElementsByClassName("avp-thumbnail-container")[0];
    const transcriptionContainerElement = containerElement
        .getElementsByClassName("avp-transcription-container")[0];
    player.attachContent(
        mainVideoContainerElement as HTMLElement,
        secondaryVideoContainerElement as HTMLElement,
        thumbnailContainerElement as HTMLElement,
        transcriptionContainerElement as HTMLElement
    );
    return avp;
}
