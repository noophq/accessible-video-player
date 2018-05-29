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
    private eventRegistry: EventRegistry;
    private controlBarElement: HTMLDivElement;
    private playButtonElement: HTMLButtonElement;
    private pauseButtonElement: HTMLButtonElement;
    private markerButtonElement: HTMLButtonElement;
    private volumeButtonElement: HTMLButtonElement;
    private volumeInputElement: HTMLInputElement;
    private settingsButtonElement: HTMLButtonElement;
    private enterFullscreenButtonElement: HTMLButtonElement;
    private exitFullscreenButtonElement: HTMLButtonElement;
    private volumePopinElement: HTMLDivElement;
    private settingsComponents: any;

    private playingChangeHandler: any;
    private playHandler: any;
    private pauseHandler: any;
    private volumeSetHandler: any;
    private volumeButtonHandler: any;
    private settingsButtonHandler: any;

    constructor(avp: AvpObject) {
        super(avp);
        this.initializeHandlers();
        this.initializeChildComponents();
    }

    private initializeHandlers() {
        this.eventRegistry = new EventRegistry();
        this.playHandler = this.avp.player.play.bind(this.avp.player);
        this.pauseHandler = this.avp.player.pause.bind(this.avp.player);

        this.volumeSetHandler = (event: any) => {
            this.avp.player.volume = event.target.value;
        };

        this.volumeButtonHandler = (event: any) => {
            togglePopin(this.volumePopinElement, this.volumeButtonElement);
            event.stopPropagation();
        };

        this.playingChangeHandler = (event: any) => {
            if (event.target.paused) {
                this.controlBarElement.classList.remove("avp-playing");
            } else {
                this.controlBarElement.classList.add("avp-playing");
            }
        };

        this.settingsButtonHandler = (event: any) => {
            this.settingsComponents["generalSettings"].toggleDisplay(this.settingsButtonElement);
            event.stopPropagation();
        };
    }

    private initializeChildComponents() {
        // Initialize and register settings components
        this.settingsComponents = {
            generalSettings: new GeneralSettingsComponent(this.avp),
            displaySettings: new DisplaySettingsComponent(this.avp),
            languageSettings: new LanguageSettingsComponent(this.avp),
            subtitleSettings: new SubtitleSettingsComponent(this.avp),
            subtitleDisplaySettings: new SubtitleDisplaySettingsComponent(this.avp),
            playbackSpeedSettings: new PlaybackSpeedSettingsComponent(this.avp),
            playbackQualitySettings: new PlaybackQualitySettingsComponent(this.avp)
        }

        // Attach components
        Object.values(this.settingsComponents).forEach((component: any) => {
            component.attachComponents(this.settingsComponents);
        });
    }

    public async render(): Promise<any> {
        // Render Settings
        const generalSettings = await this.settingsComponents["generalSettings"].render();
        const displaySettings = await this.settingsComponents["displaySettings"].render();
        const languageSettings = await this.settingsComponents["languageSettings"].render();
        const subtitleSettings = await this.settingsComponents["subtitleSettings"].render();
        const subtitleDisplaySettings = await this.settingsComponents["subtitleDisplaySettings"].render();
        const playbackSpeedSettings = await this.settingsComponents["playbackSpeedSettings"].render();
        const playbackQualitySettings = await this.settingsComponents["playbackQualitySettings"].render();

        return controlBarView(this.prepareViewData({
            pauseIcon,
            playIcon,
            markerIcon,
            volumeIcon: volumeOnIcon,
            enterFullscreenIcon: fullscreenOffIcon,
            settingsIcon,
            currentVolume: 50,
            generalSettings,
            displaySettings,
            languageSettings,
            subtitleSettings,
            subtitleDisplaySettings,
            playbackSpeedSettings,
            playbackQualitySettings
        }));
    }

    private getControlBarElement(name: string): any {
        const className = "avp-control-bar-" + name;
        return this.controlBarElement.getElementsByClassName(className)[0] as any;
    }

    public async postRender(): Promise<any> {
        this.controlBarElement = document.getElementById(this.id) as HTMLDivElement;
        this.playButtonElement = this.getControlBarElement("play");
        this.pauseButtonElement = this.getControlBarElement("pause");
        this.markerButtonElement = this.getControlBarElement("marker");
        this.volumeButtonElement = this.getControlBarElement("volume");
        this.settingsButtonElement = this.getControlBarElement("settings");
        this.enterFullscreenButtonElement = this.getControlBarElement("enter-fullscreen");

        // Volume panel
        this.volumePopinElement = this.getControlBarElement("volume-panel");
        initPopin(this.volumePopinElement);
        const rangeSliderElement = this.volumePopinElement.getElementsByClassName("avp-range-slider")[0];
        this.volumeInputElement = this.volumePopinElement.getElementsByTagName("input")[0];
        renderRangeSlider(rangeSliderElement);

        // Post render settings components and attach some elements
        for (const component of Object.values(this.settingsComponents) as any[]) {
            await component.postRender();
            component.attachElements({
                settingsButton: this.settingsButtonElement
            });
        }
    }

    public bindVideo(videoElement: HTMLVideoElement) {
        this.eventRegistry.register(
            this.playButtonElement,
            "click",
            this.playHandler
        );
        this.eventRegistry.register(
            this.pauseButtonElement,
            "click",
            this.pauseHandler
        );
        this.eventRegistry.register(
            this.volumeInputElement,
            "input",
            this.volumeSetHandler
        );
        this.eventRegistry.register(
            this.volumeButtonElement,
            "click",
            this.volumeButtonHandler,
        );
        this.eventRegistry.register(
            this.settingsButtonElement,
            "click",
            this.settingsButtonHandler,
        );
        this.eventRegistry.register(
            videoElement,
            PlayerEventType.PLAYING_CHANGE,
            this.playingChangeHandler
        );
    }
}
