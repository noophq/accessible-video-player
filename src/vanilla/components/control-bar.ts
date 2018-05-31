import { PlayerEventType } from "lib/models/event";
import { EventRegistry } from "lib/listeners/registry";
import { AvpObject } from "lib/models/player";

import pauseIcon from "app/assets/icons/pause.svg";
import playIcon from "app/assets/icons/play.svg";
import markerIcon from "app/assets/icons/marker.svg";
import volumeOnIcon from "app/assets/icons/volume-on.svg";
import fullscreenOffIcon from "app/assets/icons/fullscreen-off.svg";
import settingsIcon from "app/assets/icons/settings.svg";

import controlBarView from "ejs-loader!lib/vanilla/views/control-bar.ejs";

import { BaseComponent } from "./base";
import { GeneralSettingsComponent } from "./general-settings";
import { DisplaySettingsComponent } from "./display-settings";
import { LanguageSettingsComponent } from "./language-settings";
import { SubtitleSettingsComponent } from "./subtitle-settings";
import { SubtitleDisplaySettingsComponent } from "./subtitle-display-settings";
import { PlaybackSpeedSettingsComponent } from "./playback-speed-settings";
import { PlaybackQualitySettingsComponent } from "./playback-quality-settings";

import { renderRangeSlider } from "lib/utils/range-slider";
import { initPopin, togglePopin } from "lib/utils/popin";

export class ControlBarComponent extends BaseComponent {
    constructor(avp: AvpObject) {
        super(avp, controlBarView);
    }

    public registerChilds() {
        return {
            generalSettings: new GeneralSettingsComponent(this.avp),
            displaySettings: new DisplaySettingsComponent(this.avp),
            languageSettings: new LanguageSettingsComponent(this.avp),
            subtitleSettings: new SubtitleSettingsComponent(this.avp),
            subtitleDisplaySettings: new SubtitleDisplaySettingsComponent(this.avp),
            playbackSpeedSettings: new PlaybackSpeedSettingsComponent(this.avp),
            playbackQualitySettings: new PlaybackQualitySettingsComponent(this.avp)
        };
    }

    public registerViewData() {
        return {
            pauseIcon,
            playIcon,
            markerIcon,
            volumeIcon: volumeOnIcon,
            enterFullscreenIcon: fullscreenOffIcon,
            settingsIcon,
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
        const playButtonElement = getElement("play");
        const pauseButtonElement = getElement("pause");
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

        // Handlers
        const volumeButtonHandler = (event: any) => {
            togglePopin(volumePanelElement, volumeButtonElement);
            event.stopPropagation();
        };

        // Listeners
        this.eventRegistry.register(
            volumeButtonElement,
            "click",
            volumeButtonHandler,
        );

        return {
            playButton: playButtonElement,
            pauseButton: pauseButtonElement,
            volumeInput: volumeInputElement,
            settingsButton: settingsButtonElement
        };
    }

    public async postDomUpdate(rootElement: HTMLElement, domElements: any): Promise<any> {
        const mainVideoElement =  domElements["mainVideo"]["video"];
        const generalSettingsElement = domElements["generalSettings"]["root"];
        const volumeInputElement = domElements["controlBar"]["volumeInput"];
        const settingsButtonElement = domElements["controlBar"]["settingsButton"];
        const playButtonElement = domElements["controlBar"]["playButton"];
        const pauseButtonElement = domElements["controlBar"]["pauseButton"];

        // Handlers
        const volumeChangeHandler = (event: any) => {
            volumeInputElement.value = (event.target.volume * 100) as any;
        };
        const settingsButtonHandler = (event: any) => {
            togglePopin(generalSettingsElement, settingsButtonElement);
            event.stopPropagation();
        }
        const playHandler = (event: any) => {
            mainVideoElement.play();
        };
        const pauseHandler = (event: any) => {
            mainVideoElement.pause();
        };
        const volumeSetHandler = (event: any) => {
            mainVideoElement.volume = event.target.value / 100;
        };

        // Listeners
        this.eventRegistry.register(
            mainVideoElement,
            "volumechange",
            volumeChangeHandler
        );
        this.eventRegistry.register(
            settingsButtonElement,
            "click",
            settingsButtonHandler,
        );
        this.eventRegistry.register(
            playButtonElement,
            "click",
            playHandler
        );
        this.eventRegistry.register(
            pauseButtonElement,
            "click",
            pauseHandler
        );
        this.eventRegistry.register(
            volumeInputElement,
            "input",
            volumeSetHandler
        );

        // Set volume input to the current video volume
        volumeInputElement.value = (mainVideoElement.volume * 100) as any;
    }
}
