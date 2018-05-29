import generalSettingsView from "ejs-loader!lib/vanilla/views/general-settings.ejs";

import { EventRegistry } from "lib/listeners/registry";
import { AvpObject } from "lib/models/player";

import { BaseComponent } from "./base";

import { toggleElementAttribute, trapFocus, undoTrapFocus } from "lib/utils/dom";
import { initPopin, togglePopin } from "lib/utils/popin";

export class GeneralSettingsComponent extends BaseComponent {
    private eventRegistry: EventRegistry;
    private generalSettingsPopinElement: HTMLDivElement;

    constructor(avp: AvpObject) {
        super(avp);
        this.eventRegistry = new EventRegistry();
    }

    public async render(): Promise<any> {
        return generalSettingsView(this.prepareViewData({}));
    }

    public async postRender(): Promise<any> {
        this.generalSettingsPopinElement = document.getElementById(this.id) as HTMLDivElement;
        initPopin(this.generalSettingsPopinElement);
    }

    /**
     * Display or close display
     */
    public toggleDisplay() {
        togglePopin(this.generalSettingsPopinElement);
    }
}
