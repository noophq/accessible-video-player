import markerItemView from "ejs-loader!lib/vanilla/views/marker-item.ejs";
import { BaseComponent, ComponentProperties } from "./base";

export class MarkerItemComponent extends BaseComponent<ComponentProperties> {
    public view = markerItemView;

    public registerViewData() {
        return {
            title: "",
            description: "",
        };
    }

    public async registerDomElements(rootElement: HTMLElement): Promise<any> {
        return {
            root: rootElement,
        };
    }
}
