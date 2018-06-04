import { Resource } from "lib/models/player";

export interface TranscriptionContent {
    transcriptionElement: HTMLElement;
    transcriptionResource: Resource
}

export class TranscriptionManager {
    public async create(
        containerElement: HTMLElement,
        transcriptionResource: Resource
    ): Promise<TranscriptionContent> {
        // Download transcription
        const response = await fetch(transcriptionResource.url);
        const jsonResult = await response.json()
        console.log("transcription", jsonResult);

        // Create transcription element
        const transcriptionElement = document.createElement("div");
        transcriptionElement.className = "avp-transcription";
        containerElement.appendChild(transcriptionElement);

        // Display text from json transcription
        // json object has 3 attributes:
        // * start: start timecodes of words
        // * end: end timecodes of words
        // * text: List of words
        let nextWordGroupStart = 0;
        let wordGroupElement = null;

        for (let index = 0; index < jsonResult.start.length; index++) {
            // Extract word data information
            const start = jsonResult.start[index];
            const end = jsonResult.end[index];
            const word = jsonResult.text[index];

            // Group words every 100 seconds
            if (start >= nextWordGroupStart) {
                // Create new word group
                wordGroupElement = document.createElement("span");
                wordGroupElement.className = "avp-word-goup avp-word-group-" + nextWordGroupStart;
                transcriptionElement.appendChild(wordGroupElement);

                // offset are defined in ms
                nextWordGroupStart += 100*1000;
            }

            const wordElement = document.createElement("span");
            wordElement.innerHTML = jsonResult.text[index];
            wordElement.dataset["start"] = start;
            wordElement.dataset["end"] = end;

            if (wordGroupElement) {
                wordGroupElement.appendChild(wordElement);
            }
        }

        return {
            transcriptionElement,
            transcriptionResource
        };
    }
}
