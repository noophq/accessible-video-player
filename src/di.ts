import { Container} from "inversify";
import getDecorators from "inversify-inject-decorators";

import { Translator } from "app/i18n/translator";

const container = new Container();
const i18n = new Translator();
container.bind<Translator>("i18n").toConstantValue(i18n);

const {
    lazyInject,
    lazyInjectNamed,
    lazyInjectTagged,
    lazyMultiInject,
} = getDecorators(container);

export {
    container,
    lazyInject,
    lazyInjectNamed,
    lazyInjectTagged,
    lazyMultiInject,
};
