import transcriptionPanelView from "ejs-loader!lib/vanilla/views/transcription-panel.ejs";

import { BaseComponent, ComponentProperties } from "./base";

export class TranscriptionPanelComponent extends BaseComponent<ComponentProperties> {
    public view = transcriptionPanelView;
}
