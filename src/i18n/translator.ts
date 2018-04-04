import * as i18n from "i18next";
import { injectable} from "inversify";

import * as enCatalog from "app/resources/locales/en.json";
import * as  frCatalog from "app/resources/locales/fr.json";

i18n.init({
    fallbackLng: "en",
    resources: {
        en: {
            translation: enCatalog,
        },
        fr: {
            translation: frCatalog,
        },
    },
});

@injectable()
export class Translator {
    private locale: string = "en";

    public constructor() {
        const locale = sessionStorage.getItem("locale");
        if (locale) {
            this.locale = locale;
            i18n.changeLanguage(this.locale);
        }
    }

    public getLocale(): string {
        return this.locale;
    }

    public setLocale(locale: string) {
        this.locale = locale;
        sessionStorage.setItem("locale", locale);
        i18n.changeLanguage(this.locale);
    }

    public translate(message: string): string {
        return i18n.t(message);
    }
}
