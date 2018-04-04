/*
 *  This file is part of the NOOP organization .
 *
 *  (c) Cyrille Lebeaupin <clebeaupin@noop.fr>
 *
 *  For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 */

import { Cue, CueTrack, DisplayableCue } from "app/video-subtitle/model/cue";

export interface PlayerOptionList {
    videoWrapperId?: string;
    videoWrapperClass: string;
    renderingContainerId?: string;
    renderingContainerClass: string;
}

export interface Player {
    loadCueTrack(cueTrack: CueTrack): void;
    requestFullscreen(): void;
}

export interface Renderer {
    renderCue(renderingAreaElement: HTMLElement, cue: DisplayableCue): void;
    clear(renderingAreaElement: HTMLElement): void;
}
