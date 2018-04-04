/*
 *  This file is part of the NOOP organization .
 *
 *  (c) Cyrille Lebeaupin <clebeaupin@noop.fr>
 *
 *  For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 */

import {
    Cue,
    CueDictionary,
    CueItem,
    CueItemType,
    CueTrack,
    Region,
    RegionDictionary,
    Style,
    StyleDictionary,
    TextAlign,
} from "app/video-subtitle/model/cue";
import { Parser } from "app/video-subtitle/model/parser";

const TIME_FORMAT = /^(\d{2,}):(\d{2}):(\d{2}):?(\d{2})?\.?(\d+)?$/;

export class TTMLParser implements Parser {
    private domParser: DOMParser;

    constructor() {
        this.domParser = new DOMParser();
    }
    public parse(data: string): CueTrack {
        // TTML file is an XML file so use a DOM parser
        const xml = this.domParser.parseFromString(data, "text/xml");

        if (!xml) {
            console.error("invalid TTML");
            return;
        }

        const tts = xml.getElementsByTagName("tt");

        if (tts.length !== 1) {
            console.error("invalid TTML");
            return;
        }

        const tt = tts[0];
        const frameRate = tt.getAttribute("ttp:frameRate");
        const subFrameRate = tt.getAttribute("ttp:subFrameRate");
        const frameRateMultiplier = tt.getAttribute("ttp:frameRateMultiplier");
        const tickRate = tt.getAttribute("ttp:tickRate");
        const spaceStyle = tt.getAttribute("xml:space") || "default";

        // Parse regions
        const regions = this.parseRegions(tt.getElementsByTagName("layout")[0]);

        // Parse styles
        const styles = this.parseStyles(tt.getElementsByTagName("styling")[0]);

        // Get cues
        const cues = this.parseCues(tt.getElementsByTagName("body")[0]);

        return {cues, styles, regions};
    }

    private parseRegions(node: Element): RegionDictionary {
        const regions: RegionDictionary = {};

        if (!node) {
            return regions;
        }

        if (!node.hasChildNodes()) {
            return regions;
        }

        // Search regions in child node
        for (let i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeType !== Node.ELEMENT_NODE) {
                continue;
            }

            const childElement = (node.childNodes[i] as Element);

            if (childElement.nodeName === "region") {
                if (!childElement.hasAttribute("xml:id")) {
                    throw new Error("no xml:id defined on region");
                }

                const id = childElement.getAttribute("xml:id");
                let x = "0%";
                let y = "0%";
                let width = "100%";
                let height = "100%";
                let textAlign;

                if (childElement.hasAttribute("tts:origin")) {
                    const attrValue = childElement.getAttribute("tts:origin");

                    if (attrValue !== "auto") {
                        const parts = attrValue.split(" ");

                        if (parts.length !== 2) {
                            throw new Error("tts:origin is badly formated");
                        }

                        x = parts[0];
                        y = parts[1];
                    }
                }

                if (childElement.hasAttribute("tts:extent")) {
                    const attrValue = childElement.getAttribute("tts:extent");

                    if (attrValue !== "auto") {
                        const parts = attrValue.split(" ");

                        if (parts.length !== 2) {
                            throw new Error("tts:extent is badly formated");
                        }

                        width = parts[0];
                        height = parts[1];
                    }
                }

                if (childElement.hasAttribute("tts:textAlign")) {
                    const attrValue = childElement.getAttribute("tts:textAlign");

                    switch (attrValue) {
                        case "left":
                            textAlign = TextAlign.LEFT;
                            break;
                        case "center":
                            textAlign = TextAlign.CENTER;
                            break;
                        case "right":
                            textAlign = TextAlign.RIGHT;
                            break;
                        default:
                            break;
                    }
                }

                regions[id] = ({x, y, width, height, textAlign});
            }
        }

        return regions;
    }

    private parseStyles(node: Element): StyleDictionary {
        const styles: StyleDictionary = {};

        if (!node) {
            return styles;
        }

        if (!node.hasChildNodes()) {
            return styles;
        }

        // Search styles in child node
        for (let i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeType !== Node.ELEMENT_NODE) {
                continue;
            }

            const childElement = (node.childNodes[i] as Element);

            if (childElement.nodeName === "style") {
                if (!childElement.hasAttribute("xml:id")) {
                    throw new Error("no xml:id defined on style");
                }

                const id = childElement.getAttribute("xml:id");
                let color;

                if (childElement.hasAttribute("tts:color")) {
                    color = childElement.getAttribute("tts:color");
                }

                styles[id] = ({color});
            }
        }

        return styles;
    }

    private parseCues(node: Element): CueDictionary {
        const cues: CueDictionary = {};

        if (!node) {
            return cues;
        }

        if (!node.hasChildNodes()) {
            return cues;
        }

        // Search cues in child node
        for (let i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeType !== Node.ELEMENT_NODE) {
                continue;
            }

            const childElement = (node.childNodes[i] as Element);

            if (childElement.hasAttribute("begin")) {
                // This is a cue, parse it
                const cue = this.parseCue(childElement);
                cues[cue.id] = cue;
            } else {
                // Continue to search cues
                const otherCues = this.parseCues(childElement);

                for (const cueId in otherCues) {
                    cues[cueId] = otherCues[cueId];
                }
            }
        }

        return cues;
    }

    private parseCue(node: Element): Cue {
        let regionId;
        let styleId;

        if (node.hasAttribute("region")) {
            regionId = node.getAttribute("region");
        }

        if (node.hasAttribute("style")) {
            styleId = node.getAttribute("style");
        }

        return {
            id: node.getAttribute("xml:id"),
            startTime: this.parseTime(node.getAttribute("begin")),
            endTime: this.parseTime(node.getAttribute("end")),
            items: this.parseCueItems(node),
            regionId,
            styleId,
        };
    }

    private parseTime(time: string): number {
        const match = TIME_FORMAT.exec(time);

        if (!match) {
            throw new Error("Unable to parse time: " + time);
        }

        let milliseconds = 1000 * (
            Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3])
        );

        if (match[5]) {
            milliseconds += Number(match[5]);
        }

        return milliseconds;
    }

    private parseCueItems(node: Element): CueItem[] {
        const cueItems: CueItem[] = [];

        if (!node) {
            return cueItems;
        }

        if (!node.hasChildNodes()) {
            return cueItems;
        }

        let styleId;

        if (node.hasAttribute("style")) {
            styleId = node.getAttribute("style");
        }

        // Search cue items in child node
        for (let i = 0; i < node.childNodes.length; i++) {
            const childNode = node.childNodes[i];
            const childElement = (node.childNodes[i] as Element);

            if (childNode.nodeName === "br") {
                cueItems.push({
                    type: CueItemType.LINE_BREAK,
                });
            } else if (childNode.nodeType === Node.TEXT_NODE) {
                const content = childNode.textContent.trim();

                if (content) {
                    cueItems.push({
                        type: CueItemType.TEXT,
                        data: content,
                        styleId,
                    });
                }
            } else if (childNode.nodeType === Node.ELEMENT_NODE) {
                cueItems.push(...this.parseCueItems(childNode as Element));
            }
        }

        return cueItems;
    }
}
