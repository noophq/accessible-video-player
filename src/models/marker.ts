export interface Marker {
    id: string;
    timecode: number;
    title: string;
    description?: string;
}

export interface MarkerDictionary {
    [index: string]: Marker;
}
