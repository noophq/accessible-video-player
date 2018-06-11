import { MarkerManager } from "lib/core/marker";
import { SettingsManager } from "lib/core/settings";
import { Translator } from "lib/core/translator";
import { Player } from "lib/core/player";

import { Marker, MarkerDictionary } from "./marker";
import { GlobalSettings } from "./settings";
import { VideoResource } from "./video";
import { SubtitleType } from "./subtitle";

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

export interface Resource {
    url: string,
}

export interface SubtitleResource extends Resource {
    name?: string;
    type: SubtitleType;
}

export interface Thumbnail {
    id: string;
    timecode: number;
    title: string;
    description?: string;
    imageUrl: string;
}

export interface PlayerData {
    mainVideo: VideoResource,
    mainAudioDescriptionVideo?: VideoResource,
    cuedSpeechVideo?: VideoResource,
    signedLanguageVideo?: VideoResource,
    subtitles: SubtitleResource[],
    transcription?: Resource,
    thumbnailCollection?: Resource
}

export interface AvpObject {
    i18n: Translator,
    player: Player,
    markerManager: MarkerManager,
    settingsManager: SettingsManager,
}
