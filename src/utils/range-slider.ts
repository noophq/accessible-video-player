export function renderRangeSlider(rangeSliderElement: any) {
    const inputElement = rangeSliderElement.getElementsByTagName("input")[0];
    const lowerElement = rangeSliderElement
        .getElementsByClassName("avp-range-slider-lower")[0] as HTMLDivElement;

    inputElement.addEventListener("input", function(event: any) {
        lowerElement.style.width = event.target.value + "%";
    });
}
