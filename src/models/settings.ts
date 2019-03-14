import { LanguageSettings } from "./language";
import { PlayerSettings } from "./player";
import { SubtitleSettings } from "./subtitle";
import { VideoSettings } from "./video";

export interface GlobalSettings {
    language: LanguageSettings;
    subtitle: SubtitleSettings;
    video: VideoSettings;
    player: PlayerSettings;
}

export enum SettingsEventType {
    SettingsLoaded = "SETTINGS_LOADED",
    SettingsChanged = "SETTINGS_CHANGED",
    SettingsSaved = "SETTINGS_SAVED",
}
