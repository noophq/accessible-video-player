export interface SkinMarkerSettings {
    titleAsHeader: boolean;
}

export interface SkinRenderer {
    renderIcon?: any;
    renderView?: any;
}

export interface I18NCatalog {
    locale: string;
    translations: any;
}

export interface I18NSettings {
    locale: string;
    catalogs: I18NCatalog[];
}

export interface SkinSettings {
    name: string;
    i18n?: I18NSettings;
    renderer?: SkinRenderer;
    marker?: SkinMarkerSettings;
}
