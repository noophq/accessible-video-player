import { AvpObject, PlayerData } from "lib/models/player";

import playerView from "ejs-loader!lib/vanilla/views/player.ejs";

import { ControlBarComponent } from "./control-bar";
import { ShakaVideoComponent } from "./shaka";
import { BaseComponent } from "./base";

export class PlayerComponent extends BaseComponent {
    private playerData: PlayerData;
    private rootElement: HTMLElement;
    private controlBarComponent: ControlBarComponent;
    private mainVideoComponent: ShakaVideoComponent;

    constructor(
        avp: AvpObject,
        playerData: PlayerData,
        rootElement: HTMLElement,
    ) {
        super(avp);
        this.rootElement = rootElement;
        this.playerData = playerData;

        // Initialize child renderers
        this.controlBarComponent = new ControlBarComponent(this.avp);
        this.mainVideoComponent = new ShakaVideoComponent(
            this.avp,
            playerData.mainVideo.url,
        );
    }

    public async render(): Promise<any> {
        // Control bar
        const controlBar = await this.controlBarComponent.render();

        // Main video
        const mainVideo = await this.mainVideoComponent.render();

        // Render player
        this.rootElement.innerHTML = playerView(
            this.prepareViewData({
                id: this.id,
                controlBar,
                mainVideo
            })
        );

        // Notify child renderers that rendering has been done
        await this.mainVideoComponent.postRender();
        await this.controlBarComponent.postRender();
        this.controlBarComponent.bindVideo(this.mainVideoComponent.videoElement);
        this.avp.player.attach(this.mainVideoComponent.videoElement);
    }
}
