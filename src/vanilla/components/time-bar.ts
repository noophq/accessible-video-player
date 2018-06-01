import timeBarView from "ejs-loader!lib/vanilla/views/control-bar.ejs";

import { BaseComponent, ComponentProperties } from "./base";
import { renderRangeSlider } from "lib/utils/range-slider";
import { initPopin, togglePopin } from "lib/utils/popin";

export class TimeBarComponent extends  BaseComponent<ComponentProperties> {
    public view = timeBarView;

    public async registerDomElements(rootElement: HTMLElement): Promise<any> {
        const timeBarInputElement = rootElement.getElementsByTagName("input")[0];
        this.eventRegistry.register(
            timeBarInputElement,
            "input",
            (event: any) => {
                console.log(event.target.value);
            }
        );

        return {
            timeBarInput: timeBarInputElement
        };
    }
}
