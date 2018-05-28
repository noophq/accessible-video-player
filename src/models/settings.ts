import { LanguageSettings } from "./language";
import { SubtitleSettings } from "./subtitle";
import { VideoSettings } from "./video";
import { PlayerSettings } from "./player";

export interface GlobalSettings {
    locale: string,
    language: LanguageSettings,
    subtitle: SubtitleSettings,
    video: VideoSettings,
    player: PlayerSettings,
}

export enum SettingsEventType {
    SettingsLoaded = "SETTINGS_LOADED",
    SettingsChanged = "SETTINGS_CHANGED",
    SettingsSaved = "SETTINGS_SAVED",
}
