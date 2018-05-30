import { EventRegistry } from "lib/listeners/registry";
import { AvpObject } from "lib/models/player";

import { BaseComponent } from "./base";

import { toggleElementAttribute, trapFocus, undoTrapFocus } from "lib/utils/dom";
import { initPopin, togglePopin } from "lib/utils/popin";

export abstract class BaseSettingsComponent extends BaseComponent {
    protected backComponentName: any;

    constructor(
        avp: AvpObject,
        view: any,
        backComponentName? : string
    ) {
        super(avp, view);
        this.backComponentName = backComponentName;
    }

    public async registerDomElements(rootElement: HTMLElement) {
        initPopin(rootElement);
        return {
            root: rootElement
        };
    }

    public async postDomUpdate(rootElement: HTMLElement, domElements: any): Promise<any> {
        this.registerLinkEvent(
            rootElement,
            domElements,
            "avp-back-link",
            this.backComponentName
        );
    }

    protected registerLinkEvent(
        rootElement: HTMLElement,
        domElements: any,
        triggerClassName: string,
        popinName?: string
    ) {
        const triggerElement = rootElement.getElementsByClassName(triggerClassName)[0];
        const settingsButtonElement = domElements["controlBar"]["settingsButton"];

        // Handlers
        const linkHandler = (event: any) => {
            const popinElement = domElements[popinName]["root"];
            if (!popinName) {
                return;
            }
            togglePopin(popinElement, settingsButtonElement);
        }

        // Listeners
        this.eventRegistry.register(
            triggerElement,
            "click",
            linkHandler
        );
    }
}
