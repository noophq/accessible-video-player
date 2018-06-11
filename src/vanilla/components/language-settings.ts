import languageSettingsView from "ejs-loader!lib/vanilla/views/language-settings.ejs";

import { PlayerEventType } from "lib/models/event";
import { LanguageType } from "lib/models/language";

import { BaseSettingsComponent } from "./base-settings";

export class LanguageSettingsComponent extends BaseSettingsComponent {
    public view = languageSettingsView;

    public registerViewData() {
        return {
            languageRadioItems: [
                {
                    id: "Language-default",
                    label: "languageSettings.defaultLanguageLabel",
                    value: "default",
                },
                {
                    id: "language-audio-description",
                    label: "languageSettings.audioDescriptionLanguageLabel",
                    value: "audio_description",
                },
                {
                    id: "language-cued-speech",
                    label: "languageSettings.cuedSpeechLanguageLabel",
                    value: "cued_speech",
                },
                {
                    id: "language-signed-language",
                    label: "languageSettings.signedLanguageLabel",
                    value: "signed_language",
                }
            ],
        };
    }

    public async updateView(
        rootElement: HTMLElement,
        domElements: any,
        player: any
    ): Promise<void> {
        super.updateView(rootElement, domElements, player);

        // Get dom elements
        const languageInputElements = document
            .getElementsByName("language[" + rootElement.id + "]");

        // Listeners
        Array.prototype.forEach.call(languageInputElements, (element: any) => {
            const languageChangeHandler = (event: any) => {
                const newLanguage = event.target.value as string;
                // Alert player about a settings change
                this.updateSettings(domElements, [
                    ["language.type", newLanguage.toUpperCase()]
                ]);
            };
            this.eventRegistry.register(
                element,
                "change",
                languageChangeHandler
            );
        });

        // Update radio buttons
        const selectedLanguage = this.props.settings.language.type.toLocaleLowerCase();

        Array.prototype.forEach.call(languageInputElements, (element: any) => {
            element.checked = (element.value === selectedLanguage);
        });
    }
}
