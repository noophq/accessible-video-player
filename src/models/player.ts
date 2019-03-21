import { MarkerManager } from "lib/core/marker";
import { Player } from "lib/core/player";
import { SettingsManager } from "lib/core/settings";

import { SubtitleType } from "./subtitle";
import { VideoResource } from "./video";

export interface CapturedScreenshot {
    timecode: number;
    imageData: any;
}

export interface TranscriptionSettings {
    enabled: boolean;
}

export interface ThumbnailSettings {
    enabled: boolean;
}

export interface PlayerSettings {
    transcription: TranscriptionSettings;
    thumbnail: ThumbnailSettings;
}

export interface Resource {
    url: string;
}

export interface ThumbnailCollection {
    thumbnails: Thumbnail[];
}

export interface ThumbnailCollectionResource {
    url?: string;
    thumbnails?: Thumbnail[];
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
    mainVideo: VideoResource;
    mainAudioDescriptionVideo?: VideoResource;
    cuedSpeechVideo?: VideoResource;
    signedLanguageVideo?: VideoResource;
    subtitles: SubtitleResource[];
    transcription?: Resource;
    thumbnailCollection?: ThumbnailCollectionResource;
}
