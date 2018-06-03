import generalSettingsView from "ejs-loader!lib/vanilla/views/general-settings.ejs";

import { PlayerEventType, SettingsEventType } from "lib/models/event";

import { dispatchEvent } from "lib/utils/event";

import { BaseSettingsComponent } from "./base-settings";

export class GeneralSettingsComponent extends BaseSettingsComponent {
    public view = generalSettingsView;

    public async postDomUpdate(rootElement: HTMLElement, domElements: any): Promise<any> {
        super.postDomUpdate(rootElement, domElements);
        const playerElement = domElements["origin"]["root"];
        const transcriptionInputElement = document.getElementById(
            "transcription-" + rootElement.id
        ) as HTMLInputElement;
        const thumbnailInputElement = document.getElementById(
            "thumbnail-" + rootElement.id
        ) as HTMLInputElement;
        const playerSettings = this.props.settings.player;

        const applySettings = () => {
            transcriptionInputElement.checked = playerSettings.transcription.enabled;
            thumbnailInputElement.checked = playerSettings.thumbnail.enabled;
        };

        // Handlers
        const refreshSettingsHandler = (event: any) => {
            applySettings();
        };

        const transcriptionChangeHandler = (event: any) => {
            playerSettings.transcription.enabled = event.target.checked;

            // Alert player about a settings change
            this.updateSettings(domElements, [
                ["player.transcription.enabled", true]
            ]);
        }
        const thumbnailChangeHandler = (event: any) => {
            playerSettings.thumbnail.enabled = event.target.checked;

            // Alert player about a settings change
            this.updateSettings(domElements, [
                ["player.thumbnail.enabled", true]
            ]);
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
