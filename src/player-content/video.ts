import { VideoResource } from "lib/models/video";

export interface VideoContent {
    videoElement: HTMLVideoElement;
    videoResource: VideoResource
}

export class DefaultVideoManager {
    public async create(
        containerElement: HTMLVideoElement,
        videoResource: VideoResource
    ): Promise<VideoContent> {
        // Create videoElement
        const videoElement = document.createElement("video");
        containerElement.appendChild(videoElement);

        return {
            videoElement,
            videoResource
        };
    }

    public async remove(
        containerElement: HTMLElement,
        videoContent: VideoContent
    ): Promise<void> {
        containerElement.innerHTML = "";
    }
}
