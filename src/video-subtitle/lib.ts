/*
 *  This file is part of the NOOP organization .
 *
 *  (c) Cyrille Lebeaupin <clebeaupin@noop.fr>
 *
 *  For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 */

import { Player, Renderer } from "./model/player";
import { TTMLParser } from "./parser/ttml_parser";
import { SimplePlayer } from "./player/simple_player";
import { SimpleRenderer } from "./player/simple_renderer";
import { fetch } from "./util";

export class SubtitlePlayer {
    private videoElement: HTMLVideoElement;
    private player: Player;

    constructor(videoElement: HTMLVideoElement) {
        this.videoElement = videoElement;
        const renderer = new SimpleRenderer();
        this.player = new SimplePlayer<SimpleRenderer>(
            this.videoElement,
            renderer,
        );
    }

    public requestFullscreen() {
        this.player.requestFullscreen();
    }

    public displayTextTrack(textTrackUrl: string) {
        // Load text track
        fetch(textTrackUrl)
            .then((response: any) => {
                // Parse ttml data
                const ttmlParser = new TTMLParser();
                const cueTrack = ttmlParser.parse(response);
                this.player.loadCueTrack(cueTrack);
            })
            .catch((error: any) => {
                console.log(error);
            });
    }

}

export function wrap(
    videoElement: HTMLVideoElement,
) {
    return new SubtitlePlayer(videoElement);
}
