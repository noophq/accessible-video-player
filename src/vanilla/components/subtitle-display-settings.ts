import subtitleDisplaySettingsView from "ejs-loader!lib/vanilla/views/subtitle-display-settings.ejs";

import { EventRegistry } from "lib/listeners/registry";
import { AvpObject } from "lib/models/player";

import { BaseSettingsComponent } from "./base-settings";

import { toggleElementAttribute, trapFocus, undoTrapFocus } from "lib/utils/dom";
import { initPopin, togglePopin } from "lib/utils/popin";

export class SubtitleDisplaySettingsComponent extends BaseSettingsComponent {
    constructor(avp: AvpObject) {
        super(avp, subtitleDisplaySettingsView, "displaySettings");
    }

    public registerViewData() {
        return {
            fontRadioItems: [
                {
                    id: "font-default",
                    label: "Default",
                    value: "default",
                },
                {
                    id: "font-arial",
                    label: "Arial",
                    value: "arial",
                },
                {
                    id: "font-dyslexic",
                    label: "Open Dyslexic",
                    value: "dyslexic",
                }
            ],
            fontColorRadioItems: [
                {
                    id: "font-color-default",
                    label: "Default",
                    value: "default",
                },
                {
                    id: "font-color-white",
                    label: "White",
                    value: "white",
                },
                {
                    id: "font-color-yellow",
                    label: "Yellow",
                    value: "yellow",
                }
            ],
            fontBgColorRadioItems: [
                {
                    id: "font-bg-color-default",
                    label: "White",
                    value: "white",
                },
                {
                    id: "font-bg-color-black",
                    label: "Black",
                    value: "black",
                },
                {
                    id: "font-bg-color-blue",
                    label: "Blue",
                    value: "blue",
                }
            ],
        };
    }
}
