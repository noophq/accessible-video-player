import playbackQualitySettingsView from "ejs-loader!lib/vanilla/views/playback-quality-settings.ejs";

import { BaseSettingsComponent } from "./base-settings";

export class PlaybackQualitySettingsComponent extends BaseSettingsComponent {
    public view = playbackQualitySettingsView;
    protected backComponentName = "displaySettings";

    public registerViewData() {
        return {
            qualityRadioItems: [
                {
                    id: "quality-auto",
                    label: "playbackQualitySettings.autoLabel",
                    value: "auto",
                },
                {
                    id: "quality-240",
                    label: "playbackQualitySettings.240Label",
                    value: "240",
                },
                {
                    id: "quality-360",
                    label: "playbackQualitySettings.360Label",
                    value: "360",
                },
                {
                    id: "quality-480",
                    label: "playbackQualitySettings.480Label",
                    value: "480",
                },
                {
                    id: "quality-720",
                    label: "playbackQualitySettings.720Label",
                    value: "720",
                },
                {
                    id: "quality-1080",
                    label: "playbackQualitySettings.1080Label",
                    value: "1080",
                },
            ],
        };
    }

    public async updateView(
        rootElement: HTMLElement,
        domElements: any,
        player: any,
    ): Promise<void> {
        super.updateView(rootElement, domElements, player);
        const availablequalities = this.props.settings.video.availableQualities;
        const currentQuality = this.props.settings.video.quality;

        // Get dom elements
        const availableQualityInputElements = document
            .getElementsByName("video_quality[" + rootElement.id + "]");

        Array.prototype.forEach.call(availableQualityInputElements, (element: any) => {
            if (availablequalities.indexOf(element.value.toUpperCase()) < 0) {
                // Hide this quality
                element.parentNode.classList.add("avp-disabled");
            } else {
                element.parentNode.classList.remove("avp-disabled");
            }

            if (element.value.toUpperCase() === currentQuality) {
                element.checked = true;
            } else {
                element.checked = false;
            }

            const qualityChangeHandler = (event: any) => {
                const newQuality = event.target.value as string;

                // Alert player about a settings change
                this.updateSettings(domElements, [
                    ["video.quality", newQuality.toUpperCase()]
                ]);
            };
            this.eventRegistry.register(
                element,
                "change",
                qualityChangeHandler,
            );
        });
    }
}
