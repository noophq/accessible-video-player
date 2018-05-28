import { AvpObject, PlayerData } from "lib/models/player";

import videoView from "ejs-loader!lib/vanilla/views/video.ejs";

import { BaseComponent } from "./base";

declare var shaka: any;

export class ShakaVideoComponent extends BaseComponent {
    private videoUrl: string;
    private shakaPlayer: any;
    private wrapperElement: HTMLElement;
    public videoElement: HTMLVideoElement;

    constructor(avp: AvpObject, videoUrl: string) {
        super(avp);
        this.videoUrl = videoUrl;
    }

    public async render() {
        return videoView(this.prepareViewData({}));
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
}
