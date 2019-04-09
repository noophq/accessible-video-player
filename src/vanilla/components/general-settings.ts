import generalSettingsView from "ejs-loader!lib/vanilla/views/general-settings.ejs";

import { BaseSettingsComponent } from "./base-settings";

export class GeneralSettingsComponent extends BaseSettingsComponent {
    public view = generalSettingsView;

    public async updateView(
        rootElement: HTMLElement,
        domElements: any,
        player: any,
    ): Promise<any> {
        super.updateView(rootElement, domElements, player);

        // Get elements
        const transcriptionInputElement = document.getElementById(
            "transcription-" + rootElement.id,
        ) as HTMLInputElement;
        const thumbnailInputElement = document.getElementById(
            "thumbnail-" + rootElement.id,
        ) as HTMLInputElement;
        const playerSettings = this.props.settings.player;

        // Apply settings to buttons
        const applySettings = () => {
            transcriptionInputElement.checked = playerSettings.transcription.enabled;
            thumbnailInputElement.checked = playerSettings.thumbnail.enabled;
        };

        // Handlers
        const transcriptionChangeHandler = (event: any) => {
            // Alert player about a settings change
            this.updateSettings(domElements, [
                ["player.transcription.enabled", event.target.checked]
            ]);
        }
        const thumbnailChangeHandler = (event: any) => {
            // Alert player about a settings change
            this.updateSettings(domElements, [
                ["player.thumbnail.enabled", event.target.checked]
            ]);
        }

        // Listeners
        this.eventRegistry.register(
            transcriptionInputElement,
            "change",
            transcriptionChangeHandler,
        );
        this.eventRegistry.register(
            thumbnailInputElement,
            "change",
            thumbnailChangeHandler,
        );
        this.registerLinkEvent(
            rootElement,
            domElements,
            "avp-display-settings-link",
            "displaySettings",
        );

        // Update UI
        applySettings();
    }
}
