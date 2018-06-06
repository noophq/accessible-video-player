import { EventRegistry } from "lib/event/registry";

export function toggleElementAttribute(element: Element, attr: string, value: any) {
    if (element.hasAttribute(attr)) {
        element.removeAttribute(attr);
    } else {
        element.setAttribute(attr, value);
    }
}

const trapFocusEventRegistry = new EventRegistry();
const KEYCODE_TAB = 9;

export function trapFocus(element: Element) {
    // Remove all previous registered listeners
    trapFocusEventRegistry.unregisterAll();

    const focusableEls = element.querySelectorAll(
        'a, object, input:not([type="hidden"]), button'
    );

    if (focusableEls.length == 0) {
        return;
    }

    const firstFocusableEl: any = focusableEls[0];
    const lastFocusableEl: any = focusableEls[focusableEls.length-1];

    const trapFunc = (event: any) => {
        var isTabPressed = (event.key === 'Tab');

        if (!isTabPressed) {
            return;
        }

        if (event.shiftKey ) /* shift + tab */ {
            let isFirstFocused = (document.activeElement === firstFocusableEl);

            if (firstFocusableEl.getAttribute("type") === "radio" &&
                document.activeElement.getAttribute("type") === "radio" &&
                firstFocusableEl.getAttribute("name") === document.activeElement.getAttribute("name")
            ) {
                // First is focused if element is in the same radio group
                // that the firstFocusableElement
                isFirstFocused = true;
            }

            if (isFirstFocused) {
                lastFocusableEl.focus();
                event.preventDefault();
            }
        } else /* tab */ {
            let isLastFocused = (document.activeElement === lastFocusableEl);

            if (lastFocusableEl.getAttribute("type") === "radio" &&
                document.activeElement.getAttribute("type") === "radio" &&
                lastFocusableEl.getAttribute("name") === document.activeElement.getAttribute("name")
            ) {
                // Last is focused if element is in the same radio group
                // that the lastFocusableElement
                isLastFocused = true;
            }

            if (isLastFocused) {
                firstFocusableEl.focus();
                event.preventDefault();
            }
        }
    };

    // Register new trap function
    trapFocusEventRegistry.register(element, "keydown", trapFunc);
    firstFocusableEl.focus();
}

export function undoTrapFocus() {
    trapFocusEventRegistry.unregisterAll();
}
