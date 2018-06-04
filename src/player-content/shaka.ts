import { VideoResource } from "lib/models/video";
import { VideoContent } from "./video";

declare var shaka: any;

// Install built-in polyfills to patch browser incompatibilities.
if (shaka.polyfill) {
    shaka.polyfill.installAll();
}

export interface ShakaVideoContent extends VideoContent {
    shakaPlayer: any;
}

export class ShakaVideoManager {
    public async create(
        containerElement: HTMLElement,
        videoResource: VideoResource
    ): Promise<ShakaVideoContent> {
        // Create videoElement
        const videoElement = document.createElement("video");
        containerElement.appendChild(videoElement);

        // Check to see if the browser supports the basic APIs Shaka needs.
        if (!shaka.Player.isBrowserSupported()) {
            throw new Error("Shaka is not supported by your browser");
        }

        const displayError = (error: any) => {
            console.error("Video error", videoResource.url, "error code", error.code, "object", error);
        };

        // Everything looks good!
        const shakaPlayer = new shaka.Player(videoElement);
        shakaPlayer.addEventListener("error", (event: any) => {
            displayError(event.detail);
        });

        // Configure player
        const playerOptions = videoResource.playerOptions;
        if (playerOptions) {
            shakaPlayer.configure(playerOptions.config);

            // Register request filters
            if (playerOptions.requestFilters) {
                const nwe = shakaPlayer.getNetworkingEngine();

                for (const requestFilter of playerOptions.requestFilters) {
                    nwe.registerRequestFilter(
                        requestFilter(shakaPlayer, videoResource)
                    );
                }
            }
        }

        // Try to load a manifest.
        // This is an asynchronous process.
        try {
            await shakaPlayer.load(videoResource.url)
            console.log("Video has been loaded", videoResource.url);
        } catch (error) {
            displayError(error)
        };

        return {
            videoElement,
            videoResource,
            shakaPlayer,
        };
    }
}
