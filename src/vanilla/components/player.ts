import playerView from "ejs-loader!lib/vanilla/views/player.ejs";

import { PlayerEventType, SettingsEventType } from "lib/models/event";

import { ControlBarComponent } from "./control-bar";
import { VideoComponent } from "./video";
import { TranscriptionPanelComponent } from "./transcription-panel";
import { ThumbnailPanelComponent } from "./thumbnail-panel";
import { BaseComponent, ComponentProperties } from "./base";
import { TimeBarComponent } from "./time-bar";
import { LanguageType } from "lib/models/language";
import { Player } from "lib/core/player";

export class PlayerComponent extends BaseComponent<ComponentProperties> {
    public view = playerView;

    public registerChilds() {
        return {
            controlBar: new ControlBarComponent(this.props),
            mainVideo: new VideoComponent(Object.assign(
                {},
                this.props as any,
                { name: "main" }
            )),
            secondaryVideo: new VideoComponent(Object.assign(
                {},
                this.props as any,
                { name: "secondary" }
            )),
            transcriptionPanel: new TranscriptionPanelComponent(this.props),
            thumbnailPanel: new ThumbnailPanelComponent(this.props),
            timeBar: new TimeBarComponent(this.props),
        }
    }

    /**
     * Returns a list of additional class names
     */
    private buildClassNames(rootElement?: HTMLElement, player?: any): string[] {
        const classNames = ["avp-player"];

        if (this.props.settings.player.transcription.enabled) {
            classNames.push("avp-transcription-enabled");
        } else {
            classNames.push("avp-transcription-disabled");
        }

        if (this.props.settings.player.thumbnail.enabled) {
            classNames.push("avp-thumbnail-enabled");
        } else {
            classNames.push("avp-thumbnail-disabled");
        }

        const languageType = this.props.settings.language.type;

        if (
            languageType === LanguageType.CuedSpeech ||
            languageType === LanguageType.SignedLanguage
        ) {
            classNames.push("avp-secondary-video-enabled");
        } else {
            classNames.push("avp-secondary-video-disabled");
        }

        if (rootElement) {
            if (document.fullscreenEnabled && document.fullscreenElement === rootElement) {
                classNames.push("avp-fullscreen-enabled");
            }
        }

        if (player && player.mainVideoContent) {
            const mainVideoElement = player.mainVideoContent.videoElement;

            if (!mainVideoElement.paused) {
                classNames.push("avp-playing");
            }
        }

        return classNames;
    }

    public registerViewData() {
        return {
            "classnames": this.buildClassNames().join(" ")
        };
    }

    public async registerDomElements(rootElement: HTMLElement): Promise<any> {
        return {
            root: rootElement
        }
    }

    private updateRootClassname(rootElement: HTMLElement, player?: any) {
        rootElement.className = this.buildClassNames(
            rootElement,
            player,
        ).join(" ");
    }

    public async updateView(
        rootElement: HTMLElement,
        domElements: any,
        player: any
    ) {
        // Unregister all events
        this.eventRegistry.unregisterAll();

        // Update view
        this.updateRootClassname(rootElement);

        // Handlers
        const playingChangeHandler = (event: any) => {
            this.updateRootClassname(rootElement, player);
        };

        // Listeners
        this.eventRegistry.register(
            rootElement,
            PlayerEventType.PlayingChange,
            playingChangeHandler
        );
        this.eventRegistry.register(
            document,
            "fullscreenchange",
            playingChangeHandler
        );
    }
}
