import generalSettingsView from "ejs-loader!lib/vanilla/views/general-settings.ejs";

import { AvpObject } from "lib/models/player";

import { BaseSettingsComponent } from "./base-settings";

export class GeneralSettingsComponent extends BaseSettingsComponent {
    private displaySettingsButtonElement: any;
    private displaySettingsButtonHandler: any;

    constructor(avp: AvpObject) {
        super(avp, generalSettingsView);
    }

    protected initializeHandlers() {
        super.initializeHandlers();
        this.displaySettingsButtonHandler = (event: any) => {
            this.attachedComponents["displaySettings"].toggleDisplay();
            event.stopPropagation();
        };
    }

    public async postRender(): Promise<any> {
        await super.postRender();
        this.displaySettingsButtonElement = this.rootElement
            .getElementsByClassName("avp-display-settings-link")[0];
        this.eventRegistry.register(
            this.displaySettingsButtonElement,
            "click",
            this.displaySettingsButtonHandler,
        )
    }
}
