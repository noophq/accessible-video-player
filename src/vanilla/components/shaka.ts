import { AvpObject, PlayerData } from "lib/models/player";

import videoView from "ejs-loader!lib/vanilla/views/video.ejs";

import { BaseComponent } from "./base";

import { VideoType } from "lib/models/video";

import { buildUrlWithQueryParams } from "lib/utils/url";

declare var shaka: any;

export class ShakaVideoComponent extends BaseComponent {
    private videoUrl: string;
    private shakaPlayer: any;
    private wrapperElement: HTMLElement;
    public videoElement: HTMLVideoElement;
    private playerOptions: any;
    private videoType: VideoType;

    constructor(
        avp: AvpObject,
        videoType: VideoType,
        videoUrl: string,
        playerOptions?: any
    ) {
        super(avp);
        this.videoType = videoType,
        this.videoUrl = videoUrl;
        this.playerOptions = playerOptions;
    }

    public async render() {
        return videoView(this.prepareViewData({
            "classname": "avp-" + this.videoType.toLowerCase() + "-video-container"
        }));
    }

    public async postRender(): Promise<any> {
        // Install built-in polyfills to patch browser incompatibilities.
        shaka.polyfill.installAll();
        this.wrapperElement = document.getElementById(this.id);
        this.videoElement = this.wrapperElement.getElementsByTagName("video")[0];

         // Check to see if the browser supports the basic APIs Shaka needs.
        if (shaka.Player.isBrowserSupported()) {
            // Everything looks good!
            this.shakaPlayer = new shaka.Player(this.videoElement);
            this.shakaPlayer.addEventListener("error", (event: any) => {
                const error = event.detail;
                console.error("video error", this.videoUrl, "error code", error.code, "object", error);
            });

            // Configure player
            this.shakaPlayer.configure(this.playerOptions.shakaConfig);

            // Register request filter for DRM
            if (this.playerOptions.drmConfig) {
                var nwe = this.shakaPlayer.getNetworkingEngine()

                nwe.registerRequestFilter(this.widevineRequestFilter());
                nwe.registerRequestFilter(this.playreadyRequestFilter());
              }

            // Try to load a manifest.
            // This is an asynchronous process.
            try {
                await this.shakaPlayer.load(this.videoUrl)
                console.log("Video has been loaded", this.videoUrl);
            }
            catch (error) {
                console.error("Video error", this.videoUrl, "error code", error.code, "object", error);
            };
        } else {
            // This browser does not have the minimum set of APIs we need.
            console.error("Browser not supported!");
        }
    }

    private widevineRequestFilter() {
        const shakaPlayer = this.shakaPlayer;
        const drmServerUrl = this.playerOptions.shakaConfig.drm.servers["com.widevine.alpha"];
        const drmAdditionalParams = this.playerOptions.drmConfig.additionalParams;

        return function (type: any, request: any) {
            if (type !== shaka.net.NetworkingEngine.RequestType.LICENSE) {
                return
            }

            if (!request.uris || request.uris[0] !== drmServerUrl) {
                return
            }

            if (shakaPlayer.drmInfo().keyIds.length <= 0) {
                throw new Error('No KID found in manifest.')
            }

            request.uris[0] = buildUrlWithQueryParams(
                request.uris[0],
                drmAdditionalParams
            );
        }
    }

    private playreadyRequestFilter() {
        const drmServerUrl = this.playerOptions.shakaConfig.drm.servers["com.microsoft.playready"];

        return function (type: any, request: any) {
            if (type !== shaka.net.NetworkingEngine.RequestType.LICENSE) {
                return
            }

            if (!request.uris || request.uris[0] !== drmServerUrl) {
                return
            }
        }
     }
}
