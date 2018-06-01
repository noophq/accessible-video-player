export function dispatchEvent(
    element: HTMLElement,
    eventType: string,
    additionalData: any = {}
) {
    let newEvent;

    // IE 11 does not have an Event constructor
    if (typeof (Event) === 'function') {
        newEvent = new Event(eventType);
    } else {
        newEvent = document.createEvent('Event');
        newEvent.initEvent(eventType, false, true);
    }

    Object.assign(newEvent, additionalData);
    element.dispatchEvent(newEvent);
}
