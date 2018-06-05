import { PlayerEventType, SettingsEventType } from "lib/models/event";
import { EventRegistry } from "lib/event/registry";
import { EventProvider } from "lib/event/provider";
import { dispatchEvent } from "lib/utils/event";

import { VideoResource, VideoType, PlayerType } from "lib/models/video";
import { PlayerData, Resource } from "lib/models/player";
import { ShakaVideoManager } from "lib/player-content/shaka";
import { DefaultVideoManager, VideoContent } from "lib/player-content/video";
import { TranscriptionManager, TranscriptionContent } from "lib/player-content/transcription";
import { ThumbnailManager, ThumbnailContent } from "lib/player-content/thumbnail";

import { SettingsManager } from "./settings";
import { LanguageType } from "lib/models/language";
import { SubtitleType } from "lib/models/subtitle";

import { updateObjectAttribute } from "lib/utils/object";

const videoContentManagers: any = {};
videoContentManagers[PlayerType.Default] = new DefaultVideoManager();
videoContentManagers[PlayerType.Shaka] = new ShakaVideoManager();
const transcriptionManager = new TranscriptionManager();
const thumbnailManager = new ThumbnailManager();

// Library used to synchronize 2 videos
declare var videoSynchronizer: any;

// Library used to display advanced ttml subtitles
declare var subtitlePlayer: any;

export class Player extends EventProvider {
    private loadedData: PlayerData;
    private wrappedVideos: any;
    private eventRegistry: EventRegistry;
    private contentEventRegistry: EventRegistry;
    private videoSynchronizerInstance: any;
    private subtitlePlayerInstance: any;
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
        this.contentEventRegistry = new EventRegistry();
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

            // Fire success event on player dom node
            dispatchEvent(
                this.playerElement,
                SettingsEventType.UpdateSuccess,
                {
                    player: this
                }
            );

            // Reload content
            this.reload();
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

    /**
     * Reload content for the given settings defined in settings manager
     */
    public async reload() {
        // Reload data
        this.load(this.loadedData);
    }

    public async load(data: PlayerData) {
        // Save loaded data
        this.loadedData = data;

        // Unregister events
        this.contentEventRegistry.unregisterAll();

        // Store current time
        let currentTime = (this.mainVideoContent) ?
            this.mainVideoContent.videoElement.currentTime : 0;

        // Remove sync
        if (this.videoSynchronizerInstance) {
            this.videoSynchronizerInstance.destroy();
        }

        // Remove subtitle player
        if (this.subtitlePlayerInstance) {
            this.subtitlePlayerInstance.destroy();
        }

        // Main video
        await this.loadMainVideo();

        // Secondary video
        await this.loadSecondaryVideo();

        // Transcription
        await this.loadTranscription();

        // Thumbnail
        await this.loadThumbnail();

        // Synchronize videos ?
        if (this.secondaryVideoContent) {
            this.videoSynchronizerInstance = videoSynchronizer.sync(
                this.mainVideoContent.videoElement,
                [this.secondaryVideoContent.videoElement]
            );
        }

        // Closed captions
        if (
            this.settingsManager.settings.subtitle.type === SubtitleType.ClosedCaption &&
            data.closedCaption
        ) {
            // Display closed captions
            this.subtitlePlayerInstance = subtitlePlayer.wrap(
                this.mainVideoContent.videoElement
            );
            await this.subtitlePlayerInstance.addCueTrack("default", data.closedCaption.url);
            this.subtitlePlayerInstance.displayCueTrack("default");
        }

        // Content is loaded
        dispatchEvent(
            this.playerElement,
            PlayerEventType.ContentLoaded,
            { player: this }
        );

        this.mainVideoContent.videoElement.currentTime = currentTime;
        this.initMainVideoListeners();
        this.disableVideoContextMenus();
    }

    private disableVideoContextMenus() {
        const noneHandler = (event: any) => {
            event.preventDefault();
        };

        [this.mainVideoContent, this.secondaryVideoContent].forEach((content) => {
            if (!content) {
                return;
            }

            this.contentEventRegistry.register(
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

        this.contentEventRegistry.register(
            this.mainVideoContent.videoElement,
            "playing",
            playingChangeHandler,
        );
        this.contentEventRegistry.register(
            this.mainVideoContent.videoElement,
            "pause",
            playingChangeHandler,
        );
        this.contentEventRegistry.register(
            this.mainVideoContent.videoElement,
            "ended",
            playingChangeHandler,
        );

        if (this.transcriptionContent &&
            this.settingsManager.settings.player.transcription.enabled
        ) {
            // Highlight words
            this.contentEventRegistry.register(
                this.mainVideoContent.videoElement,
                "timeupdate",
                this.transcriptionContent.wordHighlighterHandler
            );
        }
    }

    /**
     * Load main video
     */
    private async loadMainVideo() {
        const languageType = this.settingsManager.settings.language.type;
        let videoResource = null;

        if (languageType === LanguageType.AudioDescription) {
            // Display audio description video as main video
            videoResource = this.loadedData.mainAudioDescriptionVideo;
        } else {
            // Display main video
            videoResource = this.loadedData.mainVideo;
        }

        if (this.mainVideoContent &&
            videoResource &&
            this.mainVideoContent.videoResource.url === videoResource.url) {
            // This is the same content do not reload
            return;
        } else {
            if (this.mainVideoContent) {
                // Remove old main video content
                await this.removeVideo(
                    this.mainVideoContainerElement,
                    this.mainVideoContent
                );
                this.mainVideoContent = null;
            }
        }

        this.mainVideoContent = await this.loadVideo(
            this.mainVideoContainerElement,
            videoResource
        );
    }

    /**
     * Load secondary video
     */
    private async loadSecondaryVideo() {
        const languageType = this.settingsManager.settings.language.type;
        let videoResource = null;

        if (languageType === LanguageType.CuedSpeech) {
            // Synchronized cued speech video
            videoResource = this.loadedData.cuedSpeechVideo

        } else if (languageType === LanguageType.SignedLanguage) {
            // Synchronized signed language video
            videoResource = this.loadedData.signedLanguageVideo;
        }

        if (this.secondaryVideoContent &&
            videoResource &&
            this.secondaryVideoContent.videoResource.url === videoResource.url) {
            // This is the same content do not reload
            return;
        }

        if (!videoResource) {
            if (this.secondaryVideoContent) {
                // Remove old secondary video content
                await this.removeVideo(
                    this.secondaryVideoContainerElement,
                    this.secondaryVideoContent
                );
                this.secondaryVideoContent = null;
            }

            return;
        }

        this.secondaryVideoContent = await this.loadVideo(
            this.secondaryVideoContainerElement,
            videoResource
        );
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

    private async removeVideo(
        containerElement: HTMLElement,
        videoContent: VideoContent
    ): Promise<void> {
        const contentManager = videoContentManagers[videoContent.videoResource.player];
        await contentManager.remove(
            containerElement,
            videoContent
        );
    }

    private async loadTranscription() {
        if (this.transcriptionContent &&
            this.loadedData.transcription &&
            this.transcriptionContent.transcriptionResource.url === this.loadedData.transcription.url) {
            // This is the same content do not reload
            return;
        }

        if (!this.loadedData.transcription) {
            if (this.transcriptionContent) {
                // Remove old transcription content
                await transcriptionManager.remove(
                    this.transcriptionContainerElement,
                    this.transcriptionContent
                );
                this.transcriptionContent = null;
            }

            return;
        }

        // Load new transcription content
        this.transcriptionContent = await transcriptionManager.create(
            this.transcriptionContainerElement,
            this.loadedData.transcription
        );
    }

    private async loadThumbnail() {
        if (!this.loadedData.thumbnail) {
            return;
        }

        this.thumbnailContent = await thumbnailManager.create(
            this.thumbnailContainerElement,
            this.loadedData.thumbnail
        );
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
        this.contentEventRegistry.unregisterAll();
        this.wrappedVideos = null;
    }
}
