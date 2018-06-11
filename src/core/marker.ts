import { Marker, MarkerDictionary } from "lib/models/marker";

/**
 * Manage markers
 */
export class MarkerManager {
    private _markers: MarkerDictionary;

    public constructor() {
        this._markers = {};
    }

    get markers(): Marker[] {
        return Object.values(this._markers);
    }

    set markers(markers: Marker[]) {
        this._markers = {};

        markers.forEach((marker: Marker) => {
            this._markers[marker.id] = marker;
        });
    }

    public setMarker(marker: Marker): void {
        this._markers[marker.id] = marker;
    }

    public removeMarker(id: string): void {
        delete this._markers[id];
    }

    public removeAllMarkers(): void {
        this._markers = {};
    }

}
