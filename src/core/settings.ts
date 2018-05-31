import { GlobalSettings } from "lib/models/settings";

export class SettingsManager {
    private playerElement: HTMLElement;
    private playerSettings: GlobalSettings;

    constructor(settings: GlobalSettings) {
        this.playerSettings = settings;
    }

    public async attachPlayer(playerElement: HTMLElement) {
        this.playerElement = playerElement;
    }

    public get settings() {
        return this.playerSettings;
    }

    public set settings(value) {
        this.playerSettings = value;
    }
}
