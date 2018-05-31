import generalSettingsView from "ejs-loader!lib/vanilla/views/general-settings.ejs";

import { PlayerEventType } from "lib/models/event";
import { AvpObject } from "lib/models/player";

import { BaseSettingsComponent } from "./base-settings";

export class GeneralSettingsComponent extends BaseSettingsComponent {
    constructor(avp: AvpObject) {
        super(avp, generalSettingsView);
    }

    public async postDomUpdate(rootElement: HTMLElement, domElements: any): Promise<any> {
        const playerElement = domElements["origin"]["root"];
        const transcriptionInputElement = document.getElementById(
            "transcription-" + rootElement.id
        ) as HTMLInputElement;
        const thumbnailInputElement = document.getElementById(
            "thumbnail-" + rootElement.id
        ) as HTMLInputElement;
        const playerSettings = this.avp.settingsManager.settings.player;

        const applySettings = () => {
            transcriptionInputElement.checked = playerSettings.transcription.enabled;
            thumbnailInputElement.checked = playerSettings.thumbnail.enabled;
        };

        // Handlers
        const refreshSettingsHandler = (event: any) => {
            applySettings();
        };
        const transcriptionChangeHandler = (event: any) => {
            console.log("transcription", event.target.checked);
            playerSettings.transcription.enabled = event.target.checked;
        }
        const thumbnailChangeHandler = (event: any) => {
            console.log("thumbnail", event.target.checked);
            playerSettings.thumbnail.enabled = event.target.checked;
        }

        // Listeners
        this.eventRegistry.register(
            playerElement,
            PlayerEventType.UiRefreshRequest,
            refreshSettingsHandler
        );
        this.eventRegistry.register(
            transcriptionInputElement,
            "change",
            transcriptionChangeHandler
        );
        this.eventRegistry.register(
            thumbnailInputElement,
            "change",
            thumbnailChangeHandler
        );
        this.registerLinkEvent(
            rootElement,
            domElements,
            "avp-display-settings-link",
            "displaySettings"
        );

        // Update UI
        applySettings();
    }
}
