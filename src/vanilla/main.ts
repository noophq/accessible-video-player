import { DEFAULT_SETTINGS } from "lib/core/constants";

import { MarkerManager } from "lib/core/marker";
import { Player } from "lib/core/player";
import { SettingsManager } from "lib/core/settings";
import { Translator } from "lib/vanilla/translator";

import { PlayerComponent } from "./components/player";

import { GlobalSettings } from "lib/models/settings";
import { install as installPolyfills } from "lib/polyfill";
import { closeAllPopins } from "lib/utils/popin";

import * as enTranslations from "app/resources/locales/en.json";
import * as frTranslations from "app/resources/locales/fr.json";

import { SkinSettings } from "app/vanilla/models/skin";
import { ComponentRenderer } from "app/vanilla/renderer";

import "lib/assets/css/player.css";

// Install polyfills
installPolyfills();

const popinCloseHandler = (event: any) => {
    if (event.key && event.key !== "Escape") {
        return;
    }

    closeAllPopins();
};

document.addEventListener(
    "click",
    popinCloseHandler,
);
document.addEventListener(
    "keydown",
    popinCloseHandler,
);

export async function init(
    containerElement: HTMLElement,
    settings = {},
    skinSettings = {},
): Promise<any> {
    const newSettings: GlobalSettings = Object.assign(
        {},
        DEFAULT_SETTINGS,
        settings,
    );

    const newSkinSettings: SkinSettings = Object.assign(
        {},
        {
            name: "default",
            i18n: {
                locale: "en",
                catalogs: [
                    {
                        locale: "en",
                        translations: enTranslations,
                    },
                    {
                        locale: "fr",
                        translations: frTranslations,
                    },
                ],
            },
        },
        skinSettings,
    );

    // Initialize player, marker manager, translator ant he others
    const markerManager = new MarkerManager();
    const translator = new Translator(newSkinSettings.i18n.locale);
    await translator.initialize(newSkinSettings.i18n.catalogs);
    const settingsManager = new SettingsManager(newSettings);
    const player = new Player(
        settingsManager,
        markerManager,
    );
    const avp = {
        translator,
        markerManager,
        player,
        settingsManager,
    };

    // Render player
    const renderer = new ComponentRenderer(
        new PlayerComponent({
            settings: newSettings,
            skinSettings: newSkinSettings,
        }),
        translator,
        newSkinSettings.renderer,
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
        transcriptionContainerElement as HTMLElement,
        thumbnailContainerElement as HTMLElement,
    );
    return avp;
}
