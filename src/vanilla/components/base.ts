
import { EventRegistry } from "lib/listeners/registry";
import { AvpObject, PlayerData } from "lib/models/player";

export abstract class BaseComponent {
    public view: any;
    protected avp: AvpObject;
    protected eventRegistry: EventRegistry;

    constructor(avp: AvpObject, view: any) {
        this.avp = avp;
        this.view = view;
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
