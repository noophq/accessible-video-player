import { MarkerManager } from "lib/core/marker";
import { Player } from "lib/core/player";
import { SettingsManager } from "lib/core/settings";

import { Translator } from "lib/vanilla/translator";

export interface AvpPlayer {
    translator: Translator;
    player: Player;
    markerManager: MarkerManager;
    settingsManager: SettingsManager;
}
