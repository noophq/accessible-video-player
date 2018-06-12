import playerView from "ejs-loader!lib/vanilla/views/player.ejs";

import { PlayerEventType, SettingsEventType } from "lib/models/event";
import { LanguageType } from "lib/models/language";
import { Player } from "lib/core/player";

import { MarkerFormComponent } from "./marker-form";
import { ControlBarComponent } from "./control-bar";
import { VideoComponent } from "./video";
import { TranscriptionPanelComponent } from "./transcription-panel";
import { ThumbnailPanelComponent } from "./thumbnail-panel";
import { BaseComponent, ComponentProperties } from "./base";
import { TimeBarComponent } from "./time-bar";

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
            markerForm: new MarkerFormComponent(this.props)
        }
    }

    /**
     * Returns a list of additional class names
     */
    private buildClassNames(rootElement?: HTMLElement, player?: any): string[] {
        const classNames = ["avp-player"];

        if (this.props.settings.skin.name) {
            classNames.push("avp-skin-" + this.props.settings.skin.name);
        }

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

        // Mouse and keyboard activity
        if (player && !player.userActivity) {
            classNames.push("avp-no-user-activity");
        }

        // Subtitles
        const subtitleSettings = this.props.settings.subtitle;
        classNames.push("avp-subtitle-font-" + subtitleSettings.font.toLocaleLowerCase());
        classNames.push("avp-subtitle-font-color-" + subtitleSettings.fontColor.toLocaleLowerCase());
        classNames.push("avp-subtitle-bg-color-" + subtitleSettings.backgroundColor.toLocaleLowerCase());
        classNames.push("avp-subtitle-scaling-factor-" + subtitleSettings.scalingFactor*100);
        return classNames;
    }

    public registerViewData() {
        return {
            "classnames": this.buildClassNames().join(" ")
        };
    }

    public async registerDomElements(rootElement: HTMLElement): Promise<any> {
        const mainVideoContainerElement = rootElement.getElementsByClassName("avp-main-video-container")[0];

        return {
            root: rootElement,
            mainVideoContainer: mainVideoContainerElement,
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
        // Update view
        this.updateRootClassname(rootElement, player);

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
