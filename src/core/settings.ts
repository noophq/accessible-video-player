import { GlobalSettings } from "lib/models/settings";

export class GlobalSettingsHandler implements ProxyHandler<GlobalSettings> {
    public set? (
        target: any,
        p: PropertyKey,
        value: any,
        receiver: any
    ): boolean {
        console.log("Property has changed", p);
        target[p] = value;
        return true;
    }
}
