import { PlayerEventType } from "lib/models/event";
import { EventRegistry } from "lib/listeners/registry";
import { dispatchEvent } from "lib/utils/event";

import { VideoSource, VideoType, PlayerType } from "lib/models/video";
import { ShakaVideoWrapper } from "lib/player-type/shaka";
import { DefaultVideoWrapper } from "lib/player-type/default";

const VIDEO_WRAPPERS: any = {};
VIDEO_WRAPPERS[PlayerType.Default] = new DefaultVideoWrapper();
VIDEO_WRAPPERS[PlayerType.Shaka] = new ShakaVideoWrapper();

export class Player {
    private wrappedVideos: any;
    private eventRegistry: EventRegistry;
    private playerElement: HTMLElement;

    constructor() {
        this.wrappedVideos = {};
        this.eventRegistry = new EventRegistry();
        this.playerElement = null;
    }

    public async attachPlayer(playerElement: HTMLElement) {
        this.playerElement = playerElement;
    }

    public async attachVideo(
        videoType: VideoType,
        videoSource: VideoSource,
        videoElement: HTMLVideoElement,
    ) {
        const videoWrapper = VIDEO_WRAPPERS[videoSource.player];
        this.wrappedVideos[videoType] = await videoWrapper.wrap(
            videoElement,
            videoSource
        );

        if (videoType === VideoType.Main) {
            const playingChangeHandler = (event: any) => {
                dispatchEvent(
                    this.playerElement,
                    PlayerEventType.PlayingChange
                );
                console.log("playing change");
            };

            this.eventRegistry.register(
                videoElement,
                "playing",
                playingChangeHandler,
            );
            this.eventRegistry.register(
                videoElement,
                "pause",
                playingChangeHandler,
            );
            this.eventRegistry.register(
                videoElement,
                "ended",
                playingChangeHandler,
            );
        }
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
