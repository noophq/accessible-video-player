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
    private generalSettingsComponent: any;
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
            this.generalSettingsComponent.toggleDisplay(this.settingsButtonElement);
            event.stopPropagation();
        };
    }

    private initializeChildComponents() {
        // Initialize settings renderers
        this.generalSettingsComponent = new GeneralSettingsComponent(this.avp);
    }

    public async render(): Promise<any> {
        // Settings
        const generalSettings = await this.generalSettingsComponent.render();

        return controlBarView(this.prepareViewData({
            pauseIcon,
            playIcon,
            markerIcon,
            volumeIcon: volumeOnIcon,
            enterFullscreenIcon: fullscreenOffIcon,
            settingsIcon,
            currentVolume: 50,
            generalSettings,
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

        // Post render child components
        await this.generalSettingsComponent.postRender();
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
