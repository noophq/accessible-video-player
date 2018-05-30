import { PlayerEventType } from "lib/models/event";
import { EventRegistry } from "lib/listeners/registry";
import { AvpObject } from "lib/models/player";

import timeBarView from "ejs-loader!lib/vanilla/views/control-bar.ejs";

import { BaseComponent } from "./base";
import { GeneralSettingsComponent } from "./general-settings";
import { DisplaySettingsComponent } from "./display-settings";
import { LanguageSettingsComponent } from "./language-settings";
import { SubtitleSettingsComponent } from "./subtitle-settings";
import { SubtitleDisplaySettingsComponent } from "./subtitle-display-settings";
import { PlaybackSpeedSettingsComponent } from "./playback-speed-settings";
import { PlaybackQualitySettingsComponent } from "./playback-quality-settings";

import { renderRangeSlider } from "lib/utils/range-slider";
import { initPopin, togglePopin } from "lib/utils/popin";

export class TimeBarComponent extends BaseComponent {
    private timeBarInputElement: HTMLElement;
    private seekHandler: any;

    constructor(avp: AvpObject) {
        super(avp, timeBarView);
    }

    public async registerDomElements(rootElement: HTMLElement): Promise<any> {
        const timeBarInputElement = rootElement.getElementsByTagName("input")[0];
        this.eventRegistry.register(
            timeBarInputElement,
            "input",
            (event: any) => {
                console.log(event.target.value);
            }
        );

        return {
            timeBarInput: timeBarInputElement
        };
    }
}
