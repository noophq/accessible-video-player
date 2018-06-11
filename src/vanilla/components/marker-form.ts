import markerFormView from "ejs-loader!lib/vanilla/views/marker-form.ejs";

import { MarkerEventType } from "lib/models/event";

import { closePopin, initPopin, togglePopin } from "lib/utils/popin";

import { BaseComponent, ComponentProperties } from "./base";

import { dispatchEvent } from "lib/utils/event";

enum MarkerFormType {
    Add = "marker-form.add",
    Edit = "marker-form.edit"
}

export class MarkerFormComponent extends BaseComponent<ComponentProperties> {
    public view = markerFormView;

    public async registerDomElements(rootElement: HTMLElement) {
        initPopin(rootElement);
        return {
            root: rootElement
        };
    }

    /**
     * Returns a list of additional class names
     */
    private buildClassNames(type: MarkerFormType): string[] {
        const classNames = ["avp-marker-form", "avp-popin"];

        if (type == MarkerFormType.Edit) {
            classNames.push("avp-edit-form");
        } else {
            classNames.push("avp-add-form");
        }

        return classNames;
    }

    public async updateView(
        rootElement: HTMLElement,
        domElements: any,
        player: any
    ) {
        const playerElement = domElements["origin"]["root"];
        const markerFormElement = domElements["markerForm"]["root"];
        const markerButtonElement = domElements["controlBar"]["markerButton"];
        const formElement = rootElement.getElementsByTagName("form")[0];
        const submitButtonElement = rootElement.getElementsByTagName("button")[0];
        const idInputElement = rootElement.querySelector("input[name='id']") as HTMLInputElement;
        const timecodeInputElement = rootElement.querySelector("input[name='timecode']") as HTMLInputElement;
        const titleInputElement = rootElement.querySelector("input[name='title']") as HTMLInputElement;

        // Handlers
        const submitButtonHandler = (event: any) => {
            event.preventDefault();
            const marker: any = {
                title: titleInputElement.value,
                timecode: timecodeInputElement.value,
            };
            let eventType = MarkerEventType.AddRequest;

            if (idInputElement.value.length > 0) {
                // Edit action
                marker.id = idInputElement.value;
                eventType = MarkerEventType.UpdateRequest;
            }

            // Send event to the player
            dispatchEvent(
                playerElement,
                eventType,
                {
                    marker,
                }
            );
        };
        const editDisplayHandler = (event: any) => {
            // Get main video
            const mainVideoElement = this.getMainVideoElement(domElements);

            if (!mainVideoElement) {
                return;
            }

            mainVideoElement.pause();
            rootElement.className = this.buildClassNames(MarkerFormType.Edit).join(" ");
            const marker = event.marker;
            idInputElement.value = marker.id;
            timecodeInputElement.value = marker.timecode;
            titleInputElement.value = marker.title;
            togglePopin(markerFormElement, markerButtonElement);
            event.stopPropagation();
        };
        const addDisplayHandler = (event: any) => {
            // Get main video
            const mainVideoElement = this.getMainVideoElement(domElements);

            if (!mainVideoElement) {
                return;
            }

            mainVideoElement.pause();
            const timecode = Math.round(mainVideoElement.currentTime*1000);
            rootElement.className = this.buildClassNames(MarkerFormType.Add).join(" ");
            idInputElement.value = "";
            titleInputElement.value = "";
            timecodeInputElement.value = timecode.toString();
            togglePopin(markerFormElement, markerButtonElement);
            event.stopPropagation();
        };
        const closePopinHandler = (event: any) => {
            closePopin(markerFormElement);
            markerButtonElement.focus();
        };

        // Listeners
        this.eventRegistry.register(
            playerElement,
            MarkerEventType.AddFormDisplay,
            addDisplayHandler,
        );
        this.eventRegistry.register(
            playerElement,
            MarkerEventType.EditFormDisplay,
            editDisplayHandler,
        );
        this.eventRegistry.register(
            playerElement,
            MarkerEventType.AddSuccess,
            closePopinHandler,
        );
        this.eventRegistry.register(
            playerElement,
            MarkerEventType.UpdateSuccess,
            closePopinHandler,
        );
        this.eventRegistry.register(
            submitButtonElement,
            "click",
            submitButtonHandler,
        );
        this.eventRegistry.register(
            formElement,
            "submit",
            submitButtonHandler,
        );
    }
}
