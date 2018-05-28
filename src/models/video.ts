export enum QualityType {
    Auto = "AUTO",
    Q240P = "240P",
    Q360P = "360P",
    Q480P = "480P",
    Q720P = "720P",
    Q1080P = "1080P",
}

export enum PlaybackSpeedType {
    S50 = 50,
    S75 = 75,
    Default = 100,
    S125 = 125,
    S150 = 150,
}

export enum PlayerType {
    Default = "DEFAULT",
    Shaka = "SHAKA",
}

export interface VideoSettings {
    quality: QualityType | string,
    playbackSpeed: PlaybackSpeedType | number,
}

export interface VideoSource {
    url: string,
    quality: QualityType | string,
    player: PlayerType,
}
