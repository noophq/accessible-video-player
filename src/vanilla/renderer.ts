import * as uuid from "uuid";

import { Translator } from "lib/core/translator";
import { BaseComponent } from "lib/vanilla/components/base";

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
            { id: this.id, t },
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
