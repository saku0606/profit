const FEE_RATE = 0.1;

const targetProfitInput = document.getElementById("targetProfit");
const shippingMethodSelect = document.getElementById("shippingMethod");
const clearInputButton = document.getElementById("clearInput");
const salePrice = document.getElementById("salePrice");
const feeAmount = document.getElementById("feeAmount");
const shippingAmount = document.getElementById("shippingAmount");
const actualProfit = document.getElementById("actualProfit");

shippingAmount.textContent = formatYen(getShippingYen());

function normalizeNumber(value) {
  return value
    .replace(/[０-９]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xfee0))
    .replace(/[^\d]/g, "");
}

function formatYen(value) {
  return `${value.toLocaleString("ja-JP")}円`;
}

function getFee(price) {
  return Math.floor(price * FEE_RATE);
}

function getShippingYen() {
  return Number(shippingMethodSelect.value);
}

function getProfit(price, shippingYen) {
  return price - getFee(price) - shippingYen;
}

function getMinimumSalePrice(targetProfit, shippingYen) {
  let price = Math.max(0, Math.floor((targetProfit + shippingYen) / (1 - FEE_RATE)) - 10);

  while (getProfit(price, shippingYen) < targetProfit) {
    price += 1;
  }

  return price;
}

function showEmptyResult() {
  salePrice.textContent = "--円";
  feeAmount.textContent = "--円";
  actualProfit.textContent = "--円";
  clearInputButton.hidden = true;
}

function updateCalculator() {
  const normalizedValue = normalizeNumber(targetProfitInput.value);
  const shippingYen = getShippingYen();

  shippingAmount.textContent = formatYen(shippingYen);

  if (targetProfitInput.value !== normalizedValue) {
    targetProfitInput.value = normalizedValue;
  }

  if (normalizedValue === "") {
    showEmptyResult();
    return;
  }

  const targetProfit = Number(normalizedValue);
  const minimumSalePrice = getMinimumSalePrice(targetProfit, shippingYen);
  const fee = getFee(minimumSalePrice);
  const profit = getProfit(minimumSalePrice, shippingYen);

  salePrice.textContent = formatYen(minimumSalePrice);
  feeAmount.textContent = formatYen(fee);
  actualProfit.textContent = formatYen(profit);
  clearInputButton.hidden = false;
}

targetProfitInput.addEventListener("input", updateCalculator);
shippingMethodSelect.addEventListener("change", updateCalculator);

clearInputButton.addEventListener("click", () => {
  targetProfitInput.value = "";
  targetProfitInput.focus();
  showEmptyResult();
});

showEmptyResult();
