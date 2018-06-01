import playbackSpeedSettingsView from "ejs-loader!lib/vanilla/views/playback-speed-settings.ejs";

import { PlayerEventType } from "lib/models/event";

import { BaseSettingsComponent } from "./base-settings";

const SPEED_SLIDER_VALUES = [0.5, 0.75, 1, 1.25, 1.5];

export class PlaybackSpeedSettingsComponent extends BaseSettingsComponent {
    public view = playbackSpeedSettingsView;

    public async postDomUpdate(rootElement: HTMLElement, domElements: any): Promise<any> {
        await super.postDomUpdate(rootElement, domElements);
        const playerElement = domElements["origin"]["root"];
        //const mainVideoElement = domElements["mainVideo"]["video"];
        const speedInputElement = rootElement.getElementsByTagName("input")[0];

        const applySettings = () => {
            const speedValue = this.props.settings.video.playbackSpeed;
            const inputValue = SPEED_SLIDER_VALUES.indexOf(speedValue) + 1;
            //mainVideoElement.playbackRate = speedValue;
            (speedInputElement as any).value = inputValue;
        };

        // Handlers
        const refreshSettingsHandler = (event: any) => {
            applySettings();
        };
        const speedChangeHandler = (event: any) => {
            const inputValue = event.target.value as number;
            const speedValue = SPEED_SLIDER_VALUES[inputValue-1];
            this.props.settings.video.playbackSpeed = speedValue;
            //mainVideoElement.playbackRate = speedValue;
        };

        // Listeners
        this.eventRegistry.register(
            playerElement,
            PlayerEventType.UiRefreshRequest,
            refreshSettingsHandler
        );
        this.eventRegistry.register(
            speedInputElement,
            "change",
            speedChangeHandler
        );

        // Update UI
        applySettings();
    }
}
