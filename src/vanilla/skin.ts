import svgView from "ejs-loader!lib/vanilla/views/svg.ejs";

import pauseIcon from "app/assets/icons/pause.svg";
import playIcon from "app/assets/icons/play.svg";
import markerIcon from "app/assets/icons/marker.svg";
import volumeOnIcon from "app/assets/icons/volume-on.svg";
import fullscreenOffIcon from "app/assets/icons/fullscreen-off.svg";
import fullscreenOnIcon from "app/assets/icons/fullscreen-on.svg";
import settingsIcon from "app/assets/icons/settings.svg";


export function renderIcon(iconId: string, label: string) {
    // Put here to avoid embedding all these svgs in the dom
    const svgIcons: any = {
        "pause": pauseIcon,
        "play": playIcon,
        "marker": markerIcon,
        "volume": volumeOnIcon,
        "settings": settingsIcon,
        "fullscreen-off": fullscreenOffIcon,
        "fullscreen-on": fullscreenOnIcon,
    }

    if (svgIcons.hasOwnProperty(iconId)) {
        return svgView({
            icon: svgIcons[iconId],
            label
        });
    } else if (iconId == "next") {
        return '<span "avp-icon avp-icon-next">&gt;</span>';
    } else if (iconId == "previous" || iconId == "back") {
        return '<span "avp-icon avp-icon-previous">&lt;</span>';
    }

    return label;
}