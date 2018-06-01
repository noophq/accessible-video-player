import subtitleSettingsView from "ejs-loader!lib/vanilla/views/subtitle-settings.ejs";

import { AvpObject } from "lib/models/player";

import { BaseSettingsComponent } from "./base-settings";

import { toggleElementAttribute, trapFocus, undoTrapFocus } from "lib/utils/dom";
import { initPopin, togglePopin } from "lib/utils/popin";

export class SubtitleSettingsComponent extends BaseSettingsComponent {
    public view = subtitleSettingsView;

    public registerViewData() {
        return {
            subtitleRadioItems: [
                {
                    id: "subtitle-none",
                    label: "None",
                    value: "subtitle",
                },
                {
                    id: "subtitle-closed-caption",
                    label: "Closed caption",
                    value: "closed_caption",
                }
            ],
        };
    }
}
