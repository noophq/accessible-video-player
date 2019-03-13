export interface SkinRenderer {
    renderIcon?: any;
}

export interface I18NCatalog {
    lang: string;
    data: any;
}

export interface I18NSettings {
    catalogs: I18NCatalog[];
}

export interface SkinSettings {
    name: string;
    i18n?: I18NSettings;
    renderer?: SkinRenderer;
}
