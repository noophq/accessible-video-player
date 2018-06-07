import { Resource } from "lib/models/player";

export interface ThumbnailCollectionContent {
    thumbnailCollectionElement: HTMLElement;
    thumbnailCollectionResource: Resource
}

export class ThumbnailManager {
    public async create(
        containerElement: HTMLElement,
        thumbnailCollectionResource: Resource
    ): Promise<ThumbnailCollectionContent> {
        // Download thumbnail collection
        const response = await fetch(thumbnailCollectionResource.url);
        const jsonResult = await response.json();

        // Create thumbnail collection Element
        const thumbnailCollectionElement = document.createElement("ul");
        thumbnailCollectionElement.className = "avp-thumbnail-collection";

        for (let index = 0; index < jsonResult.thumbnails.length; index++) {
            const jsonItem =  jsonResult.thumbnails[index];
            const thumbnailElement = document.createElement("li");
            thumbnailElement.innerHTML = '<button data-timecode="' + jsonItem.timecode + '"><img src="' + jsonItem.imageUrl + '" /></button>'
            thumbnailCollectionElement.appendChild(thumbnailElement);
        }

        containerElement.appendChild(thumbnailCollectionElement);

        return {
            thumbnailCollectionElement,
            thumbnailCollectionResource
        };
    }

    public async remove(
        containerElement: HTMLElement,
        thumbnailCollectionContent: ThumbnailCollectionContent
    ): Promise<void> {
        containerElement.innerHTML = "";
    }
}
