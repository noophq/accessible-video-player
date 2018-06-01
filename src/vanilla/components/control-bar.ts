import { PlayerEventType } from "lib/models/event";
import { EventRegistry } from "lib/event/registry";
import { AvpObject } from "lib/models/player";

import controlBarView from "ejs-loader!lib/vanilla/views/control-bar.ejs";

import { BaseComponent, ComponentProperties } from "./base";
import { GeneralSettingsComponent } from "./general-settings";
import { DisplaySettingsComponent } from "./display-settings";
import { LanguageSettingsComponent } from "./language-settings";
import { SubtitleSettingsComponent } from "./subtitle-settings";
import { SubtitleDisplaySettingsComponent } from "./subtitle-display-settings";
import { PlaybackSpeedSettingsComponent } from "./playback-speed-settings";
import { PlaybackQualitySettingsComponent } from "./playback-quality-settings";

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
            currentVolume: 50
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
        const enterFullscreenButtonElement = getElement("enter-fullscreen");

        // Volume panel
        const volumePanelElement = getElement("volume-panel");
        const volumeInputElement = volumePanelElement.getElementsByTagName("input")[0];
        const rangeSliderElement = volumePanelElement.getElementsByClassName("avp-range-slider")[0];
        initPopin(volumePanelElement);
        renderRangeSlider(rangeSliderElement);

        return {
            volumeButton: volumeButtonElement,
            volumePanel: volumePanelElement,
            playPauseButton: playPauseButtonElement,
            volumeInput: volumeInputElement,
            settingsButton: settingsButtonElement
        };
    }

    public async postDomUpdate(rootElement: HTMLElement, domElements: any): Promise<any> {
        const playerElement = domElements["origin"]["root"];

        // Handlers
        const contentLoadedHandler = (event: any) => {
            const mainVideoElement = event.player.mainVideoContent.videoElement;
            this.registerMainVideoElement(rootElement, domElements, mainVideoElement);
        }

        // Listeners
        this.eventRegistry.register(
            playerElement,
            PlayerEventType.ContentLoaded,
            contentLoadedHandler
        );
    }

    private registerMainVideoElement(
        rootElement: HTMLElement,
        domElements: any,
        mainVideoElement: HTMLVideoElement
    ) {
        // Clean all events
        this.eventRegistry.unregisterAll();

        // Register new events
        const generalSettingsElement = domElements["generalSettings"]["root"];
        const volumeInputElement = domElements["controlBar"]["volumeInput"];
        const settingsButtonElement = domElements["controlBar"]["settingsButton"];
        const playPauseButtonElement = domElements["controlBar"]["playPauseButton"];
        const volumePanelElement = domElements["controlBar"]["volumePanel"];
        const volumeButtonElement = domElements["controlBar"]["volumeButton"];
        const totalTimeElement = rootElement.getElementsByClassName("avp-total-time")[0];
        const currentTimeElement = rootElement.getElementsByClassName("avp-current-time")[0];

        // Handlers
        // Set volume input to the current video volume
        volumeInputElement.value = (mainVideoElement.volume * 100) as any;

        const volumeChangeHandler = (event: any) => {
            volumeInputElement.value = (event.target.volume * 100) as any;
        };

        const settingsButtonHandler = (event: any) => {
            togglePopin(generalSettingsElement, settingsButtonElement);
            event.stopPropagation();
        }
        const playPauseHandler = (event: any) => {
            if (mainVideoElement.paused) {
                mainVideoElement.play();
            } else {
                mainVideoElement.pause();
            }
        };
        const volumeSetHandler = (event: any) => {
            mainVideoElement.volume = event.target.value / 100;
        };
        const volumeButtonHandler = (event: any) => {
            togglePopin(volumePanelElement, volumeButtonElement);
            event.stopPropagation();
        };

        const updateTimeHandler = () => {
            currentTimeElement.innerHTML = toPlayerTime(mainVideoElement.currentTime*1000);
            totalTimeElement.innerHTML = toPlayerTime(mainVideoElement.duration*1000);
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
            playPauseHandler
        );
        this.eventRegistry.register(
            volumeInputElement,
            "input",
            volumeSetHandler
        );
        this.eventRegistry.register(
            volumeButtonElement,
            "click",
            volumeButtonHandler,
        );
        this.eventRegistry.register(
            mainVideoElement,
            "volumechange",
            volumeChangeHandler
        );
        this.eventRegistry.register(
            mainVideoElement,
            "timeupdate",
            updateTimeHandler
        );
        this.eventRegistry.register(
            mainVideoElement,
            "loadedmetadata",
            updateTimeHandler
        );
    }
}
