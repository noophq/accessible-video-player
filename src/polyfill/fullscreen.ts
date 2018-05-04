function fullscreenEventProxy(event: any) {
    let eventType = event.type.replace(/^(webkit|moz|MS)/, '').toLowerCase();

    let newEvent;

    // IE 11 does not have an Event constructor
    if (typeof(Event) === 'function') {
        newEvent = new Event(eventType, /** @type {EventInit} */(event));
    } else {
        newEvent = document.createEvent('Event');
        newEvent.initEvent(eventType, event.bubbles, event.cancelable);
    }

    event.target.dispatchEvent(newEvent);
}

// Inspired from shaka player fullscreen polyfill
export function install() {
    const elProto = Element.prototype as any;
    elProto.requestFullscreen =
        elProto.requestFullscreen ||
        elProto.mozRequestFullScreen ||
        elProto.msRequestFullscreen ||
        elProto.webkitRequestFullscreen;

    const docProto = Document.prototype as any;
    docProto.exitFullscreen =
        docProto.exitFullscreen ||
        docProto.mozCancelFullScreen ||
        docProto.msExitFullscreen ||
        docProto.webkitExitFullscreen;

    const doc = document as any;

    if (!("fullscreenElement" in doc)) {
        Object.defineProperty(doc, "fullscreenElement", {
            get: function() {
            return doc.mozFullScreenElement ||
                doc.msFullscreenElement ||
                doc.webkitFullscreenElement;
            }
        });
        Object.defineProperty(doc, "fullscreenEnabled", {
            get: function() {
            return doc.mozFullScreenEnabled ||
                doc.msFullscreenEnabled ||
                doc.webkitFullscreenEnabled;
            }
        });
    }

    let proxy = fullscreenEventProxy;
    document.addEventListener('webkitfullscreenchange', proxy);
    document.addEventListener('webkitfullscreenerror', proxy);
    document.addEventListener('mozfullscreenchange', proxy);
    document.addEventListener('mozfullscreenerror', proxy);
    document.addEventListener('MSFullscreenChange', proxy);
    document.addEventListener('MSFullscreenError', proxy);
}
