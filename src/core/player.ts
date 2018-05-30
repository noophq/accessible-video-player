import { PlayerEventType } from "lib/models/event";
import { EventRegistry } from "lib/listeners/registry";
import { dispatchEvent } from "lib/utils/event";

export class Player {
    private mainVideoElement: HTMLVideoElement;
    private eventRegistry: EventRegistry;

    constructor() {
        this.mainVideoElement = null;
        this.eventRegistry = new EventRegistry();
    }

    public attach(mainVideoElement: HTMLVideoElement) {
        this.mainVideoElement = mainVideoElement;
        const playingChangeHandler = (event: any) => {
            dispatchEvent(
                this.mainVideoElement,
                PlayerEventType.PLAYING_CHANGE
            );
        };

        this.eventRegistry.register(
            mainVideoElement,
            "playing",
            playingChangeHandler,
        );
        this.eventRegistry.register(
            mainVideoElement,
            "pause",
            playingChangeHandler,
        );
        this.eventRegistry.register(
            mainVideoElement,
            "ended",
            playingChangeHandler,
        );
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

    /**
     * Set player volume
     *
     * @param value volume value between 0 and 100
     */
    public set volume(value: number) {
        this.mainVideoElement.volume = value/100;
    }

    public get volume(): number {
        return this.mainVideoElement.volume*100;
    }
}
