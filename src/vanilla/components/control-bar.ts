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
    private playHandler: any;
    private pauseHandler: any;
    private volumeHandler: any;

    constructor(avp: AvpObject) {
        super(avp);
        this.eventRegistry = new EventRegistry();
        this.playHandler = this.avp.player.play.bind(this.avp.player);
        this.pauseHandler = this.avp.player.pause.bind(this.avp.player);
        this.volumeHandler = (event: any) => {
            this.avp.player.setVolume(event.target.value);
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
            this.volumeHandler
        );
    }
}
