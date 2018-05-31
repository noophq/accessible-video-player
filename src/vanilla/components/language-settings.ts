import languageSettingsView from "ejs-loader!lib/vanilla/views/language-settings.ejs";

import { PlayerEventType } from "lib/models/event";
import { EventRegistry } from "lib/listeners/registry";
import { AvpObject } from "lib/models/player";
import { LanguageType } from "lib/models/language";

import { BaseSettingsComponent } from "./base-settings";

export class LanguageSettingsComponent extends BaseSettingsComponent {
    constructor(avp: AvpObject) {
        super(avp, languageSettingsView, "displaySettings");
    }

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

    public async postDomUpdate(rootElement: HTMLElement, domElements: any): Promise<any> {
        await super.postDomUpdate(rootElement, domElements);
        const playerElement = domElements["origin"]["root"];
        const languageInputElements = document
            .getElementsByName("language[" + rootElement.id + "]");

        const applySettings = () => {
            const selectedLanguage = this.avp.settingsManager.settings.language.type.toLocaleLowerCase();

            Array.prototype.forEach.call(languageInputElements, (element: any) => {
                element.checked = (element.value === selectedLanguage);
            });
        };

        // Handlers
        const refreshSettingsHandler = (event: any) => {
            applySettings();
        };

        // Listeners
        this.eventRegistry.register(
            playerElement,
            PlayerEventType.UiRefreshRequest,
            refreshSettingsHandler
        );

        Array.prototype.forEach.call(languageInputElements, (element: any) => {
            const languageChangeHandler = (event: any) => {
                const newLanguage = event.target.value as string;
                (this.avp.settingsManager.settings.language as any).type = newLanguage.toUpperCase();
            };
            this.eventRegistry.register(
                element,
                "change",
                languageChangeHandler
            );
        });

        // Update UI
        applySettings();
    }
}
