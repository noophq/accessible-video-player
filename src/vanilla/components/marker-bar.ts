import markerBarView from "ejs-loader!lib/vanilla/views/marker-bar.ejs";

import { trapFocus } from "lib/utils/dom";
import { initPopin, openPopin, closePopin } from "lib/utils/popin";
import { MarkerEventType } from "lib/models/event";

import { dispatchEvent } from "lib/utils/event";

import { BaseComponent, ComponentProperties } from "./base";
import { MarkerItemComponent } from "./marker-item";

export class MarkerBarComponent extends BaseComponent<ComponentProperties> {
    public view = markerBarView;

    public registerChilds() {
        return {
            markerItemTemplate: new MarkerItemComponent(this.props),
        };
    }

    public async registerDomElements(rootElement: HTMLElement): Promise<any> {
        return {
            root: rootElement,
        }
    }

    public async updateView(
        rootElement: HTMLElement,
        domElements: any,
        player: any
    ) {
        const playerElement = domElements["origin"]["root"];
        const mainVideoElement = player.mainVideoContent.videoElement;

        // Display markers when video metadata is loaded
        this.eventRegistry.register(
            mainVideoElement,
            "loadedmetadata",
            () => { this.updateMarkers(rootElement, domElements, player); }
        );

        const updateMarkers = () => {
            this.updateMarkers(rootElement, domElements, player);
        }

        // Listeners
        this.eventRegistry.register(
            playerElement,
            MarkerEventType.AddSuccess,
            updateMarkers
        );
        this.eventRegistry.register(
            playerElement,
            MarkerEventType.UpdateSuccess,
            updateMarkers
        );
        this.eventRegistry.register(
            playerElement,
            MarkerEventType.DeleteSuccess,
            updateMarkers
        );

        // Update markers each time the view must be updated
        updateMarkers();
    }

    protected updateMarkers(
        rootElement: HTMLElement,
        domElements: any,
        player: any
    ) {
        const playerElement = domElements["origin"]["root"];
        const mainVideoElement = player.mainVideoContent.videoElement;

        // Remove old markers
        rootElement.innerHTML = "";

        if (mainVideoElement.readyState < 1) {
            // Video is not ready so we are not able to retrieve video duration
            return;
        }

        // Get markers
        const markers = player.markerManager.markers;

        // Video duration in ms
        const mainVideoDuration = mainVideoElement.duration*1000;

        // Get marker template
        const markerItemTemplateElement = domElements["markerItemTemplate"]["root"];

        // Timer that closes tooltip
        let tooltipTimer: any = null;
        let lastOpenTooltipElement: any = null;

        // Create markers
        for (const marker of markers) {
            const markerElement = markerItemTemplateElement.cloneNode(true) as HTMLElement;
            const editButtonElement = markerElement.getElementsByClassName("avp-edit-button")[0];
            const deleteButtonElement = markerElement.getElementsByClassName("avp-delete-button")[0];
            const triggerElement = markerElement.getElementsByClassName("avp-trigger")[0];
            const targetElement = markerElement.getElementsByClassName("avp-target")[0] as HTMLElement;
            const titleElement = markerElement.getElementsByTagName("label")[0];
            const leftPosition = marker.timecode*100/mainVideoDuration;
            markerElement.style.left = leftPosition + "%";
            markerElement.removeAttribute("id");
            titleElement.innerHTML = marker.title;

            // Initialize popin in tooltip
            initPopin(targetElement);

            // Remove template indicator
            markerElement.classList.remove("avp-template");
            rootElement.appendChild(markerElement);

            // Handlers
            const openTooltipHandler = (event: any) => {
                if (lastOpenTooltipElement) {
                    lastOpenTooltipElement.classList.remove("avp-open");
                }
                clearTimeout(tooltipTimer);
                lastOpenTooltipElement = markerElement;
                markerElement.classList.add("avp-open");
            };
            const closeTooltipHandler = (event: any) => {
                clearTimeout(tooltipTimer);
                const closeTooltip = () => {
                    tooltipTimer = null;
                    markerElement.classList.remove("avp-open");
                };
                tooltipTimer = setTimeout(closeTooltip, 2000);
            };
            const enterPopinHandler = (event: any) => {
                clearTimeout(tooltipTimer);
                openPopin(targetElement);
                event.stopPropagation();
            };
            const markerEditHandler = (event: any) => {
                dispatchEvent(
                    playerElement,
                    MarkerEventType.EditFormDisplay,
                    { marker }
                );
                event.stopPropagation();
            };
            const markerDeleteHandler = (event: any) => {
                dispatchEvent(
                    playerElement,
                    MarkerEventType.DeleteRequest,
                    { marker }
                );
                event.stopPropagation();
            };

            // Listeners
            this.eventRegistry.register(
                markerElement,
                "mouseleave",
                closeTooltipHandler
            );
            this.eventRegistry.register(
                markerElement,
                "mouseenter",
                openTooltipHandler
            );
            this.eventRegistry.register(
                triggerElement,
                "focus",
                openTooltipHandler
            );
            this.eventRegistry.register(
                triggerElement,
                "blur",
                closeTooltipHandler
            );
            this.eventRegistry.register(
                triggerElement,
                "click",
                enterPopinHandler
            );
            this.eventRegistry.register(
                editButtonElement,
                "click",
                markerEditHandler
            );
            this.eventRegistry.register(
                deleteButtonElement,
                "click",
                markerDeleteHandler
            );
        }
    }
}
