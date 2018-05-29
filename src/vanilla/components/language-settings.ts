import languageSettingsView from "ejs-loader!lib/vanilla/views/language-settings.ejs";

import { EventRegistry } from "lib/listeners/registry";
import { AvpObject } from "lib/models/player";

import { BaseSettingsComponent } from "./base-settings";

import { toggleElementAttribute, trapFocus, undoTrapFocus } from "lib/utils/dom";
import { initPopin, togglePopin } from "lib/utils/popin";

export class LanguageSettingsComponent extends BaseSettingsComponent {
    constructor(avp: AvpObject) {
        super(avp, languageSettingsView, "displaySettings");
    }
}
