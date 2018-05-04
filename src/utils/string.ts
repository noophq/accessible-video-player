export function pad(input: number|string, width: number, padding: string = "0") {
    input = input + '';
    return input.length >= width ?
        input :
        new Array(width - input.length + 1).join(padding) + input;
}
