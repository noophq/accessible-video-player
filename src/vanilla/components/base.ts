import { dispatchEvent } from "lib/utils/event";
import { EventRegistry } from "lib/event/registry";
import { PlayerEventType, SettingsEventType } from "lib/models/event";
import { GlobalSettings } from "lib/models/settings";
import { Player } from "lib/core/player";

export interface ComponentProperties {
    settings: GlobalSettings;
}

export abstract class BaseComponent<T extends ComponentProperties> {
    protected props: T;
    protected eventRegistry: EventRegistry;
    private baseEventRegistry: EventRegistry;
    public view: any;

    constructor(props: T) {
        this.props = props;
        this.eventRegistry = new EventRegistry();
        this.baseEventRegistry = new EventRegistry();
    }

    public registerChilds() {
        // register child components
        return {};
    }

    public registerViewData() {
        // register view data
        return {};
    }

    public async registerDomElements(rootElement: HTMLElement) {
        return {};
    }

    protected getMainVideoElement(domElements: any) {
        const mainVideoContainerElement = domElements["origin"]["mainVideoContainer"];
        return mainVideoContainerElement.getElementsByTagName("video")[0];
    }

    public async postDomUpdate(rootElement: HTMLElement, domElements: any): Promise<any> {
        const playerElement = domElements["origin"]["root"];

        // Handlers
        const settingsUpdateHandler = (event: any) => {
            const player: Player = event.player;
            this.props = Object.assign(
                {},
                this.props,
                {
                    settings: player.settingsManager.settings
                }
            );
            this.updateView(rootElement, domElements, player);
        };
        const contentLoadedHandler = (event: any) => {
            const player: Player = event.player;
            this.updateView(rootElement, domElements, player);
        };

        // Listeners
        this.baseEventRegistry.register(
            playerElement,
            SettingsEventType.UpdateSuccess,
            settingsUpdateHandler
        );
        this.baseEventRegistry.register(
            playerElement,
            PlayerEventType.ContentLoaded,
            contentLoadedHandler
        );
    }

    public async updateView(
        rootElement: HTMLElement,
        domElements: any,
        player: any
    ) {
        // Update view
    }

    /**
     * Update player settings
     * @param domElements All registered dom elements
     * @param updatedSettings List of settings to update
     *      [["l0.attr2", "test"], ["l1", false]]
     */
    protected updateSettings(domElements: any, updatedSettings: any) {
        const playerElement = domElements["origin"]["root"];

        // Alert player about a settings change
        dispatchEvent(
            playerElement,
            SettingsEventType.UpdateRequest,
            {
                updatedSettings
            }
        );
    }

    public async destroy() {
        this.baseEventRegistry.unregisterAll();
        this.eventRegistry.unregisterAll();
    }
}
