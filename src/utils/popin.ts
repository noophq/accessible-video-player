import { trapFocus, undoTrapFocus } from "./dom";

const stopPropagationHandler = (event: any) => {
    event.stopPropagation();
};

var lastFocusableElement: any = null;

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
        'a, object, input:not([type="hidden"]), button'
    );

    // Make all input focusable
    Array.prototype.forEach.call(focusableEls, (element: any) => {
        element.setAttribute("tabindex", 0);
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
        'a, object, input:not([type="hidden"]), button'
    );

    // Remove focus
    Array.prototype.forEach.call(focusableEls, (element: any) => {
        element.setAttribute("tabindex", -1);
    });

    // Close
    popinElement.classList.remove("avp-open");
    undoTrapFocus();

    // Focus new element
    if (lastFocusableElement) {
        lastFocusableElement.focus();
    }
}

export function togglePopin(popinElement: HTMLElement, focusableElement: any) {
    const isOpen = popinElement.classList.contains("avp-open");
    lastFocusableElement = focusableElement;

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
        'a, object, input:not([type="hidden"]), button'
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
        closePopin(element);
    });
}
