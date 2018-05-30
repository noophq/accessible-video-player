import generalSettingsView from "ejs-loader!lib/vanilla/views/general-settings.ejs";

import { AvpObject } from "lib/models/player";

import { BaseSettingsComponent } from "./base-settings";

export class GeneralSettingsComponent extends BaseSettingsComponent {
    constructor(avp: AvpObject) {
        super(avp, generalSettingsView);
    }

    public async postDomUpdate(rootElement: HTMLElement, domElements: any): Promise<any> {
        this.registerLinkEvent(
            rootElement,
            domElements,
            "avp-display-settings-link",
            "displaySettings"
        );
    }
}
