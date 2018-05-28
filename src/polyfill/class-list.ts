class DOMTokenList {
    private element: any;

    constructor(element: any) {
        this.element = element;
    };

    public toggle(className: string) {
        const classNames = this.element.className.split(" ");
        const classIndex = classNames.indexOf(className);

        if (classIndex >= 0) {
            classNames.splice(classIndex, 1);
        } else {
            classNames.push(className);
        }

        this.element.className = classNames.join(" ");
    };
}

// Polyfill classList toggle function
export function install() {
    const elProto = Element.prototype as any;
    const tester = document.createElement('span');

    if (!('classList' in tester)) {
        Object.defineProperty(elProto, "classList", {
            get: function() {
                return new DOMTokenList(this);
            }
        });
    }
}
