import { trapFocus, undoTrapFocus } from "./dom";

const stopPropagationHandler = (event: any) => {
    event.stopPropagation();
};

export function openPopin(popinElement: HTMLElement) {
    const isOpen = popinElement.classList.contains("avp-open");

    if (isOpen) {
        // Already open
        return;
    }

    // Close others
    closeAllPopins();

    // Get all focusable elements
    const focusableEls = popinElement.querySelectorAll(
        "a, object, input, iframe, [tabindex]"
    );

    // Make all input focusable
    Array.prototype.forEach.call(focusableEls, (element: any) => {
        element.removeAttribute("tabindex");
    });

    // Open and trap focus
    popinElement.classList.add("avp-open");
    trapFocus(popinElement);
}

export function closePopin(popinElement: HTMLElement) {
    const isOpen = popinElement.classList.contains("avp-open");

    if (!isOpen) {
        // Already closed
        return;
    }

    // Get all focusable elements
    const focusableEls = popinElement.querySelectorAll(
        "a, object, input, iframe, [tabindex]"
    );

    // Remove focus
    Array.prototype.forEach.call(focusableEls, (element: any) => {
        element.setAttribute("tabindex", -1);
    });

    // Close
    popinElement.classList.remove("avp-open");
    undoTrapFocus();
}

export function togglePopin(popinElement: HTMLElement) {
    const isOpen = popinElement.classList.contains("avp-open");

    if (isOpen) {
        closePopin(popinElement);
    } else {
        openPopin(popinElement);
    }
}

export function initPopin(popinElement: HTMLElement) {
    popinElement.addEventListener(
        "click",
        stopPropagationHandler,
    );

    // Popin is closed
    // Get all focusable elements
    const focusableEls = popinElement.querySelectorAll(
        "a, object, input, iframe, [tabindex]"
    );

    // Remove focus
    Array.prototype.forEach.call(focusableEls, (element: any) => {
        element.setAttribute("tabindex", -1);
    });
}

export function closeAllPopins() {
    // Get all popins
    const popinElements = document.getElementsByClassName("avp-popin") as any;
    Array.prototype.forEach.call(popinElements, (element: any) => {
        element.classList.remove("avp-open");
    });
}
