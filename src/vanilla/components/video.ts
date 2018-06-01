import videoView from "ejs-loader!lib/vanilla/views/video.ejs";

import { BaseComponent, ComponentProperties } from "./base";

import { VideoType } from "lib/models/video";

export interface VideoComponentProperties extends ComponentProperties{
    name: string;
}

export class VideoComponent extends BaseComponent<VideoComponentProperties> {
    public view = videoView;

    private buildClassName() {
        return  "avp-" + this.props.name.toLowerCase() + "-video-container";
    }

    public registerViewData() {
        return {
            "classnames": this.buildClassName()
        };
    }

    public async registerDomElements(rootElement: HTMLElement): Promise<any> {
        return {
            root: rootElement
        };
    }
}
