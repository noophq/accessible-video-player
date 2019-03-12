import {
    Resource,
    Thumbnail,
    ThumbnailCollectionResource,
} from "lib/models/player";

export interface ThumbnailCollectionContent {
    thumbnailCollectionElement: HTMLElement;
    thumbnailCollectionResource: ThumbnailCollectionResource;
}

export class ThumbnailManager {
    public async create(
        containerElement: HTMLElement,
        resource: ThumbnailCollectionResource,
    ): Promise<ThumbnailCollectionContent> {
        let thumbnails = [];

        if (resource.url) {
            thumbnails = await this.downloadThumbnailCollection(
                resource as Resource,
            );
        } else {
            thumbnails = resource.thumbnails;
        }

        const thumbnailCollectionElement = this.createThumbnailCollection(
            containerElement,
            thumbnails,
        );

        return {
            thumbnailCollectionElement,
            thumbnailCollectionResource: resource,
        };
    }

    public async downloadThumbnailCollection(resource: Resource) {
        // Download thumbnail collection
        const response = await fetch(resource.url);
        const jsonResult = await response.json();
        return jsonResult.thumbnails;
    }

    public createThumbnailCollection(
        containerElement: HTMLElement,
        thumbnails: Thumbnail[],
    ): HTMLElement {
        // Create thumbnail collection Element
        const thumbnailCollectionElement = document.createElement("ul");
        thumbnailCollectionElement.className = "avp-thumbnail-collection";

        for (const thumbnail of thumbnails) {
            const thumbnailElement = document.createElement("li");
            thumbnailElement.innerHTML = '<button data-timecode="'
                + thumbnail.timecode + '"><img src="'
                + thumbnail.imageUrl + '" /></button>';
            thumbnailCollectionElement.appendChild(thumbnailElement);
        }

        containerElement.appendChild(thumbnailCollectionElement);
        return containerElement;
    }

    public async remove(
        containerElement: HTMLElement,
        __0: ThumbnailCollectionContent,
    ): Promise<void> {
        containerElement.innerHTML = "";
    }
}
