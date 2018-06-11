import playbackSpeedSettingsView from "ejs-loader!lib/vanilla/views/playback-speed-settings.ejs";

import { PlayerEventType } from "lib/models/event";

import { BaseSettingsComponent } from "./base-settings";

const AVAILABLE_SPEED_VALUES = [0.5, 0.75, 1, 1.25, 1.5];

export class PlaybackSpeedSettingsComponent extends BaseSettingsComponent {
    public view = playbackSpeedSettingsView;

    public async updateView(
        rootElement: HTMLElement,
        domElements: any,
        player: any
    ): Promise<any> {
        super.updateView(rootElement, domElements, player);
        const playbackSpeed = this.props.settings.video.playbackSpeed;
        let currentSpeedIndex = AVAILABLE_SPEED_VALUES.indexOf(playbackSpeed);

        if (currentSpeedIndex === -1) {
            // Unable to find current speed reinitialize
            currentSpeedIndex = 1;
        }

        // Get dom elements
        const speedFactorElement = rootElement
            .getElementsByClassName("avp-speed-factor")[0];
        const speedDecreaseButtonElement = rootElement
            .getElementsByClassName("avp-speed-decrease-button")[0];
        const speedIncreaseButtonElement = rootElement
            .getElementsByClassName("avp-speed-increase-button")[0];

        // Handlers
        const speedDecreaseHandler = (event: any) => {
            if (currentSpeedIndex === 0) {
                // Could not decrease anymore
                return;
            }
            this.updateSettings(domElements, [
                [
                    "video.playbackSpeed",
                    AVAILABLE_SPEED_VALUES[currentSpeedIndex-1]
                ]
            ]);
        };
        const speedIncreaseHandler = (event: any) => {
            if (currentSpeedIndex === AVAILABLE_SPEED_VALUES.length-1) {
                // Could not increase anymore
                return;
            }
            this.updateSettings(domElements, [
                [
                    "video.playbackSpeed",
                    AVAILABLE_SPEED_VALUES[currentSpeedIndex+1]
                ]
            ]);
        };
        this.eventRegistry.register(
            speedDecreaseButtonElement,
            "click",
            speedDecreaseHandler
        );
        this.eventRegistry.register(
            speedIncreaseButtonElement,
            "click",
            speedIncreaseHandler
        );

        // Set speed factor
        speedFactorElement.innerHTML = "X" + playbackSpeed;
    }
}
