/*
 *  This file is part of the NOOP organization .
 *
 *  (c) Cyrille Lebeaupin <clebeaupin@noop.fr>
 *
 *  For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 */

import { Period } from "app/video-subtitle/model/period";

export enum CueItemType {
    TEXT,
    LINE_BREAK,
}

export enum TextAlign {
    LEFT,
    RIGHT,
    CENTER,
}

export enum FontWeight {
    BOLD,
    NORMAL,
}

export enum TextDecoration {
    UNDERLINE,
    OVERLINE,
    LINE_THROUGH,
}

export interface Style {
    textAlign?: TextAlign;
    color?: string;
    backgroundColor?: string;
    lineHeight?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: FontWeight;
    textDecoration?: TextDecoration;
}

export interface Region extends Style {
    x: string;
    y: string;
    width: string;
    height: string;
}

export interface CueItem {
    type: CueItemType;
    data?: string;
    styleId?: string;
}

export interface DisplayableCueItem {
    type: CueItemType;
    data?: string;
    style?: Style;
}

export interface Cue extends Period {
    id: string;
    items: CueItem[];
    regionId?: string;
    styleId?: string;
}

export interface DisplayableCue {
    items: DisplayableCueItem[];
    region?: Region;
    style?: Style;
}

export interface CueDictionary {
    [id: string]: Cue;
}

export interface RegionDictionary {
    [id: string]: Region;
}

export interface StyleDictionary {
    [id: string]: Style;
}

export interface CueTrack {
    cues: CueDictionary;
    regions?: RegionDictionary;
    styles?: StyleDictionary;
}
