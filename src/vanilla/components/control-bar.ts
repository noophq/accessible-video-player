import { MarkerEventType } from "lib/models/event";
import { dispatchEvent } from "lib/utils/event";

import controlBarView from "ejs-loader!lib/vanilla/views/control-bar.ejs";

import { BaseComponent, ComponentProperties } from "./base";
import { DisplaySettingsComponent } from "./display-settings";
import { GeneralSettingsComponent } from "./general-settings";
import { LanguageSettingsComponent } from "./language-settings";
import { PlaybackQualitySettingsComponent } from "./playback-quality-settings";
import { PlaybackSpeedSettingsComponent } from "./playback-speed-settings";
import { SubtitleDisplaySettingsComponent } from "./subtitle-display-settings";
import { SubtitleSettingsComponent } from "./subtitle-settings";

import { renderRangeSlider } from "lib/utils/range-slider";

import { initPopin, togglePopin } from "lib/utils/popin";
import { toPlayerTime } from "lib/utils/time";

export class ControlBarComponent extends BaseComponent<ComponentProperties> {
    public view = controlBarView;

    public registerChilds() {
        const backToDisplaySettingsProps = Object.assign(
            {},
            this.props,
            { backComponentName: "displaySettings" }
        );
        const backToGeneralSettingsProps = Object.assign(
            {},
            this.props,
            { backComponentName: "generalSettings" }
        );
        return {
            generalSettings: new GeneralSettingsComponent(this.props),
            displaySettings: new DisplaySettingsComponent(backToGeneralSettingsProps),
            languageSettings: new LanguageSettingsComponent(backToDisplaySettingsProps),
            subtitleSettings: new SubtitleSettingsComponent(backToDisplaySettingsProps),
            subtitleDisplaySettings: new SubtitleDisplaySettingsComponent(backToDisplaySettingsProps),
            playbackSpeedSettings: new PlaybackSpeedSettingsComponent(backToDisplaySettingsProps),
            playbackQualitySettings: new PlaybackQualitySettingsComponent(backToDisplaySettingsProps)
        };
    }

    public registerViewData() {
        return {
            currentVolume: 50,
        };
    }

    public async registerDomElements(rootElement: HTMLElement) {
        const getElement = (className: string): HTMLElement => {
            const finalClassName = "avp-control-bar-" + className;
            return rootElement
                .getElementsByClassName(finalClassName)[0] as HTMLElement;
        };

        // Buttons
        const playPauseButtonElement = getElement("play-pause");
        const markerButtonElement = getElement("marker");
        const volumeButtonElement = getElement("volume");
        const settingsButtonElement = getElement("settings");
        const fullscreenButtonElement = getElement("fullscreen");

        // Volume panel
        const volumePanelElement = getElement("volume-panel");
        const volumeInputElement = volumePanelElement.getElementsByTagName("input")[0];
        const volumeUpButtonElement = rootElement.getElementsByClassName("avp-volume-up-button")[0];
        const volumeDownButtonElement = rootElement.getElementsByClassName("avp-volume-down-button")[0];

        const rangeSliderElement = volumePanelElement.getElementsByClassName("avp-range-slider")[0];
        initPopin(volumePanelElement);
        renderRangeSlider(rangeSliderElement);

        return {
            volumeButton: volumeButtonElement,
            volumeUpButton: volumeUpButtonElement,
            volumeDownButton: volumeDownButtonElement,
            volumePanel: volumePanelElement,
            playPauseButton: playPauseButtonElement,
            volumeInput: volumeInputElement,
            settingsButton: settingsButtonElement,
            fullscreenButton: fullscreenButtonElement,
            markerButton: markerButtonElement,
        };
    }

    public async updateView(
        rootElement: HTMLElement,
        domElements: any,
        player: any,
    ) {
        // Clean all events
        this.eventRegistry.unregisterAll();

        // Retrieve dom elements
        const mainVideoElement = player.mainVideoContent.videoElement;
        const playerElement = domElements["origin"]["root"];
        const generalSettingsElement = domElements["generalSettings"]["root"];
        const volumeInputElement = domElements["controlBar"]["volumeInput"];
        const settingsButtonElement = domElements["controlBar"]["settingsButton"];
        const playPauseButtonElement = domElements["controlBar"]["playPauseButton"];
        const volumePanelElement = domElements["controlBar"]["volumePanel"];
        const volumeButtonElement = domElements["controlBar"]["volumeButton"];
        const volumeUpButtonElement = domElements["controlBar"]["volumeUpButton"];
        const volumeDownButtonElement = domElements["controlBar"]["volumeDownButton"];
        const markerButtonElement = domElements["controlBar"]["markerButton"];
        const fullscreenButtonElement = domElements["controlBar"]["fullscreenButton"];
        const totalTimeElement = rootElement.getElementsByClassName("avp-total-time")[0];
        const currentTimeElement = rootElement.getElementsByClassName("avp-current-time")[0];

        const translate = this.props.translator.translate.bind(this.props.translator);

        // Handlers
        // Set volume input to the current video volume
        const volumeChangeHandler = (event: any) => {
            volumeInputElement.value = (mainVideoElement.volume * 100) as any;
            volumeInputElement.setAttribute(
                "aria-valuetext",
                translate(
                    "controlBar.volumeDescription",
                    { volume: volumeInputElement.value },
                ),
            );
            dispatchEvent(volumeInputElement, "input");
        };
        volumeChangeHandler(null);

        const settingsButtonHandler = (event: any) => {
            togglePopin(generalSettingsElement, settingsButtonElement);
            event.stopPropagation();
        };
        const playPauseHandler = (event: any) => {
            if (mainVideoElement.paused) {
                mainVideoElement.play();
            } else {
                mainVideoElement.pause();
            }
        };
        const volumeSetHandler = (event: any) => {
            mainVideoElement.volume = event.target.value / 100;
            // volumeInputElement.setAttribute(
            //     "aria-valuetext",
            //     translate(
            //         "controlBar.volumeDescription",
            //         { volume: event.target.value },
            //     ),
            // );
        };
        const volumeButtonHandler = (event: any) => {
            togglePopin(volumePanelElement, volumeButtonElement);
            event.stopPropagation();
        };
        const volumeUpButtonHandler = () => {
            // Increase volume by 10%
            const newVolume = Math.min(mainVideoElement.volume + 0.1, 1);
            volumeUpButtonElement.setAttribute("aria-valuenow", "Volume " +  mainVideoElement.volume);
            mainVideoElement.volume = newVolume;
        };
        const volumeDownButtonHandler = () => {
            // Descrease volume by 10%
            const newVolume =  Math.max(mainVideoElement.volume - 0.1, 0);
            mainVideoElement.volume = newVolume;
            // volumeDownButtonElement.setAttribute(
            //     "aria-valuetext",
            //     translate(
            //         "controlBar.volumeDescription",
            //         { volume: volumeInputElement.value },
            //     ),
            // );
        };
        const updateTimeHandler = () => {
            currentTimeElement.innerHTML = toPlayerTime(mainVideoElement.currentTime * 1000);
            totalTimeElement.innerHTML = toPlayerTime(mainVideoElement.duration * 1000);
        };
        const fullscreenButtonHandler = () => {
            if (document.fullscreenEnabled &&
                (document as any).fullscreenElement === playerElement
            ) {
                document.exitFullscreen();
            } else {
                playerElement.requestFullscreen();
            }
        };
        const markerButtonHandler = (event: any) => {
            dispatchEvent(
                playerElement,
                MarkerEventType.AddFormDisplay,
            );
            event.stopPropagation();
        };

        // Listeners
        this.eventRegistry.register(
            settingsButtonElement,
            "click",
            settingsButtonHandler,
        );
        this.eventRegistry.register(
            playPauseButtonElement,
            "click",
            playPauseHandler,
        );
        this.eventRegistry.register(
            volumeInputElement,
            "input",
            volumeSetHandler,
        );
        this.eventRegistry.register(
            volumeUpButtonElement,
            "click",
            volumeUpButtonHandler,
        );
        this.eventRegistry.register(
            volumeDownButtonElement,
            "click",
            volumeDownButtonHandler,
        );
        this.eventRegistry.register(
            volumeButtonElement,
            "click",
            volumeButtonHandler,
        );
        this.eventRegistry.register(
            markerButtonElement,
            "click",
            markerButtonHandler,
        );
        this.eventRegistry.register(
            fullscreenButtonElement,
            "click",
            fullscreenButtonHandler,
        );
        this.eventRegistry.register(
            mainVideoElement,
            "volumechange",
            volumeChangeHandler,
        );
        this.eventRegistry.register(
            mainVideoElement,
            "timeupdate",
            updateTimeHandler,
        );
        this.eventRegistry.register(
            mainVideoElement,
            "loadedmetadata",
            updateTimeHandler,
        );
        updateTimeHandler();
    }
}
