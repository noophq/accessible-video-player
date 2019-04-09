import { Marker, MarkerDictionary } from "lib/models/marker";

type CreationHookFunc = (timecode: number) => Marker;

/**
 * Manage markers
 */
export class MarkerManager {
    private _markers: MarkerDictionary;
    private _creationHook: CreationHookFunc;

    public constructor() {
        this._markers = {};
        this._creationHook = null;
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

    public registerCreationHook(creationHook: CreationHookFunc) {
        this._creationHook = creationHook;
    }

    public createNewMarker(timecode: number): Marker {
        if (this._creationHook) {
            return this._creationHook(timecode);
        }

        return {
            id: null,
            title: "",
            description: "",
            timecode,
        };
    }
}
