import { VideoSource } from "lib/models/video";

export class DefaultVideoWrapper {
    public async wrap(videoElement: HTMLVideoElement, videoSource: VideoSource) {
        return {
            videoElement,
            videoSource
        };
    }
}
