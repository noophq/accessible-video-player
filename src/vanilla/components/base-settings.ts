import { EventRegistry } from "lib/listeners/registry";
import { AvpObject } from "lib/models/player";

import { BaseComponent } from "./base";

import { toggleElementAttribute, trapFocus, undoTrapFocus } from "lib/utils/dom";
import { initPopin, togglePopin } from "lib/utils/popin";

export abstract class BaseSettingsComponent extends BaseComponent {
    protected componentView: any;
    protected eventRegistry: EventRegistry;
    protected rootElement: HTMLDivElement;
    protected attachedComponents: any;
    protected attachedElements: any;
    protected backElement: any;
    protected backHandler: any;
    protected backComponentName: any;

    constructor(
        avp: AvpObject,
        componentView: any,
        backComponentName? : string
    ) {
        super(avp);
        this.componentView = componentView;
        this.backComponentName = backComponentName;
        this.initializeHandlers();
    }

    protected initializeHandlers() {
        this.eventRegistry = new EventRegistry();
        this.backHandler = (event: any) => {
            if (!this.backComponentName) {
                return;
            }
            this.attachedComponents[this.backComponentName].toggleDisplay();
        };
    }

    public async render(): Promise<any> {
        return this.componentView(this.prepareViewData({}));
    }

    public async postRender(): Promise<any> {
        this.rootElement = document.getElementById(this.id) as HTMLDivElement;
        initPopin(this.rootElement);
        const backElements = this.rootElement.getElementsByClassName("avp-back-link");

        if (backElements.length > 0) {
            this.backElement = backElements[0];
            this.eventRegistry.register(
                this.backElement,
                "click",
                this.backHandler
            );
        }
    }

    /**
     * Display or close popin
     */
    public toggleDisplay() {
        togglePopin(
            this.rootElement,
            this.attachedElements["settingsButton"],
        );
    }

    public attachComponents(components: any) {
        this.attachedComponents = components;
    }

    public attachElements(elements: any) {
        this.attachedElements = elements;
    }
}
