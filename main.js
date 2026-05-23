const sliderEl = document.querySelector("#range");
const startBtn = document.querySelector("#startBtn");

const api = typeof browser !== 'undefined' ? browser : chrome;

if (sliderEl) {
  api.storage.local.get('reductionPercent', (data) => {
    if (data.reductionPercent) {
      sliderEl.value = data.reductionPercent;
    }
    updateSliderBackground(sliderEl.value);
  });

  sliderEl.addEventListener("input", (event) => {
    const val = parseInt(event.target.value, 10);
    updateSliderBackground(val);
    api.storage.local.set({ reductionPercent: val });
  });
}

function updateSliderBackground(value) {
  if (!sliderEl) return;
  const progress = ((value - sliderEl.min) / (sliderEl.max - sliderEl.min)) * 100;
  sliderEl.style.background = `linear-gradient(to right, #3D46ED ${progress}%, #ccc ${progress}%)`;
}

if (startBtn) {
  api.storage.local.get('isSelectModeActive', (data) => {
    updateButtonState(data.isSelectModeActive || false);
  });

  startBtn.addEventListener("click", () => {
    api.storage.local.get('isSelectModeActive', (data) => {
      const currentStatus = data.isSelectModeActive || false;
      const newStatus = !currentStatus;

      api.storage.local.set({ isSelectModeActive: newStatus }, () => {
        updateButtonState(newStatus);

        api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs && tabs[0]) {
            api.tabs.sendMessage(tabs[0].id, { action: "toggleSelectMode", enabled: newStatus });
          }
        });
      });
    });
  });
}

function updateButtonState(isActive) {
  if (!startBtn) return;
  if (isActive) {
    startBtn.innerText = "Стоп";
    startBtn.classList.add("active");
  } else {
    startBtn.innerText = "Старт";
    startBtn.classList.remove("active");
  }
}