export function renderRangeSlider(rangeSliderElement: any) {
    const inputElement = rangeSliderElement.getElementsByTagName("input")[0];
    const lowerElement = rangeSliderElement
        .getElementsByClassName("avp-range-slider-lower")[0] as HTMLDivElement;
    const updateProgressBar = () => {
        // range value = max - min
        const rangeValue = parseInt(inputElement.max)-parseInt(inputElement.min);
        const currentValue = parseInt(inputElement.value)-parseInt(inputElement.min);
        const percent = currentValue/rangeValue*100;
        lowerElement.style.width = percent + "%";
    };

    inputElement.addEventListener("input", function(event: any) {
        updateProgressBar();
    });

    updateProgressBar();
}
