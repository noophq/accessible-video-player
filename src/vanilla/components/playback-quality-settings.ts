import playbackQualitySettingsView from "ejs-loader!lib/vanilla/views/playback-quality-settings.ejs";

import { AvpObject } from "lib/models/player";

import { BaseSettingsComponent } from "./base-settings";

export class PlaybackQualitySettingsComponent extends BaseSettingsComponent {
    protected backComponentName = "displaySettings";

    public get view() {
        return playbackQualitySettingsView;
    }
}
