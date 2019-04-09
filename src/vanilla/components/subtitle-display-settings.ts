import subtitleDisplaySettingsView from "ejs-loader!lib/vanilla/views/subtitle-display-settings.ejs";

import { BaseSettingsComponent } from "./base-settings";

import { toggleElementAttribute, trapFocus, undoTrapFocus } from "lib/utils/dom";
import { initPopin, togglePopin } from "lib/utils/popin";

export class SubtitleDisplaySettingsComponent extends BaseSettingsComponent {
    public view = subtitleDisplaySettingsView;

    public registerViewData() {
        return {
            fontRadioItems: [
                {
                    id: "font-arial",
                    label: "Arial",
                    value: "arial",
                },
                {
                    id: "font-dyslexic",
                    label: "Open Dyslexic",
                    value: "dyslexic",
                },
            ],
            fontColorRadioItems: [
                {
                    id: "font-color-white",
                    label: "subtitleDisplaySettings.whiteColorLabel",
                    value: "white",
                },
                {
                    id: "font-color-black",
                    label: "subtitleDisplaySettings.blackColorLabel",
                    value: "black",
                },
                {
                    id: "font-color-yellow",
                    label: "subtitleDisplaySettings.yellowColorLabel",
                    value: "yellow",
                },
            ],
            bgColorRadioItems: [
                {
                    id: "font-bg-color-default",
                    label: "subtitleDisplaySettings.transparentBackgroundLabel",
                    value: "transparent",
                },
                {
                    id: "font-bg-color-black",
                    label: "subtitleDisplaySettings.blackBackgroundLabel",
                    value: "black",
                },
                {
                    id: "font-bg-color-white",
                    label: "subtitleDisplaySettings.whiteBackgroundLabel",
                    value: "white",
                },
            ],
        };
    }

    public async updateView(
        rootElement: HTMLElement,
        domElements: any,
        player: any
    ): Promise<void> {
        super.updateView(rootElement, domElements, player);
        const subtitleSettings = this.props.settings.subtitle;

        // Get dom elements
        const subtitleFontInputElements = document
            .getElementsByName("subtitle_font[" + rootElement.id + "]");
        const subtitleFontColorInputElements = document
            .getElementsByName("subtitle_font_color[" + rootElement.id + "]");
        const subtitleBgColorInputElements = document
            .getElementsByName("subtitle_bg_color[" + rootElement.id + "]");
        const scalingFactorElement = rootElement
            .getElementsByClassName("avp-font-size-scaling-factor")[0];
        const fontSizeDecreaseButtonElement = rootElement
            .getElementsByClassName("avp-font-size-decrease-button")[0];
        const fontSizeIncreaseButtonElement = rootElement
            .getElementsByClassName("avp-font-size-increase-button")[0];

        // Handlers
        const fontSizeDecreaseHandler = (event: any) => {
            this.updateSettings(domElements, [
                [
                    "subtitle.scalingFactor",
                    Math.max(subtitleSettings.scalingFactor - 0.5, 1),
                ]
            ]);
        };
        const fontSizeIncreaseHandler = (event: any) => {
            this.updateSettings(domElements, [
                [
                    "subtitle.scalingFactor",
                    Math.min(subtitleSettings.scalingFactor + 0.5, 3),
                ]
            ]);
        };

        // Listeners
        Array.prototype.forEach.call(subtitleFontInputElements, (element: any) => {
            const subtitleFontChangeHandler = (event: any) => {
                const newSubtitleFont = event.target.value as string;

                // Alert player about a settings change
                this.updateSettings(
                    domElements,
                    [
                        ["subtitle.font", newSubtitleFont.toUpperCase()],
                    ],
                );
            };
            this.eventRegistry.register(
                element,
                "change",
                subtitleFontChangeHandler,
            );
        });
        Array.prototype.forEach.call(subtitleFontColorInputElements, (element: any) => {
            const subtitleFontColorChangeHandler = (event: any) => {
                const newSubtitleFontColor = event.target.value as string;

                // Alert player about a settings change
                this.updateSettings(domElements, [
                    ["subtitle.fontColor", newSubtitleFontColor.toUpperCase()],
                ]);
            };
            this.eventRegistry.register(
                element,
                "change",
                subtitleFontColorChangeHandler,
            );
        });
        Array.prototype.forEach.call(subtitleBgColorInputElements, (element: any) => {
            const subtitleBgColorChangeHandler = (event: any) => {
                const newSubtitleFontBgColor = event.target.value as string;

                // Alert player about a settings change
                this.updateSettings(domElements, [
                    ["subtitle.backgroundColor", newSubtitleFontBgColor.toUpperCase()],
                ]);
            };
            this.eventRegistry.register(
                element,
                "change",
                subtitleBgColorChangeHandler,
            );
        });
        this.eventRegistry.register(
            fontSizeDecreaseButtonElement,
            "click",
            fontSizeDecreaseHandler,
        );
        this.eventRegistry.register(
            fontSizeIncreaseButtonElement,
            "click",
            fontSizeIncreaseHandler,
        );

        // Update radio buttons
        const selectedSubtitleFont = subtitleSettings.font.toLocaleLowerCase();
        Array.prototype.forEach.call(subtitleFontInputElements, (element: any) => {
            element.checked = (element.value === selectedSubtitleFont);
        });
        const selectedSubtitleFontColor = subtitleSettings.fontColor.toLocaleLowerCase();
        Array.prototype.forEach.call(subtitleFontColorInputElements, (element: any) => {
            element.checked = (element.value === selectedSubtitleFontColor);
        });
        const selectedSubtitleBgColor = subtitleSettings.backgroundColor.toLocaleLowerCase();
        Array.prototype.forEach.call(subtitleBgColorInputElements, (element: any) => {
            element.checked = (element.value === selectedSubtitleBgColor);
        });
        scalingFactorElement.innerHTML = "X" + subtitleSettings.scalingFactor;
    }
}
