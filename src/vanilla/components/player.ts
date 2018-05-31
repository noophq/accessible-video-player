import { AvpObject, PlayerData } from "lib/models/player";

import playerView from "ejs-loader!lib/vanilla/views/player.ejs";

import { PlayerEventType } from "lib/models/event";
import { VideoType } from "lib/models/video";

import { ControlBarComponent } from "./control-bar";
import { VideoComponent } from "./video";
import { BaseComponent } from "./base";

export class PlayerComponent extends BaseComponent {
    private playerData: PlayerData;

    constructor(
        avp: AvpObject,
        playerData: PlayerData
    ) {
        super(avp, playerView);
        this.playerData = playerData;
    }

    public registerChilds() {
        return {
            controlBar: new ControlBarComponent(this.avp),
            mainVideo: new VideoComponent(
                this.avp,
                VideoType.Main,
                this.playerData.mainVideo
            )
        }
    }

    public async registerDomElements(rootElement: HTMLElement): Promise<any> {
        this.avp.player.attachPlayer(rootElement);

        return {
            root: rootElement,
        }
    }

    public async postDomUpdate(rootElement: HTMLElement, domElements: any): Promise<any> {
        // Handlers
        const playingChangeHandler = (event: any) => {
            if (event.target.paused) {
                rootElement.classList.remove("avp-playing");
            } else {
                rootElement.classList.add("avp-playing");
            }
        };

        // Listeners
        this.eventRegistry.register(
            rootElement,
            PlayerEventType.PLAYING_CHANGE,
            playingChangeHandler
        );
    }
}
