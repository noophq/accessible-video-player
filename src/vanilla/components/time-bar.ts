import timeBarView from "ejs-loader!lib/vanilla/views/time-bar.ejs";

import { PlayerEventType } from "lib/models/event";

import { BaseComponent, ComponentProperties } from "./base";
import { renderRangeSlider } from "lib/utils/range-slider";
import { dispatchEvent } from "lib/utils/event";

export class TimeBarComponent extends  BaseComponent<ComponentProperties> {
    public view = timeBarView;

    public async registerDomElements(rootElement: HTMLElement) {
        const rangeSliderElement = rootElement.getElementsByClassName("avp-range-slider")[0];
        const timeBarInputElement = rootElement.getElementsByTagName("input")[0];
        renderRangeSlider(rangeSliderElement);

        return {
            input: timeBarInputElement
        };
    }

    public async postDomUpdate(rootElement: HTMLElement, domElements: any): Promise<any> {
        super.postDomUpdate(rootElement, domElements);
        const playerElement = domElements["origin"]["root"];

        // Handlers
        const contentLoadedHandler = (event: any) => {
            const mainVideoElement = event.player.mainVideoContent.videoElement;
            this.registerMainVideoElement(rootElement, domElements, mainVideoElement);
        }

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
        const timeBarInputElement = domElements["timeBar"]["input"];
        const timeUpdateHandler = (event: any) => {
            const progress = Math.round((mainVideoElement.currentTime/mainVideoElement.duration)*1000);
            timeBarInputElement.value = progress;
            dispatchEvent(timeBarInputElement, "input");
        };
        const seekHandler = (event: any) => {
            const newTime = (timeBarInputElement.value / timeBarInputElement.max) *
                mainVideoElement.duration;
            mainVideoElement.currentTime = newTime;
        };

        // Listeners
        this.eventRegistry.register(
            mainVideoElement,
            "timeupdate",
            timeUpdateHandler
        );
        this.eventRegistry.register(
            timeBarInputElement,
            "change",
            seekHandler
        );
    }
}
