const imageUpload = document.querySelector("#imageUpload");
const displayImage = document.querySelector("#displayImage");
const ranges = document.querySelector("#ranges");
const saveBtn = document.querySelector(".save-btn");
const undoBtn = document.querySelector(".undo-btn");
const redoBtn = document.querySelector(".redo-btn");
const filterInputs = {
  blur: document.querySelector("#blur"),
  sepia: document.querySelector("#sepia"),
  grayscale: document.querySelector("#grayscale"),
  brightness: document.querySelector("#brightness"),
  contrast: document.querySelector("#contrast"),
};

let filterHistory = [];
let currentIndex = -1;

imageUpload?.addEventListener("change", () => {
  const file = imageUpload.files[0];
  if (file) {
    displayImage.src = URL.createObjectURL(file);
    displayImage.style.display = "block";
    ranges.style.display = "block";
    resetFilterState();
  }
});

Object.values(filterInputs).forEach((input) => {
  input?.addEventListener("input", () => {
    applyFilters();
  });

  input?.addEventListener("change", () => {
    saveFilterState();
  });
});

function resetFilterState() {
  filterHistory = [];
  currentIndex = -1;
  saveFilterState();
}

function applyFilters() {
  const filterValues = Object.fromEntries(
    Object.entries(filterInputs).map(([key, input]) => [key, input.value])
  );
  displayImage.style.filter = `blur(${filterValues.blur}px) sepia(${filterValues.sepia}%) grayscale(${filterValues.grayscale}%) brightness(${filterValues.brightness}%) contrast(${filterValues.contrast}%)`;
}

function saveFilterState() {
  const state = Object.fromEntries(
    Object.entries(filterInputs).map(([key, input]) => [key, input.value])
  );
  filterHistory.splice(currentIndex + 1);
  filterHistory.push(state);
  currentIndex++;
  updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
  undoBtn.disabled = currentIndex <= 0;
  redoBtn.disabled = currentIndex >= filterHistory.length - 1;
}

undoBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    applyFiltersFromHistory(currentIndex - 1);
    currentIndex--;
    updateUndoRedoButtons();
  }
});

redoBtn.addEventListener("click", () => {
  if (currentIndex < filterHistory.length - 1) {
    applyFiltersFromHistory(currentIndex + 1);
    currentIndex = currentIndex - 1;
    updateUndoRedoButtons();
  }
});

function applyFiltersFromHistory(number) {
  const state = filterHistory[number];
  for (const [key, value] of Object.entries(state)) {
    filterInputs[key].value = value;
  }
  applyFilters();
}

saveBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = displayImage.naturalWidth;
  canvas.height = displayImage.naturalHeight;
  context.filter = displayImage.style.filter;
  context.drawImage(displayImage, 0, 0);
  const link = document.createElement("a");
  link.download = "edited_image.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
