import { MarkerManager } from "lib/core/marker";
import { Translator } from "lib/core/translator";
import { Player } from "lib/core/player";

import { Marker, MarkerDictionary } from "./marker";
import { GlobalSettings } from "./settings";
import { VideoSource } from "./video";

export interface PlayerMainState {
    // True if audio is muted
    muted: boolean;

    currentTime: number;
    duration: number;
    paused: boolean;
    playbackSpeed: number;
}

export interface PlayerMarkerState {
    markers: MarkerDictionary;
}

interface PlayerMainActionProvider {
    play(): void;
    pause(): void;
    stop(): void;
    seek(timecode?: number): void;

    // Mute audio
    mute(): void;

    // Unmute audio
    unmute(): void;

    // Set volume (0-100)
    setVolume(value: number): void;

    resetPlaybackSpeed(): void;
    setPlaybackSpeed(value: number): void;
}

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
    settings: GlobalSettings,
}
