import { LanguageType } from "lib/models/language";
import {
    SubtitleFont,
    SubtitleFontColor,
    SubtitleBackgroundColor,
    SubtitleType
} from "lib/models/subtitle";
import { QualityType, PlaybackSpeedType } from "lib/models/video";
import { GlobalSettings } from "lib/models/settings";

export const DEFAULT_SETTINGS: GlobalSettings = {
    locale: "en",
    language: {
        type: LanguageType.Default,
    },
    subtitle: {
        type: SubtitleType.None,
        font: SubtitleFont.Default,
        fontColor: SubtitleFontColor.Default,
        backgroundColor: SubtitleBackgroundColor.Transparent,
        fontSize: 10,
    },
    video: {
        quality: QualityType.Auto,
        playbackSpeed: PlaybackSpeedType.Default,
    },
    player: {
        transcription: {
            enabled: false,
        },
        thumbnail: {
            enabled: false,
        },
    },
}

export const DEFAULT_DATA: any = {
    markers: [],
    thumbnails: [],
}
