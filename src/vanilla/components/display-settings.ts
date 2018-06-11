import displaySettingsView from "ejs-loader!lib/vanilla/views/display-settings.ejs";

import { BaseSettingsComponent } from "./base-settings";

export class DisplaySettingsComponent extends BaseSettingsComponent {
    public view = displaySettingsView;

    public async updateView(
        rootElement: HTMLElement,
        domElements: any,
        player: any,
    ): Promise<any> {
        super.updateView(rootElement, domElements, player);
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
