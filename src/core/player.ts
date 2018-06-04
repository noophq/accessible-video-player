import { PlayerEventType, SettingsEventType } from "lib/models/event";
import { EventRegistry } from "lib/event/registry";
import { EventProvider } from "lib/event/provider";
import { dispatchEvent } from "lib/utils/event";

import { VideoResource, VideoType, PlayerType } from "lib/models/video";
import { PlayerData, Resource } from "lib/models/player";
import { ShakaVideoManager } from "lib/player-content/shaka";
import { DefaultVideoManager, VideoContent } from "lib/player-content/video";
import { TranscriptionManager, TranscriptionContent } from "lib/player-content/transcription";

import { SettingsManager } from "./settings";
import { LanguageType } from "lib/models/language";
import { SubtitleType } from "lib/models/subtitle";

import { updateObjectAttribute } from "lib/utils/object";

const videoContentManagers: any = {};
videoContentManagers[PlayerType.Default] = new DefaultVideoManager();
videoContentManagers[PlayerType.Shaka] = new ShakaVideoManager();
const transcriptionManager = new TranscriptionManager();

// Library used to synchronize 2 videos
declare var videoSynchronizer: any;

// Library used to display advanced ttml subtitles
declare var subtitlePlayer: any;

export class Player extends EventProvider {
    private loadedData: PlayerData;
    private wrappedVideos: any;
    private eventRegistry: EventRegistry;
    public settingsManager: SettingsManager;
    public playerElement: HTMLElement;
    public mainVideoContainerElement: HTMLElement;
    public secondaryVideoContainerElement: HTMLElement;
    public transcriptionContainerElement: HTMLElement;
    public thumbnailContainerElement: HTMLElement;
    public mainVideoContent: VideoContent;
    public secondaryVideoContent: VideoContent;
    public transcriptionContent: TranscriptionContent;
    public thumbnailContent: any;

    constructor(settingsManager: SettingsManager) {
        super();
        this.wrappedVideos = {};
        this.eventRegistry = new EventRegistry();
        this.playerElement = null;
        this.settingsManager = settingsManager;
    }

    public attachPlayer(playerElement: HTMLElement) {
        this.playerElement = playerElement;

        dispatchEvent(
            this.playerElement,
            PlayerEventType.PlayerAttached,
            {
                player: this
            }
        );

        // Listen to settings update submitted by player dom element
        const updateSettingsHandler = (event: any) => {
            const updatedSettings = event.updatedSettings;

            for (const settingUpdate of updatedSettings) {
                updateObjectAttribute(
                    this.settingsManager.settings,
                    settingUpdate[0],
                    settingUpdate[1],
                );
            }

            dispatchEvent(
                this.playerElement,
                SettingsEventType.UpdateSuccess,
                {
                    player: this
                }
            );
        };
        this.eventRegistry.register(
            this.playerElement,
            SettingsEventType.UpdateRequest,
            updateSettingsHandler
        );
    }

    public attachContent(
        mainVideoContainerElement: HTMLElement,
        secondaryVideoContainerElement: HTMLElement,
        transcriptionContainerElement: HTMLElement,
        thumbnailContainerElement: HTMLElement
    ) {
        this.mainVideoContainerElement = mainVideoContainerElement;
        this.secondaryVideoContainerElement = secondaryVideoContainerElement;
        this.transcriptionContainerElement = transcriptionContainerElement;
        this.thumbnailContainerElement = thumbnailContainerElement;
    }

    public async load(data: PlayerData) {
        const settings = this.settingsManager.settings;
        const languageType = this.settingsManager.settings.language.type;

        // Main video
        let mainVideoContent = null;

        if (languageType === LanguageType.AudioDescription) {
            // Display audio description video as main video
            mainVideoContent = await this.loadVideo(
                this.mainVideoContainerElement,
                data.mainAudioDescriptionVideo
            );
        } else {
            // Display main video
            mainVideoContent = await this.loadVideo(
                this.mainVideoContainerElement,
                data.mainVideo
            );
        }

        this.mainVideoContent = mainVideoContent;

        // Secondary video
        let secondaryVideoContent = null;

        if (languageType === LanguageType.CuedSpeech) {
            // Synchronized cued speech video
            secondaryVideoContent = await this.loadVideo(
                this.secondaryVideoContainerElement,
                data.cuedSpeechVideo
            );
        } else if (languageType === LanguageType.SignedLanguage) {
            // Synchronized signed language video
            secondaryVideoContent = await this.loadVideo(
                this.secondaryVideoContainerElement,
                data.signedLanguageVideo
            );
        }

        this.secondaryVideoContent = secondaryVideoContent;

        // Transcription
        let transcriptionContent = null;

        if (data.transcription) {
            // Load transcription even if container is hidden
            transcriptionContent = await this.loadTranscription(
                this.transcriptionContainerElement,
                data.transcription
            );
        }

        this.transcriptionContent = transcriptionContent;

        // Thumbnail
        let thumbnailContent = null;

        if (data.thumbnail) {
            // Load thumbnails event if container is hidden
            thumbnailContent = await this.loadThumbnail(
                this.thumbnailContainerElement,
                data.thumbnail
            );
        }

        this.thumbnailContent = this.thumbnailContent;

        // Synchronize videos ?
        if (this.secondaryVideoContent) {
            videoSynchronizer.sync(
                this.mainVideoContent.videoElement,
                [this.secondaryVideoContent.videoElement]
            );
        }

        // Closed captions
        if (
            settings.subtitle.type === SubtitleType.ClosedCaption &&
            data.closedCaption
        ) {
            // Display closed captions
            const sPlayer = subtitlePlayer.wrap(mainVideoContent.videoElement);
            sPlayer.displayTextTrack(data.closedCaption.url);
        }

        // Content is loaded
        dispatchEvent(
            this.playerElement,
            PlayerEventType.ContentLoaded,
            { player: this }
        );

        this.initMainVideoListeners();
        this.disableVideoContextMenus();

        // Save loaded data
        this.loadedData = data;
    }

    private disableVideoContextMenus() {
        const noneHandler = (event: any) => {
            event.preventDefault();
        };

        [this.mainVideoContent, this.secondaryVideoContent].forEach((content) => {
            if (!content) {
                return;
            }

            this.eventRegistry.register(
                content.videoElement,
                "contextmenu",
                noneHandler
            );
        });
    }

    private initMainVideoListeners() {
        const playingChangeHandler = (event: any) => {
            console.log("Playing change", this.playerElement);
            dispatchEvent(
                this.playerElement,
                PlayerEventType.PlayingChange,
                { player: this }
            );
        };

        this.eventRegistry.register(
            this.mainVideoContent.videoElement,
            "playing",
            playingChangeHandler,
        );
        this.eventRegistry.register(
            this.mainVideoContent.videoElement,
            "pause",
            playingChangeHandler,
        );
        this.eventRegistry.register(
            this.mainVideoContent.videoElement,
            "ended",
            playingChangeHandler,
        );

        if (this.transcriptionContent) {
            // Highlight words
            this.eventRegistry.register(
                this.mainVideoContent.videoElement,
                "timeupdate",
                this.transcriptionContent.wordHighlighterHandler
            );
        }
    }


    private async loadVideo(
        containerElement: HTMLElement,
        videoResource: VideoResource
    ): Promise<VideoContent> {
        const contentManager = videoContentManagers[videoResource.player];
        return await contentManager.create(
            containerElement,
            videoResource
        );
    }

    private async loadTranscription(
        containerElement: HTMLElement,
        transcriptionResource: Resource
    ) {
        return await transcriptionManager.create(
            containerElement,
            transcriptionResource
        );
    }

    private async loadThumbnail(
        containerElement: HTMLElement,
        resource: Resource
    ) {

    }

    public refreshUi() {
        if (!this.playerElement) {
            return;
        }

        dispatchEvent(
            this.playerElement,
            PlayerEventType.UiRefreshRequest
        );
    }

    public destroy() {
        this.eventRegistry.unregisterAll();
        this.wrappedVideos = null;
    }
}
