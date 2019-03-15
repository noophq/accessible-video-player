import timeBarView from "ejs-loader!lib/vanilla/views/time-bar.ejs";

import { PlayerEventType } from "lib/models/event";

import { BaseComponent, ComponentProperties } from "./base";
import { renderRangeSlider } from "lib/utils/range-slider";
import { dispatchEvent } from "lib/utils/event";

import { MarkerBarComponent } from "./marker-bar";

export class TimeBarComponent extends  BaseComponent<ComponentProperties> {
    public view = timeBarView;

    public registerChilds() {
        return {
            markerBar: new MarkerBarComponent(this.props),
        };
    }

    public async registerDomElements(rootElement: HTMLElement) {
        const rangeSliderElement = rootElement.getElementsByClassName("avp-range-slider")[0];
        const timeBarInputElement = rootElement.getElementsByTagName("input")[0];
        renderRangeSlider(rangeSliderElement);

        return {
            input: timeBarInputElement
        };
    }

    public async updateView(
        rootElement: HTMLElement,
        domElements: any,
        player: any
    ) {
        // Retrieve dom elements
        const translate = this.props.translator.translate.bind(this.props.translator);
        const mainVideoElement = player.mainVideoContent.videoElement;
        const timeBarInputElement = domElements["timeBar"]["input"];
        const timeUpdateHandler = (event: any) => {
            const progress = Math.round((mainVideoElement.currentTime / mainVideoElement.duration ) * 1000 );
            timeBarInputElement.value = progress;
            timeBarInputElement.setAttribute(
                "aria-valuetext",
                translate(
                    "controlBar.timeDescription",
                    {
                        value: Math.round(mainVideoElement.currentTime),
                        total: Math.round(mainVideoElement.duration),
                    },
                ),
            );
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
