import thumbnailPanelView from "ejs-loader!lib/vanilla/views/thumbnail-panel.ejs";

import { BaseComponent, ComponentProperties } from "./base";

export class ThumbnailPanelComponent extends BaseComponent<ComponentProperties> {
    public view = thumbnailPanelView;
}
