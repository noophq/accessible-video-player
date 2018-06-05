import { Resource } from "lib/models/player";

export interface ThumbnailContent {
    thumbnailElement: HTMLElement;
    thumbnailResource: Resource
}

export class ThumbnailManager {
    public async create(
        containerElement: HTMLElement,
        thumbnailResource: Resource
    ): Promise<ThumbnailContent> {
        // Download thumbnail collection
        const result = await fetch(thumbnailResource.url);

        // Create thumbnail collection Element
        const thumbnailElement = document.createElement("div");
        thumbnailElement.className = "avp-thumbnail";
        containerElement.appendChild(thumbnailElement);

        return {
            thumbnailElement,
            thumbnailResource
        };
    }

    public async remove(
        containerElement: HTMLElement,
        ThumbnailContent: ThumbnailContent
    ): Promise<void> {
        containerElement.innerHTML = "";
    }
}
