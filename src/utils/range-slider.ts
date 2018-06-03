export function renderRangeSlider(rangeSliderElement: any) {
    const inputElement = rangeSliderElement.getElementsByTagName("input")[0];
    const lowerElement = rangeSliderElement
        .getElementsByClassName("avp-range-slider-lower")[0] as HTMLDivElement;
    const updateProgressBar = () => {
        const percent = parseInt(inputElement.value)/(parseInt(inputElement.max)-parseInt(inputElement.min)+1)*100;
        lowerElement.style.width = percent + "%";
    };

    inputElement.addEventListener("input", function(event: any) {
        updateProgressBar();
    });

    updateProgressBar();
}
