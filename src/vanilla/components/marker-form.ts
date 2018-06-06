import markerFormView from "ejs-loader!lib/vanilla/views/marker-form.ejs";

import { MarkerEventType } from "lib/models/event";

import { initPopin, togglePopin } from "lib/utils/popin";

import { BaseComponent, ComponentProperties } from "./base";

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

    public async postDomUpdate(rootElement: HTMLElement, domElements: any) {
        const playerElement = domElements["origin"]["root"];
        const markerFormElement = domElements["markerForm"]["root"];
        const markerButtonElement = domElements["controlBar"]["markerButton"];
        const submitButtonElement = rootElement.getElementsByTagName("button")[0];
        const titleInputElement = rootElement.getElementsByTagName("input")[0];

        // Handlers
        const editDisplayHandler = (event: any) => {
            rootElement.className = this.buildClassNames(MarkerFormType.Edit).join(" ");
            togglePopin(markerFormElement, markerButtonElement);
            event.stopPropagation();
        };
        const addDisplayHandler = (event: any) => {
            rootElement.className = this.buildClassNames(MarkerFormType.Add).join(" ");
            togglePopin(markerFormElement, markerButtonElement);
            event.stopPropagation();
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
    }
}
