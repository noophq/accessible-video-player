import { EventRegistry } from "lib/listeners/registry";

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
        "a, object, input, iframe, [tabindex]"
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
            if (document.activeElement === firstFocusableEl) {
                lastFocusableEl.focus();
                event.preventDefault();
            }
        } else /* tab */ {
            if (document.activeElement === lastFocusableEl) {
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
