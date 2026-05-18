const sliderEl = document.querySelector("#range")
const sliderValue = document.querySelector(".value")

sliderEl.addEventListener("input", (event) => {
  const tempSliderValue = event.target.value; 
  
  sliderValue.textContent = tempSliderValue;
  
  const progress = (tempSliderValue / sliderEl.max) * 100;
 
  sliderEl.style.background = `linear-gradient(to right, #f50 ${progress}%, #ccc ${progress}%)`;
})

const sliderValue = document.querySelector(".sliderticks"); 

if (sliderEl) {
    sliderEl.addEventListener("input", (event) => {
        const val = event.target.value;
        browser.storage.local.set({ reductionPercent: val });
        console.log("Сохранено в память:", val);
    });
}

