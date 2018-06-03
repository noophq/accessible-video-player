import { dispatchEvent } from "lib/utils/event";
import { EventRegistry } from "lib/event/registry";
import { SettingsEventType } from "lib/models/event";
import { GlobalSettings } from "lib/models/settings";
import { Player } from "lib/core/player";

export interface ComponentProperties {
    settings: GlobalSettings;
}

export abstract class BaseComponent<T extends ComponentProperties> {
    protected props: T;
    protected eventRegistry: EventRegistry;
    public view: any;

    constructor(props: T) {
        this.props = props;
        this.eventRegistry = new EventRegistry();
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
            this.updateView(rootElement, domElements);
        };

        // Listeners
        this.eventRegistry.register(
            playerElement,
            SettingsEventType.UpdateSuccess,
            settingsUpdateHandler
        );
    }

    public async updateView(rootElement: HTMLElement, domElements: any) {
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
}
