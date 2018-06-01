export interface EventListener {
    eventType: string;
    handler: any;
}

export class EventProvider {
    private eventListeners: EventListener[] = [];

    public dispatchEvent(eventType: any, data: any = {}) {
        for (const eventListener of this.eventListeners) {
            if (eventListener.eventType !== eventType) {
                return;
            }

            eventListener.handler(data);
        }
    }

    public addEventListener(eventType: string, handler: any) {
        this.eventListeners.push({
            eventType,
            handler
        });
    }
}
