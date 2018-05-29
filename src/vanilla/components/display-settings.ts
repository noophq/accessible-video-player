import displaySettingsView from "ejs-loader!lib/vanilla/views/display-settings.ejs";

import { EventRegistry } from "lib/listeners/registry";
import { AvpObject } from "lib/models/player";

import { BaseSettingsComponent } from "./base-settings";

export class DisplaySettingsComponent extends BaseSettingsComponent {
    private languageSettingsButtonElement: any;
    private subtitleSettingsButtonElement: any;
    private subtitleDisplaySettingsButtonElement: any;
    private playbackSpeedSettingsButtonElement: any
    private playbackQualitySettingsButtonElement: any;
    private languageSettingsButtonHandler: any;
    private subtitleSettingsButtonHandler: any;
    private subtitleDisplaySettingsButtonHandler: any;
    private playbackSpeedSettingsButtonHandler: any;
    private playbackQualitySettingsButtonHandler: any;

    constructor(avp: AvpObject) {
        super(avp, displaySettingsView, "generalSettings");
    }

    protected initializeHandlers() {
        super.initializeHandlers();
        this.languageSettingsButtonHandler = (event: any) => {
            this.attachedComponents["languageSettings"].toggleDisplay();
            event.stopPropagation();
        };
        this.subtitleSettingsButtonHandler = (event: any) => {
            this.attachedComponents["subtitleSettings"].toggleDisplay();
            event.stopPropagation();
        };
        this.subtitleDisplaySettingsButtonHandler = (event: any) => {
            this.attachedComponents["subtitleDisplaySettings"].toggleDisplay();
            event.stopPropagation();
        };
        this.playbackSpeedSettingsButtonHandler = (event: any) => {
            this.attachedComponents["playbackSpeedSettings"].toggleDisplay();
            event.stopPropagation();
        };
        this.playbackQualitySettingsButtonHandler = (event: any) => {
            this.attachedComponents["playbackQualitySettings"].toggleDisplay();
            event.stopPropagation();
        };
    }

    public async postRender(): Promise<any> {
        await super.postRender();
        this.languageSettingsButtonElement = this.rootElement
            .getElementsByClassName("avp-language-settings-link")[0];
        this.eventRegistry.register(
            this.languageSettingsButtonElement,
            "click",
            this.languageSettingsButtonHandler,
        );
        this.subtitleSettingsButtonElement = this.rootElement
            .getElementsByClassName("avp-subtitle-settings-link")[0];
        this.eventRegistry.register(
            this.subtitleSettingsButtonElement,
            "click",
            this.subtitleSettingsButtonHandler,
        );
        this.subtitleDisplaySettingsButtonElement = this.rootElement
            .getElementsByClassName("avp-subtitle-display-settings-link")[0];
        this.eventRegistry.register(
            this.subtitleDisplaySettingsButtonElement,
            "click",
            this.subtitleDisplaySettingsButtonHandler,
        );
        this.playbackSpeedSettingsButtonElement = this.rootElement
            .getElementsByClassName("avp-playback-speed-settings-link")[0];
        this.eventRegistry.register(
            this.playbackSpeedSettingsButtonElement,
            "click",
            this.playbackSpeedSettingsButtonHandler,
        );
        this.playbackQualitySettingsButtonElement = this.rootElement
            .getElementsByClassName("avp-playback-quality-settings-link")[0];
        this.eventRegistry.register(
            this.playbackQualitySettingsButtonElement,
            "click",
            this.playbackQualitySettingsButtonHandler,
        );
    }
}
