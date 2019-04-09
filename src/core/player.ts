import * as uuid from "uuid";

import { MarkerEventType, PlayerEventType, SettingsEventType } from "lib/models/event";
import { EventRegistry } from "lib/event/registry";
import { EventProvider } from "lib/event/provider";
import { dispatchEvent } from "lib/utils/event";

import { VideoResource,  PlayerType, QualityType } from "lib/models/video";
import { CapturedScreenshot, PlayerData } from "lib/models/player";
import { ShakaVideoManager, ShakaVideoContent } from "lib/player-content/shaka";
import { DefaultVideoManager, VideoContent } from "lib/player-content/video";
import { TranscriptionManager, TranscriptionContent } from "lib/player-content/transcription";
import { ThumbnailManager, ThumbnailCollectionContent } from "lib/player-content/thumbnail";

import { LanguageType } from "lib/models/language";
import { SubtitleType } from "lib/models/subtitle";

import { updateObjectAttribute } from "lib/utils/object";

import { SettingsManager } from "./settings";
import { MarkerManager } from "./marker";

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
    public settingsManager: SettingsManager;
    public markerManager: MarkerManager;
    public playerElement: HTMLElement;
    public mainVideoContainerElement: HTMLElement;
    public secondaryVideoContainerElement: HTMLElement;
    public transcriptionContainerElement: HTMLElement;
    public thumbnailContainerElement: HTMLElement;
    public mainVideoContent: VideoContent;
    public secondaryVideoContent: VideoContent;
    public transcriptionContent: TranscriptionContent;
    public thumbnailCollectionContent: ThumbnailCollectionContent;
    public userActivity: boolean;
    public userActivityTimer: any;
    private loadedData: PlayerData;
    private wrappedVideos: any;
    private eventRegistry: EventRegistry;
    private contentEventRegistry: EventRegistry;
    private videoSynchronizerInstance: any;
    private subtitlePlayerInstance: any;

    constructor(
        settingsManager: SettingsManager,
        markerManager: MarkerManager,
    ) {
        super();
        this.wrappedVideos = {};
        this.eventRegistry = new EventRegistry();
        this.contentEventRegistry = new EventRegistry();
        this.playerElement = null;
        this.settingsManager = settingsManager;
        this.markerManager = markerManager;
        this.userActivity = true;
        this.userActivityTimer = null;
    }

    public attachPlayer(playerElement: HTMLElement) {
        this.playerElement = playerElement;

        dispatchEvent(
            this.playerElement,
            PlayerEventType.PlayerAttached,
            {
                player: this,
            },
        );

        // Handlers
        // Listen to settings update submitted by player dom element
        const updateSettingsHandler = (event: any) => {
            const updatedSettings = event.updatedSettings;
            let reload = false;

            for (const settingUpdate of updatedSettings) {
                const key = settingUpdate[0];
                const value = settingUpdate[1];
                updateObjectAttribute(
                    this.settingsManager.settings,
                    key,
                    value,
                );

                if (
                    key.indexOf("language") === 0 ||
                    key.indexOf("player") === 0
                ) {
                    reload = true;
                }

                if (key.indexOf("subtitle.type") === 0) {
                    if (value === SubtitleType.None) {
                        this.subtitlePlayerInstance.hideCueTracks();
                    } else {
                        // Display the right subtitle
                        this.subtitlePlayerInstance.displayCueTrack(value);
                    }
                }

                if (key.indexOf("video.playbackSpeed") === 0) {
                    // Playback speed
                    this.mainVideoContent.videoElement.playbackRate = value;
                }

                if (key.indexOf("video.quality") === 0) {
                    this.updateMainVideoQuality();
                }
            }

            // Fire success event on player dom node
            dispatchEvent(
                this.playerElement,
                SettingsEventType.UpdateSuccess,
                {
                    player: this,
                },
            );

            // Reload content
            // if language has changed
            if (reload) {
                this.reload();
            }
        };

        // Add or update marker
        const addUpdateMarkerHandler = (event: any) => {
            const marker = event.marker;
            const successEventType = (!marker.id) ?
                MarkerEventType.AddSuccess :
                MarkerEventType.UpdateSuccess;

            // Create marker uuid
            if (!marker.id) {
                marker.id = uuid.v4();
            }

            // Add, update marker in database
            this.markerManager.setMarker(marker);

            dispatchEvent(
                this.playerElement,
                successEventType,
                {
                    player: this,
                    marker,
                },
            );
        };

        // Delete marker
        const deleteMarkerHandler = (event: any) => {
            const marker = event.marker;
            this.markerManager.removeMarker(marker.id);
            dispatchEvent(
                this.playerElement,
                MarkerEventType.DeleteSuccess,
                {
                    player: this,
                    marker,
                },
            );
        };

        // Listeners
        this.eventRegistry.register(
            this.playerElement,
            SettingsEventType.UpdateRequest,
            updateSettingsHandler,
        );
        this.eventRegistry.register(
            this.playerElement,
            MarkerEventType.AddRequest,
            addUpdateMarkerHandler,
        );
        this.eventRegistry.register(
            this.playerElement,
            MarkerEventType.UpdateRequest,
            addUpdateMarkerHandler,
        );
        this.eventRegistry.register(
            this.playerElement,
            MarkerEventType.DeleteRequest,
            deleteMarkerHandler,
        );
    }

    public attachContent(
        mainVideoContainerElement: HTMLElement,
        secondaryVideoContainerElement: HTMLElement,
        transcriptionContainerElement: HTMLElement,
        thumbnailContainerElement: HTMLElement,
    ) {
        this.mainVideoContainerElement = mainVideoContainerElement;
        this.secondaryVideoContainerElement = secondaryVideoContainerElement;
        this.transcriptionContainerElement = transcriptionContainerElement;
        this.thumbnailContainerElement = thumbnailContainerElement;
    }

    /**
     * Takes a capture screenshot
     */
    public captureScreenshot(width: number, height: number): CapturedScreenshot {
        // Create canvas with the dimension of video
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(this.mainVideoContent.videoElement, 0, 0, canvas.width, canvas.height);

        // Export to jpeg
        const imageData = canvas.toDataURL("image/jpeg");

        return {
            timecode: this.mainVideoContent.videoElement.currentTime,
            imageData,
        };
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
        const currentTime = (this.mainVideoContent) ?
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
        await this.loadThumbnailCollection();

        // Synchronize videos ?
        if (this.secondaryVideoContent) {
            this.videoSynchronizerInstance = videoSynchronizer.sync(
                this.mainVideoContent.videoElement,
                [this.secondaryVideoContent.videoElement],
            );
        }

        // Closed captions
        const subtitleType = this.settingsManager.settings.subtitle.type;

        // Display closed captions
        this.subtitlePlayerInstance = subtitlePlayer.wrap(
            this.mainVideoContent.videoElement,
        );

        if (data.subtitles) {
            for (const subtitleResource of data.subtitles) {
                await this.subtitlePlayerInstance.addCueTrack(
                    subtitleResource.type,
                    subtitleResource.url,
                );
            }
        }

        if (subtitleType !== SubtitleType.None) {
            // Display the right subtitle
            this.subtitlePlayerInstance.displayCueTrack(subtitleType);
        }

        // Playback speed
        this.mainVideoContent.videoElement.playbackRate = this.settingsManager.settings.video.playbackSpeed;

        // Content is loaded
        dispatchEvent(
            this.playerElement,
            PlayerEventType.ContentLoaded,
            { player: this },
        );

        this.mainVideoContent.videoElement.currentTime = currentTime;
        this.initMainVideoListeners();
        this.disableVideoContextMenus();
    }

    public destroy() {
        this.eventRegistry.unregisterAll();
        this.contentEventRegistry.unregisterAll();
        this.wrappedVideos = null;
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
                noneHandler,
            );
        });
    }

    private initMainVideoListeners() {
        const playingChangeHandler = (event: any) => {
            dispatchEvent(
                this.playerElement,
                PlayerEventType.PlayingChange,
                { player: this },
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
                this.transcriptionContent.wordHighlighterHandler,
            );
        }

        if (this.thumbnailCollectionContent &&
            this.settingsManager.settings.player.thumbnail.enabled
        ) {
            const gotoTimecodeHandler = (event: any) => {
                const buttonElement = event.target;
                const timecode = Math.round(parseInt(buttonElement.dataset.timecode, 10) / 1000);
                console.log(timecode);
                this.mainVideoContent.videoElement.currentTime = timecode;
            };

            // Click
            const buttonElements = this.thumbnailContainerElement.getElementsByTagName("button");

            Array.prototype.forEach.call(buttonElements, (element: HTMLElement) => {
                this.contentEventRegistry.register(
                    element,
                    "click",
                    gotoTimecodeHandler,
                );
            });
        }

        // Catch user activity
        if (this.userActivityTimer) {
            clearTimeout(this.userActivityTimer);
        }

        const userActivityHandler = (event: any) => {
            clearTimeout(this.userActivityTimer);

            if (!this.userActivity) {
                this.userActivity = true;
                dispatchEvent(
                    this.playerElement,
                    PlayerEventType.PlayingChange,
                    { player: this },
                );
            }

            // Consider there is no activity after 5 seconds
            this.userActivityTimer = setTimeout(() => {
                    this.userActivity = false;
                    dispatchEvent(
                        this.playerElement,
                        PlayerEventType.PlayingChange,
                        { player: this },
                    );
                },
                5000,
            );
        };

        const playerShortcutHandler = (event: any) => {
            const videoElement = this.mainVideoContent && this.mainVideoContent.videoElement || null;

            if (!videoElement) {
                return;
            }

            if (event.target && event.key === " ") {
                if (event.target.localName !== "body") {
                    return;
                }

                if (videoElement.paused) {
                    videoElement.play();
                } else {
                    videoElement.pause();
                }
            } else if (event.ctrlKey && event.key === "m") {
                // Pause video and open marker panel
                videoElement.pause();
                dispatchEvent(
                    this.playerElement,
                    MarkerEventType.AddFormDisplay,
                );
            }
        };


        this.eventRegistry.register(
            document,
            "mousemove",
            userActivityHandler,
        );
        this.eventRegistry.register(
            document,
            "keydown",
            userActivityHandler,
        );
        this.eventRegistry.register(
            document,
            "keydown",
            playerShortcutHandler,
        );
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
                    this.mainVideoContent,
                );
                this.mainVideoContent = null;
            }
        }

        this.mainVideoContent = await this.loadVideo(
            this.mainVideoContainerElement,
            videoResource,
        );

        // Update available qualities
        const availableQualities = [ QualityType.Auto ];

        if (this.mainVideoContent.videoResource.player === PlayerType.Shaka) {
            const videoContent = this.mainVideoContent as ShakaVideoContent;
            videoContent.availableQualities.forEach((quality: QualityType) => {
                availableQualities.push(quality);
            });
        }

        this.settingsManager.settings.video.availableQualities = availableQualities;
        this.updateMainVideoQuality();
    }

    private updateMainVideoQuality() {
        if (this.mainVideoContent.videoResource.player !== PlayerType.Shaka) {
            // Only shaka player is able to deal with video quality
            return;
        }

        const currentQuality = this.settingsManager.settings.video.quality;
        const videoContent = this.mainVideoContent as ShakaVideoContent;
        const shakaPlayer = videoContent.shakaPlayer;

        if (currentQuality === QualityType.Auto) {
            videoContent.shakaPlayer.configure("abr.enabled", true);
        } else {
            videoContent.shakaPlayer.configure("abr.enabled", false);

            // FIXME: select the right audio track
            for (const track of shakaPlayer.getVariantTracks()) {
                if (track.height === parseInt(currentQuality, 10)) {
                    shakaPlayer.selectVariantTrack(track, true);
                    break;
                }
            }
        }
    }

    /**
     * Load secondary video
     */
    private async loadSecondaryVideo() {
        const languageType = this.settingsManager.settings.language.type;
        let videoResource = null;

        if (languageType === LanguageType.CuedSpeech) {
            // Synchronized cued speech video
            videoResource = this.loadedData.cuedSpeechVideo;
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

        if (this.secondaryVideoContent) {
            // Remove old secondary video content
            await this.removeVideo(
                this.secondaryVideoContainerElement,
                this.secondaryVideoContent,
            );
            this.secondaryVideoContent = null;
        }

        if (!videoResource) {
            return;
        }

        this.secondaryVideoContent = await this.loadVideo(
            this.secondaryVideoContainerElement,
            videoResource,
        );
    }

    private async loadVideo(
        containerElement: HTMLElement,
        videoResource: VideoResource,
    ): Promise<VideoContent> {
        const contentManager = videoContentManagers[videoResource.player];
        return await contentManager.create(
            containerElement,
            videoResource,
        );
    }

    private async removeVideo(
        containerElement: HTMLElement,
        videoContent: VideoContent,
    ): Promise<void> {
        const contentManager = videoContentManagers[videoContent.videoResource.player];
        await contentManager.remove(
            containerElement,
            videoContent,
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
                    this.transcriptionContent,
                );
                this.transcriptionContent = null;
            }

            return;
        }

        // Load new transcription content
        this.transcriptionContent = await transcriptionManager.create(
            this.transcriptionContainerElement,
            this.loadedData.transcription,
        );
    }

    private async loadThumbnailCollection() {
        if (
            this.thumbnailCollectionContent
            && this.loadedData.thumbnailCollection
            && (
                this.thumbnailCollectionContent.thumbnailCollectionResource.url ===
                this.loadedData.thumbnailCollection.url
            )
        ) {
            // This is the same content do not reload
            return;
        }

        if (!this.loadedData.thumbnailCollection) {
            if (this.thumbnailCollectionContent) {
                // Remove old thumbnail content
                await thumbnailManager.remove(
                    this.thumbnailContainerElement,
                    this.thumbnailCollectionContent,
                );
                this.thumbnailCollectionContent = null;
            }
            return;
        }

        this.thumbnailCollectionContent = await thumbnailManager.create(
            this.thumbnailContainerElement,
            this.loadedData.thumbnailCollection,
        );
    }
}
