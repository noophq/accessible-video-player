import { AvpObject, PlayerData } from "lib/models/player";

import playerView from "ejs-loader!lib/vanilla/views/player.ejs";

import { VideoType } from "lib/models/video";

import { ControlBarComponent } from "./control-bar";
import { ShakaVideoComponent } from "./shaka";
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
            mainVideo: new ShakaVideoComponent(
                this.avp,
                VideoType.Main,
                this.playerData.mainVideo.url,
                this.playerData.mainVideo.playerOptions
            )
        }
    }

    public async postDomUpdate(rootElement: HTMLElement, domElements: any): Promise<any> {
        const mainVideoElement =  domElements["mainVideo"]["video"];

        // Notify player
        this.avp.player.attach(mainVideoElement);
    }
}
