import * as i18next from "i18next";
import { i18n } from "i18next";

import { I18NCatalog } from "app/vanilla/models/skin";

export class Translator {
    private locale: string;
    private i18nInstance: i18n;

    public constructor(locale: string) {
        this.locale = locale;
        this.i18nInstance = null;
    }

    public initialize(catalogs: I18NCatalog[]): Promise<void> {
        const resources: any = {};

        for (const catalog of catalogs) {
            resources[catalog.locale] = {
                translation: catalog.translations,
            };
        }

        return new Promise((resolve, reject) => {
            this.i18nInstance = i18next.createInstance(
                {
                    fallbackLng: "en",
                    lng: this.locale,
                    resources,
                },
                (err, t) => {
                    if (err) {
                        reject("unable to initialize translator");
                    }

                    resolve();
                },
            );
        });
    }

    public getLocale(): string {
        return this.locale;
    }

    public setLocale(locale: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.i18nInstance.changeLanguage(
                locale,
                (err, t) => {
                    if (err) {
                        reject("unable to switch language in translator");
                    }

                    this.locale = locale;
                    resolve();
                },
            );
        });
    }

    public translate(message: string, options: any = {}): string {
        return this.i18nInstance.t(message, options);
    }
}
