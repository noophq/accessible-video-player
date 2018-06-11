export enum SubtitleType {
    None = "NONE",
    ClosedCaption = "CLOSED_CAPTION",
    Transcription = "TRANSCRIPTION"
}

export enum SubtitleFont {
    Default = "DEFAULT",
}

export enum SubtitleFontColor {
    Default = "DEFAULT",
    White = "WHITE",
    Yellow = "YELLOW",
    Blue = "BLUE",
}

export enum SubtitleBackgroundColor {
    Transparent = "NONE",
    White = "WHITE",
    Blue = "BLUE",
    Red = "RED",
}

export interface SubtitleSettings {
    type: SubtitleType,
    font: SubtitleFont | string;
    fontColor: SubtitleFontColor | string;
    backgroundColor: SubtitleBackgroundColor | string;
    fontSize: number;
}
