import { LanguageType } from "lib/models/language";
import { GlobalSettings } from "lib/models/settings";
import {
    SubtitleBackgroundColor,
    SubtitleFont,
    SubtitleFontColor,
    SubtitleType,
} from "lib/models/subtitle";
import { PlaybackSpeedType, QualityType } from "lib/models/video";

export const DEFAULT_SETTINGS: GlobalSettings = {
    language: {
        type: LanguageType.Default,
    },
    subtitle: {
        type: SubtitleType.None,
        font: SubtitleFont.Arial,
        fontColor: SubtitleFontColor.White,
        backgroundColor: SubtitleBackgroundColor.Transparent,
        scalingFactor: 1,
    },
    video: {
        quality: QualityType.Auto,
        availableQualities: [QualityType.Auto],
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
};
