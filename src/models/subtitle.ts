export enum SubtitleType {
    None = "NONE",
    ClosedCaption = "CLOSED_CAPTION",
}

export enum SubtitleFont {
    Default = "DEFAULT",
}

export enum SubtitleFontColor {
    Default = "DEFAULT",
    White = "white",
    Yellow = "yellow",
    Blue = "blue",
}

export enum SubtitleBackgroundColor {
    Transparent = "none",
    White = "white",
    Blue = "blue",
    Red = "red",
}

export interface SubtitleSettings {
    type: SubtitleType,
    font: SubtitleFont | string;
    fontColor: SubtitleFontColor | string;
    backgroundColor: SubtitleBackgroundColor | string;
    fontSize: number;
}
