import displaySettingsView from "ejs-loader!lib/vanilla/views/display-settings.ejs";

import { EventRegistry } from "lib/listeners/registry";
import { AvpObject } from "lib/models/player";

import { BaseSettingsComponent } from "./base-settings";

export class DisplaySettingsComponent extends BaseSettingsComponent {
    constructor(avp: AvpObject) {
        super(avp, displaySettingsView, "generalSettings");
    }

    public async postDomUpdate(rootElement: HTMLElement, domElements: any): Promise<any> {
        super.postDomUpdate(rootElement, domElements);
        this.registerLinkEvent(
            rootElement,
            domElements,
            "avp-language-settings-link",
            "languageSettings"
        );
        this.registerLinkEvent(
            rootElement,
            domElements,
            "avp-subtitle-settings-link",
            "subtitleSettings"
        );
        this.registerLinkEvent(
            rootElement,
            domElements,
            "avp-subtitle-display-settings-link",
            "subtitleDisplaySettings"
        );
        this.registerLinkEvent(
            rootElement,
            domElements,
            "avp-playback-speed-settings-link",
            "playbackSpeedSettings"
        );
        this.registerLinkEvent(
            rootElement,
            domElements,
            "avp-playback-quality-settings-link",
            "playbackQualitySettings"
        );
    }
}
