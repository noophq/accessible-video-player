import * as uuid from "uuid";

import { AvpObject, PlayerData } from "lib/models/player";

export abstract class BaseComponent {
    protected avp: AvpObject;
    public id: string;

    constructor(avp: AvpObject) {
        this.id = uuid.v4();
        this.avp = avp;
    }

    protected prepareViewData(data: any) {
        const t = this.avp.i18n.translate.bind(this.avp.i18n);
        return Object.assign({}, data, {
            id: this.id,
            t
        });
    }

    public async render(): Promise<any> {
        // Call it to render view
        return "";
    }

    public async postRender(): Promise<any> {
        // Called when view has been rendered
    }
}
