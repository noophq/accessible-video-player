import * as uuid from "uuid";

import radioGroupView from "ejs-loader!lib/vanilla/views/radio-group.ejs";

import { Translator } from "lib/core/translator";
import { BaseComponent, ComponentProperties } from "lib/vanilla/components/base";
import { SkinRenderer } from "lib/models/skin";

import { renderIcon as defaultRenderIcon } from "./skin";

export interface RadioItem {
    label: string;
    id: string;
    value: string;
}

export class ComponentRenderer {
    private translator: Translator;
    private component: BaseComponent<ComponentProperties>;
    private childRenderers: any;
    private skinRenderer: any;
    private id: string;

    constructor(
        component: BaseComponent<ComponentProperties>,
        translator: Translator,
        skinRenderer: SkinRenderer
    ) {
        this.component = component;
        this.translator = translator;
        this.childRenderers = {};
        this.id = uuid.v4();
        this.skinRenderer = skinRenderer;
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

    public renderIcon(iconId: string, label: string): string {
        if (this.skinRenderer && this.skinRenderer.renderIcon) {
            return this.skinRenderer.renderIcon(iconId, label);
        }

        return defaultRenderIcon(iconId, label);
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
                this.translator,
                this.skinRenderer
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
