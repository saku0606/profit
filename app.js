const FEE_RATE = 0.1;
const SHIPPING_YEN = 160;

const targetProfitInput = document.getElementById("targetProfit");
const clearInputButton = document.getElementById("clearInput");
const salePrice = document.getElementById("salePrice");
const feeAmount = document.getElementById("feeAmount");
const shippingAmount = document.getElementById("shippingAmount");
const actualProfit = document.getElementById("actualProfit");

shippingAmount.textContent = formatYen(SHIPPING_YEN);

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

function getProfit(price) {
  return price - getFee(price) - SHIPPING_YEN;
}

function getMinimumSalePrice(targetProfit) {
  let price = Math.max(0, Math.floor((targetProfit + SHIPPING_YEN) / (1 - FEE_RATE)) - 10);

  while (getProfit(price) < targetProfit) {
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

  if (targetProfitInput.value !== normalizedValue) {
    targetProfitInput.value = normalizedValue;
  }

  if (normalizedValue === "") {
    showEmptyResult();
    return;
  }

  const targetProfit = Number(normalizedValue);
  const minimumSalePrice = getMinimumSalePrice(targetProfit);
  const fee = getFee(minimumSalePrice);
  const profit = getProfit(minimumSalePrice);

  salePrice.textContent = formatYen(minimumSalePrice);
  feeAmount.textContent = formatYen(fee);
  actualProfit.textContent = formatYen(profit);
  clearInputButton.hidden = false;
}

targetProfitInput.addEventListener("input", updateCalculator);

clearInputButton.addEventListener("click", () => {
  targetProfitInput.value = "";
  targetProfitInput.focus();
  showEmptyResult();
});

showEmptyResult();
