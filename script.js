const imageUpload = document.querySelector("#imageUpload");
const displayImage = document.querySelector("#displayImage");
const ranges = document.querySelector("#ranges");
const saveBtn = document.querySelector(".save-btn");
const filterInputs = {
  blur: document.querySelector("#blur"),
  sepia: document.querySelector("#sepia"),
  grayscale: document.querySelector("#grayscale"),
  brightness: document.querySelector("#brightness"),
  contrast: document.querySelector("#contrast"),
};

imageUpload?.addEventListener("change", () => {
  const file = imageUpload.files[0];
  if (file) {
    displayImage.src = URL.createObjectURL(file);
    displayImage.style.display = "block";
    ranges.style.display = "block";
  }
});

Object.values(filterInputs).forEach((input) => {
  input?.addEventListener("input", () => {
    applyFilters();
  });
});

function applyFilters() {
  const filterValues = Object.fromEntries(
    Object.entries(filterInputs).map(([key, input]) => [key, input.value])
  );
  displayImage.style.filter = `blur(${filterValues.blur}px) sepia(${filterValues.sepia}%) grayscale(${filterValues.grayscale}%) brightness(${filterValues.brightness}%) contrast(${filterValues.contrast}%)`;
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
