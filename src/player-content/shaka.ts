import { VideoResource } from "lib/models/video";
import { VideoContent } from "./video";

declare var shaka: any;

// Install built-in polyfills to patch browser incompatibilities.
if (shaka.polyfill) {
    shaka.polyfill.installAll();
}

export interface ShakaVideoContent extends VideoContent {
    shakaPlayer: any;
    availableQualities: string[],
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
        const availableQualities: string[] = [];

        try {
            await shakaPlayer.load(videoResource.url)
            console.log("Video has been loaded", videoResource.url);

            // Get available qualities
            for (const track of shakaPlayer.getVariantTracks()) {
                const quality = "" + track.height;
                if (availableQualities.indexOf(quality) >= 0) {
                    continue;
                }
                // convert into string
                availableQualities.push(quality);
            }
        } catch (error) {
            displayError(error)
        };

        // Sort by resolution: lower to higher
        availableQualities.sort();

        return {
            videoElement,
            videoResource,
            shakaPlayer,
            availableQualities
        };
    }

    public async remove(
        containerElement: HTMLElement,
        videoContent: ShakaVideoContent
    ): Promise<void> {
        await videoContent.shakaPlayer.destroy();
        containerElement.innerHTML = "";
    }
}
