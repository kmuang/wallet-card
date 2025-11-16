const form = document.querySelector("form");
const cardName = document.querySelector("#card__name");
const cardNumber = document.querySelector("#card__number");
const cardCvc = document.querySelector("#card__cvc");
const expiryMonth = document.querySelector("#card__exp");
const expiryYear = document.querySelector("#card__year");
const completedState = document.querySelector(".completed__state");
const continueBtn = document.querySelector("#continue");

// Signature Canvas
const signatureCanvas = document.getElementById("signature__canvas");
const signatureCtx = signatureCanvas.getContext("2d");
const signatureDisplay = document.querySelector(".signature__display");
const signatureDisplayCtx = signatureDisplay.getContext("2d");
const clearSignatureBtn = document.getElementById("clear__signature");

// Card Text
const cardNumberText = document.querySelector(".card__number");
const cardNameText = document.querySelector(".card__name");
const cardExpiryMonthText = document.querySelector(".card__month");
const cardExpiryYearText = document.querySelector(".card__year");
const cardCvcText = document.querySelector(".cvc__number");

const nameError = document.querySelector(".name__error");
const numberError = document.querySelector(".num__error");
const cvcError = document.querySelector(".cvc__error");
const expiryError = document.querySelector(".exp__error");

// Signature Drawing Variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Setup signature canvas
signatureCtx.strokeStyle = "#1a1a1a";
signatureCtx.lineWidth = 2;
signatureCtx.lineCap = "round";
signatureCtx.lineJoin = "round";

// Setup display canvas
signatureDisplayCtx.strokeStyle = "#1a1a1a";
signatureDisplayCtx.lineWidth = 1.5;
signatureDisplayCtx.lineCap = "round";
signatureDisplayCtx.lineJoin = "round";

// Drawing functions
function startDrawing(e) {
  isDrawing = true;
  const rect = signatureCanvas.getBoundingClientRect();
  [lastX, lastY] = [
    e.clientX - rect.left || e.touches[0].clientX - rect.left,
    e.clientY - rect.top || e.touches[0].clientY - rect.top
  ];
}

function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  
  const rect = signatureCanvas.getBoundingClientRect();
  const currentX = e.clientX - rect.left || e.touches[0].clientX - rect.left;
  const currentY = e.clientY - rect.top || e.touches[0].clientY - rect.top;

  signatureCtx.beginPath();
  signatureCtx.moveTo(lastX, lastY);
  signatureCtx.lineTo(currentX, currentY);
  signatureCtx.stroke();

  [lastX, lastY] = [currentX, currentY];
  
  // Update card signature display
  updateSignatureDisplay();
}

function stopDrawing() {
  isDrawing = false;
}

function updateSignatureDisplay() {
  // Clear display canvas
  signatureDisplayCtx.clearRect(0, 0, signatureDisplay.width, signatureDisplay.height);
  
  // Scale and draw signature to display canvas
  const scaleX = signatureDisplay.width / signatureCanvas.width;
  const scaleY = signatureDisplay.height / signatureCanvas.height;
  const scale = Math.min(scaleX, scaleY);
  
  signatureDisplayCtx.save();
  signatureDisplayCtx.scale(scale, scale);
  signatureDisplayCtx.drawImage(signatureCanvas, 0, 0);
  signatureDisplayCtx.restore();
}

function clearSignature() {
  signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
  signatureDisplayCtx.clearRect(0, 0, signatureDisplay.width, signatureDisplay.height);
}

// Event listeners for drawing
signatureCanvas.addEventListener("mousedown", startDrawing);
signatureCanvas.addEventListener("mousemove", draw);
signatureCanvas.addEventListener("mouseup", stopDrawing);
signatureCanvas.addEventListener("mouseout", stopDrawing);

// Touch events for mobile
signatureCanvas.addEventListener("touchstart", startDrawing);
signatureCanvas.addEventListener("touchmove", draw);
signatureCanvas.addEventListener("touchend", stopDrawing);

// Clear button
clearSignatureBtn.addEventListener("click", clearSignature);

// Display card details on the  Dummy Card

cardName.addEventListener("input", function () {
  if (cardName.value.length > 20) {
    cardName.value = cardName.value.slice(0, 20);
  }
  cardNameText.textContent = cardName.value;

  if (!cardName.value) {
    cardNameText.textContent = "Jane Appleseed";
  }
});

cardNumber.addEventListener("input", function () {
  if (cardNumber.value.length > 16) {
    cardNumber.value = cardNumber.value.slice(0, 16);
  }
  cardNumberText.textContent = numberFormat(cardNumber.value);

  if (!cardNumber.value) {
    cardNumberText.textContent = "0000 0000 0000 0000";
  }
});

cardCvc.addEventListener("input", function () {
  if (cardCvc.value.length > 3) {
    cardCvc.value = cardCvc.value.slice(0, 3);
  }

  cardCvcText.textContent = cardCvc.value;

  if (!cardCvc.value) {
    cardCvcText.textContent = "000";
  }
});

expiryMonth.addEventListener("input", function () {
  if (expiryMonth.value.length > 2) {
    expiryMonth.value = expiryMonth.value.slice(0, 2);
  }

  cardExpiryMonthText.textContent = expiryMonth.value;

  if (!expiryMonth.value) {
    cardExpiryMonthText.textContent = "00";
  }
});

expiryYear.addEventListener("input", function () {
  if (expiryYear.value.length > 2) {
    expiryYear.value = expiryYear.value.slice(0, 2);
  }
  cardExpiryYearText.textContent = expiryYear.value;

  if (!expiryYear.value) {
    cardExpiryYearText.textContent = "00";
  }
});

// Validate form fields
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const card = {
    name: cardName.value,
    number: cardNumber.value,
    cvc: cardCvc.value,
    expiryMonth: expiryMonth.value,
    expiryYear: expiryYear.value,
  };

  validateForm(card);
});

function validateForm(card) {
  // Validate card name
  if (card.name === "") {
    nameError.textContent = "Can't be blank";
    cardName.style.borderColor = "var(--primary-red)";
  } else {
    nameError.textContent = "";
    cardName.style.borderColor = "var(--light-grayish-violet)";
  }

  //   Validate card number
  if (card.number === "") {
    numberError.textContent = "Can't be blank";
    cardNumber.style.borderColor = "var(--primary-red)";
  } else if (!/^([0-9 ])*$/.test(card.number)) {
    numberError.textContent = "Wrong format, numbers only.";
    cardNumber.style.borderColor = "var(--primary-red)";
  } else if (card.number.length < 16 || card.number.length > 16) {
    numberError.textContent = "Invalid card number";
    cardNumber.style.borderColor = "var(--primary-red)";
  } else {
    numberError.textContent = "";
    cardNumber.style.borderColor = "var(--light-grayish-violet)";
  }

  // Validate card cvc
  if (card.cvc === "") {
    cvcError.textContent = "Can't be blank";
    cardCvc.style.borderColor = "var(--primary-red)";
  } else {
    cvcError.textContent = "";
    cardCvc.style.borderColor = "var(--light-grayish-violet)";
  }

  const currentYear = new Date().getFullYear().toString().slice(2, 4);

  //  Validate card expiry date
  if (card.expiryMonth === "") {
    expiryError.textContent = "Can't be blank";
    expiryMonth.style.borderColor = "var(--primary-red)";
  } else if (
    !/^([0-9 ])*$/.test(card.expiryMonth) ||
    card.expiryMonth < 1 ||
    card.expiryMonth > 12
  ) {
    expiryError.textContent = "Invalid date";
    expiryMonth.style.borderColor = "var(--primary-red)";
    return;
  } else {
    expiryError.textContent = "";
    expiryMonth.style.borderColor = "var(--light-grayish-violet)";
  }

  if (card.expiryYear === "") {
    expiryError.textContent = "Can't be blank";
    expiryYear.style.borderColor = "var(--primary-red)";
  } else if (
    card.expiryYear < currentYear ||
    !/^([0-9 ])*$/.test(card.expiryYear)
  ) {
    expiryError.textContent = "Invalid date";
    expiryYear.style.borderColor = "var(--primary-red)";
  } else {
    expiryError.textContent = "";
    expiryYear.style.borderColor = "var(--light-grayish-violet)";
  }

  // Show completed state
  if (
    card.name !== "" &&
    card.number !== "" &&
    card.cvc !== "" &&
    card.expiryMonth !== "" &&
    card.expiryYear !== "" &&
    card.number.length === 16 &&
    card.expiryMonth >= 1 &&
    card.expiryMonth <= 12 &&
    card.expiryYear >= currentYear
  ) {
    form.style.display = "none";
    completedState.style.display = "block";
  }
}

// Continue Button
continueBtn.addEventListener("click", function () {
  completedState.style.display = "none";
  form.style.display = "block";
  clearSignature();
  window.location.reload();
});

// Format card number
function numberFormat(x) {
  return x.replace(/(.{4})/g, "$1 ");
}
