const FEE_RATE = 0.1;

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

// ---- 画面切り替え ----
const screens = document.querySelectorAll("main > section");

function showScreen(id) {
  screens.forEach((screen) => {
    screen.hidden = screen.id !== id;
  });
}

document.querySelectorAll("[data-target]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.target));
});

// ---- 計算画面の共通セットアップ ----
function setupCalculator({ inputEl, selectEl, clearEl, render, clear }) {
  function update() {
    const normalizedValue = normalizeNumber(inputEl.value);

    if (inputEl.value !== normalizedValue) {
      inputEl.value = normalizedValue;
    }

    const shippingYen = Number(selectEl.value);

    if (normalizedValue === "") {
      clear(shippingYen);
      clearEl.hidden = true;
      return;
    }

    render(Number(normalizedValue), shippingYen);
    clearEl.hidden = false;
  }

  inputEl.addEventListener("input", update);
  selectEl.addEventListener("change", update);

  clearEl.addEventListener("click", () => {
    inputEl.value = "";
    inputEl.focus();
    update();
  });

  update();
}

// ---- 利益 → 販売価格 ----
const salePrice = document.getElementById("salePrice");
const feeAmount = document.getElementById("feeAmount");
const shippingAmount = document.getElementById("shippingAmount");
const actualProfit = document.getElementById("actualProfit");

setupCalculator({
  inputEl: document.getElementById("targetProfit"),
  selectEl: document.getElementById("shippingMethod"),
  clearEl: document.getElementById("clearInput"),
  render(targetProfit, shippingYen) {
    const minimumSalePrice = getMinimumSalePrice(targetProfit, shippingYen);

    salePrice.textContent = formatYen(minimumSalePrice);
    feeAmount.textContent = formatYen(getFee(minimumSalePrice));
    shippingAmount.textContent = formatYen(shippingYen);
    actualProfit.textContent = formatYen(getProfit(minimumSalePrice, shippingYen));
  },
  clear(shippingYen) {
    salePrice.textContent = "--円";
    feeAmount.textContent = "--円";
    shippingAmount.textContent = formatYen(shippingYen);
    actualProfit.textContent = "--円";
  },
});

// ---- 販売価格 → 利益 ----
const profitResultArea = document.getElementById("profitResultArea");
const profitResultLabel = document.getElementById("profitResultLabel");
const profitResult = document.getElementById("profitResult");
const feeAmountB = document.getElementById("feeAmountB");
const shippingAmountB = document.getElementById("shippingAmountB");

setupCalculator({
  inputEl: document.getElementById("salePriceInput"),
  selectEl: document.getElementById("shippingMethodB"),
  clearEl: document.getElementById("clearInputB"),
  render(price, shippingYen) {
    const profit = getProfit(price, shippingYen);
    const isLoss = profit < 0;

    profitResult.textContent = formatYen(profit);
    feeAmountB.textContent = formatYen(getFee(price));
    shippingAmountB.textContent = formatYen(shippingYen);
    profitResultArea.classList.toggle("is-loss", isLoss);
    profitResultLabel.textContent = isLoss ? "手元に残る利益（赤字）" : "手元に残る利益";
  },
  clear(shippingYen) {
    profitResult.textContent = "--円";
    feeAmountB.textContent = "--円";
    shippingAmountB.textContent = formatYen(shippingYen);
    profitResultArea.classList.remove("is-loss");
    profitResultLabel.textContent = "手元に残る利益";
  },
});
