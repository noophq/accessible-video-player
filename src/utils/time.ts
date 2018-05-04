import { pad } from "./string";

/**
 * Format time to a human readable time
 * @param time in millis
 */
export function toPlayerTime(time: number): string {
    const timeInSeconds = Math.floor(time/1000);
    const hours = Math.floor(timeInSeconds/3600);
    const minutes = Math.floor((timeInSeconds-(hours*3600))/60);
    const seconds = timeInSeconds-(hours*3600)-(minutes*60);

    let playerTime = "";

    if (hours > 0) {
        playerTime = pad(hours, 2, "0") + ":" + pad(minutes, 2, "0") + ":" + pad(seconds, 2, "0");
    } else {
        playerTime = pad(minutes, 2, "0") + ":" + pad(seconds, 2, "0");
    }

    return playerTime;
}
