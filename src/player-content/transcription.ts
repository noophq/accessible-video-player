import { Resource } from "lib/models/player";

export interface TranscriptionContent {
    transcriptionElement: HTMLElement;
    transcriptionResource: Resource
    wordHighlighterHandler: any;
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
                wordGroupElement.className = "avp-word-group avp-word-group-" + nextWordGroupStart;
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

        // Highlight word for a given timecoce
        const wordHighlighterHandler = (event: any) => {
            const videoElement = event.target;
            const timecode = videoElement.currentTime*1000;
            const wordGroupClassNamePattern = "avp-word-group-" + Math.floor(videoElement.currentTime/100)*100000;
            const wordGroupElement = transcriptionElement
                .getElementsByClassName(wordGroupClassNamePattern)[0];

            // Remove highlight on words that are outside the current timecode
            const highlightedElements = transcriptionElement.getElementsByClassName("avp-highlight");
            Array.prototype.forEach.call(highlightedElements, (element: HTMLElement) => {
                if (timecode < parseInt(element.dataset.start) ||
                    timecode > parseInt(element.dataset.end)) {
                    element.classList.remove("avp-highlight");
                }
            });

            // Hightlight new words
            const wordElements = wordGroupElement.getElementsByTagName("span");
            Array.prototype.forEach.call(wordElements, (element: HTMLElement) => {
                if (timecode >= parseInt(element.dataset.start) &&
                    timecode <= parseInt(element.dataset.end)) {
                    element.classList.add("avp-highlight");

                    // Scroll to new highlighted element
                    const elementViewPortTop = element.offsetTop - transcriptionElement.scrollTop;

                    if (elementViewPortTop < 0 || elementViewPortTop > transcriptionElement.offsetHeight/2) {
                        // Element is below the middle line of the view port
                        // It's time to scroll
                        transcriptionElement.scrollTop = element.offsetTop - (transcriptionElement.offsetHeight/10);
                    }
                }
            });
        }

        return {
            transcriptionElement,
            transcriptionResource,
            wordHighlighterHandler
        };
    }
}
