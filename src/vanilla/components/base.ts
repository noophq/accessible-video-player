import { EventRegistry } from "lib/event/registry";
import { GlobalSettings } from "lib/models/settings";

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
    }
}
