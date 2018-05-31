import { AvpObject } from "lib/models/player";

import videoView from "ejs-loader!lib/vanilla/views/video.ejs";

import { BaseComponent } from "./base";

import { VideoType, VideoSource } from "lib/models/video";

export class VideoComponent extends BaseComponent {
    private videoSource: VideoSource;
    private shakaPlayer: any;
    private videoType: VideoType;

    constructor(
        avp: AvpObject,
        videoType: VideoType,
        videoSource: VideoSource
    ) {
        super(avp, videoView);
        this.videoType = videoType;
        this.videoSource = videoSource;
    }

    public registerViewData() {
        return {
            "classname": "avp-" + this.videoType.toLowerCase() + "-video-container"
        };
    }

    public async registerDomElements(rootElement: HTMLElement): Promise<any> {
        const videoElement = rootElement.getElementsByTagName("video")[0];

        // Notify player
        await this.avp.player.attachVideo(
            this.videoType,
            this.videoSource,
            videoElement
        );

        return {
            video: videoElement
        };
    }
}
