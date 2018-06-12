import subtitleSettingsView from "ejs-loader!lib/vanilla/views/subtitle-settings.ejs";

import { AvpObject } from "lib/models/player";

import { BaseSettingsComponent } from "./base-settings";

import { toggleElementAttribute, trapFocus, undoTrapFocus } from "lib/utils/dom";
import { initPopin, togglePopin } from "lib/utils/popin";

export class SubtitleSettingsComponent extends BaseSettingsComponent {
    public view = subtitleSettingsView;

    public registerViewData() {
        return {
            subtitleRadioItems: [
                {
                    id: "subtitle-none",
                    label: "subtitleSettings.noneSubtitleLabel",
                    value: "none",
                },
                {
                    id: "subtitle-transcription",
                    label: "subtitleSettings.transcriptionSubtitleLabel",
                    value: "transcription",
                },
                {
                    id: "subtitle-closed-caption",
                    label: "subtitleSettings.closedCaptionSubtitleLabel",
                    value: "closed_caption",
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
        const subtitleInputElements = document
            .getElementsByName("subtitle[" + rootElement.id + "]");

        // Listeners
        Array.prototype.forEach.call(subtitleInputElements, (element: any) => {
            const subtitleChangeHandler = (event: any) => {
                const newSubtitle = event.target.value as string;

                // Alert player about a settings change
                this.updateSettings(domElements, [
                    ["subtitle.type", newSubtitle.toUpperCase()]
                ]);
            };
            this.eventRegistry.register(
                element,
                "change",
                subtitleChangeHandler
            );
        });

        // Update radio buttons
        const selectedSubtitle = this.props.settings.subtitle.type.toLocaleLowerCase();

        Array.prototype.forEach.call(subtitleInputElements, (element: any) => {
            element.checked = (element.value === selectedSubtitle);
        });
    }
}
