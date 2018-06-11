import { AvpObject } from "lib/models/player";

import { BaseComponent, ComponentProperties } from "./base";

import { toggleElementAttribute, trapFocus, undoTrapFocus } from "lib/utils/dom";
import { initPopin, togglePopin } from "lib/utils/popin";

export interface SettingsComponentProperties extends ComponentProperties {
    backComponentName?: string;
}

export abstract class BaseSettingsComponent extends BaseComponent<SettingsComponentProperties> {
    public async registerDomElements(rootElement: HTMLElement) {
        initPopin(rootElement);
        return {
            root: rootElement
        };
    }

    public async updateView(
        rootElement: HTMLElement,
        domElements: any,
        player: any,
    ): Promise<any> {
        this.registerLinkEvent(
            rootElement,
            domElements,
            "avp-back-link",
            this.props.backComponentName
        );
    }

    protected registerLinkEvent(
        rootElement: HTMLElement,
        domElements: any,
        triggerClassName: string,
        popinName?: string
    ) {
        const triggerElement = rootElement.getElementsByClassName(triggerClassName)[0];

        if (!triggerElement) {
            return;
        }

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
