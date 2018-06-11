export enum VideoType {
    Main = "MAIN",
    CuedSpeech = "CUED_SPEECH",
    SignedLanguage = "SIGNED_LANGUAGE"
}

export enum QualityType {
    Auto = "AUTO",
    Q240P = "240",
    Q360P = "360",
    Q480P = "480",
    Q720P = "720",
    Q1080P = "1080",
}

export enum PlaybackSpeedType {
    S50 = 0.5,
    S75 = 0.75,
    Default = 1,
    S125 = 1.25,
    S150 = 1.5,
}

export enum PlayerType {
    Default = "DEFAULT",
    Shaka = "SHAKA",
}

export interface VideoSettings {
    quality: QualityType;
    availableQualities: QualityType[],
    playbackSpeed: number;
}

export interface VideoResource {
    url: string;
    quality: QualityType | string;
    player: PlayerType;
    playerOptions?: any;
    additionalMetadata?: any;
}
