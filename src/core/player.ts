import { EventRegistry } from "lib/listeners/registry";

export class Player {
    private mainVideoElement: HTMLVideoElement;
    private eventRegistry: EventRegistry;

    constructor() {
        this.mainVideoElement = null;
        this.eventRegistry = new EventRegistry();
    }

    public attach(mainVideoElement: HTMLVideoElement) {
        this.mainVideoElement = mainVideoElement;
    }

    public destroy() {
        this.eventRegistry.unregisterAll();
        this.mainVideoElement = null;
    }

    public play() {
        this.mainVideoElement.play();
    }

    public pause() {
        this.mainVideoElement.pause();
    }

    public setVolume(value: number) {
        console.log("Volume set to ", value);
    }
}
