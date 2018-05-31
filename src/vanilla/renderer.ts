import * as uuid from "uuid";

import { Translator } from "lib/core/translator";
import { BaseComponent } from "lib/vanilla/components/base";

import radioGroupView from "ejs-loader!lib/vanilla/views/radio-group.ejs";
import svgView from "ejs-loader!lib/vanilla/views/svg.ejs";

import pauseIcon from "app/assets/icons/pause.svg";
import playIcon from "app/assets/icons/play.svg";
import markerIcon from "app/assets/icons/marker.svg";
import volumeOnIcon from "app/assets/icons/volume-on.svg";
import fullscreenOffIcon from "app/assets/icons/fullscreen-off.svg";
import settingsIcon from "app/assets/icons/settings.svg";

const SVG_ICONS: any = {
    "pause": pauseIcon,
    "play": playIcon,
    "marker": markerIcon,
    "volume": volumeOnIcon,
    "settings": settingsIcon,
    "fullscreen-off": fullscreenOffIcon,
}

export interface RadioItem {
    label: string;
    id: string;
    value: string;
}

export class ComponentRenderer {
    private translator: Translator;
    private component: BaseComponent;
    private childRenderers: any;
    private id: string;

    constructor(
        component: BaseComponent,
        translator: Translator
    ) {
        this.component = component;
        this.translator = translator;
        this.childRenderers = {};
        this.id = uuid.v4();
    }

    public renderRadioGroup(formId: any, inputName: any, radioItems: any) {
        const t = this.translator.translate.bind(this.translator);
        return radioGroupView(
            {
                t,
                formId,
                inputName,
                radioItems
            }
        );
    }

    public renderIcon(iconId: any, label: any) {
        if (SVG_ICONS.hasOwnProperty(iconId)) {
            return svgView({
                icon: SVG_ICONS[iconId],
                label
            });
        } else if (iconId == "next") {
            return '<span "avp-icon avp-icon-next">&gt;</span>';
        } else if (iconId == "previous" || iconId == "back") {
            return '<span "avp-icon avp-icon-previous">&lt;</span>';
        }

        return label;
    }

    public render() {
        // Lifecycle:
        // - call component::registerChilds()
        // - call component::registerViewData()
        // - render component childs
        // - render component it self
        const t = this.translator.translate.bind(this.translator);
        const childs: any = this.component.registerChilds();
        const viewData: any = Object.assign(
            {},
            {
                id: this.id,
                t,
                renderRadioGroup: this.renderRadioGroup.bind(this),
                renderIcon : this.renderIcon.bind(this)
            },
            this.component.registerViewData()
        );

        for (const key of Object.keys(childs)) {
            // Append view
            const childRenderer = new ComponentRenderer(
                childs[key],
                this.translator
            )
            this.childRenderers[key] = childRenderer;
            viewData[key] =  childRenderer.render();
        }

        // Render view
        const viewResult = this.component.view(viewData);
        return viewResult;
    }

    /**
     * Update dom tree by adding events
     */
    public async update() {
        const domElements = {};
        await this.buildDomElements(domElements);
        await this.postDomUpdate(domElements);
    }

    private async postDomUpdate(domElements: any): Promise<void> {
        for (const key of Object.keys(this.childRenderers)) {
            await this.childRenderers[key].postDomUpdate(domElements);
        }

        await this.component.postDomUpdate(
            document.getElementById(this.id),
            domElements
        );
    }

    private async buildDomElements(domElements: any, componentKey: string = "origin"): Promise<void> {
        for (const key of Object.keys(this.childRenderers)) {
            await this.childRenderers[key].buildDomElements(domElements, key);
        }

        domElements[componentKey] = await this.component.registerDomElements(
            document.getElementById(this.id)
        );
    }
}
