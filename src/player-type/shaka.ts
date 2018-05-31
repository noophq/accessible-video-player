import { VideoSource } from "lib/models/video";

declare var shaka: any;

// Install built-in polyfills to patch browser incompatibilities.
if (shaka.polyfill) {
    shaka.polyfill.installAll();
}

export class ShakaVideoWrapper {
    public async wrap(videoElement: HTMLVideoElement, videoSource: VideoSource) {
        // Check to see if the browser supports the basic APIs Shaka needs.
        if (!shaka.Player.isBrowserSupported()) {
            throw new Error("Shaka is not supported by your browser");
        }

        const displayError = (error: any) => {
            console.error("Video error", videoSource.url, "error code", error.code, "object", error);
        };

        // Everything looks good!
        const shakaPlayer = new shaka.Player(videoElement);
        shakaPlayer.addEventListener("error", (event: any) => {
            displayError(event.detail);
        });

        // Configure player
        const playerOptions = videoSource.playerOptions;
        shakaPlayer.configure(playerOptions.config);

        // Register request filters
        if (playerOptions.requestFilters) {
            const nwe = shakaPlayer.getNetworkingEngine();

            for (const requestFilter of playerOptions.requestFilters) {
                nwe.registerRequestFilter(
                    requestFilter(shakaPlayer, videoSource)
                );
            }
        }

        // Try to load a manifest.
        // This is an asynchronous process.
        try {
            await shakaPlayer.load(videoSource.url)
            console.log("Video has been loaded", videoSource.url);
        } catch (error) {
            displayError(error)
        };

        return {
            videoElement,
            videoSource,
            shakaPlayer,
        };
    }
}
