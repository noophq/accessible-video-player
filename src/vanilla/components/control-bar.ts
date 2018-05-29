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

import { renderRangeSlider } from "lib/utils/range-slider";
import { toggleElementAttribute, trapFocus, undoTrapFocus } from "lib/utils/dom";

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
    private volumePanelElement: HTMLDivElement;
    private stopPropagationHandler: any;
    private playingChangeHandler: any;
    private playHandler: any;
    private pauseHandler: any;
    private volumeSetHandler: any;
    private volumeClickHandler: any;
    private volumePanelEscapeHandler: any;

    constructor(avp: AvpObject) {
        super(avp);
        this.eventRegistry = new EventRegistry();
        this.playHandler = this.avp.player.play.bind(this.avp.player);
        this.pauseHandler = this.avp.player.pause.bind(this.avp.player);
        this.volumeSetHandler = (event: any) => {
            this.avp.player.volume = event.target.value;
        };
        this.volumeClickHandler = (event: any) => {
            toggleElementAttribute(this.volumeInputElement, "tabindex", -1);
            this.volumePanelElement.classList.toggle("open");

            if (this.volumeInputElement.hasAttribute("tabIndex")) {
                undoTrapFocus();
            } else  {
                // Trap focus
                trapFocus(this.volumePanelElement);
            }

            event.stopPropagation();
        };

        this.volumePanelEscapeHandler = (event: any) => {
            // Escape key closes the volume
            if (event.key == "Escape") {
                undoTrapFocus();
                this.volumeButtonElement.click();
                this.volumeButtonElement.focus();
            }
        };
        this.playingChangeHandler = (event: any) => {
            if (event.target.paused) {
                this.controlBarElement.classList.remove("playing");
            } else {
                this.controlBarElement.classList.add("playing");
            }
        };

        this.stopPropagationHandler = (event: any) => {
            event.stopPropagation();
        };
    }

    public async render(): Promise<any> {
        return controlBarView(this.prepareViewData({
            pauseIcon,
            playIcon,
            markerIcon,
            volumeIcon: volumeOnIcon,
            enterFullscreenIcon: fullscreenOffIcon,
            settingsIcon,
            currentVolume: 50
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
        this.volumePanelElement = this.getControlBarElement("volume-panel");
        const rangeSliderElement = this.volumePanelElement.getElementsByClassName("avp-range-slider")[0];
        this.volumeInputElement = this.volumePanelElement.getElementsByTagName("input")[0];
        renderRangeSlider(rangeSliderElement);
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
            this.volumeClickHandler,
        );
        this.eventRegistry.register(
            this.volumePanelElement,
            "keydown",
            this.volumePanelEscapeHandler,
        );
        this.eventRegistry.register(
            this.volumePanelElement,
            "click",
            this.stopPropagationHandler,
        );
        this.eventRegistry.register(
            videoElement,
            PlayerEventType.PLAYING_CHANGE,
            this.playingChangeHandler
        );
    }
}
