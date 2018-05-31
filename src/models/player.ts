import { MarkerManager } from "lib/core/marker";
import { SettingsManager } from "lib/core/settings";
import { Translator } from "lib/core/translator";
import { Player } from "lib/core/player";

import { Marker, MarkerDictionary } from "./marker";
import { GlobalSettings } from "./settings";
import { VideoSource } from "./video";

export interface TranscriptionSettings {
    enabled: boolean,
}

export interface ThumbnailSettings {
    enabled: boolean,
}

export interface PlayerSettings {
    transcription: TranscriptionSettings,
    thumbnail: ThumbnailSettings,
}

export interface Source {
    url: string,
}

export interface Thumbnail {
    id: string;
    timecode: number;
    title: string;
    description?: string;
    imageUrl: string;
}

export interface PlayerData {
    mainVideo: VideoSource,
    cuedSpeechVideo?: VideoSource,
    signedLanguageVideo?: VideoSource,
    closeCaption?: Source,
    transcription?: Source,
    markers: Marker[],
    thumbnails: Thumbnail[],
}

export interface AvpObject {
    i18n: Translator,
    player: Player,
    markerManager: MarkerManager,
    settingsManager: SettingsManager,
}
