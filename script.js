const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const fromFlag = document.getElementById('from-flag');
const toFlag = document.getElementById('to-flag');
const resultDiv = document.getElementById('result');
const historyList = document.getElementById('history-list');
const darkToggle = document.getElementById('darkModeToggle');
const amount = document.getElementById('amount');

const API_URL = 'https://api.frankfurter.app/latest';

let currencyToFlag = {};

fetch('https://flagcdn.com/en/codes.json')
  .then(() => fetch('./flags.json'))
  .then(res => res.json())
  .then(data => {
    currencyToFlag = data;
  });

fetch(`${API_URL}`)
  .then(res => res.json())
  .then(data => {
    const currencies = Object.keys(data.rates);
    currencies.push('EUR');
    currencies.sort();
    currencies.forEach(cur => {
      fromCurrency.innerHTML += `<option value="${cur}">${cur}</option>`;
      toCurrency.innerHTML += `<option value="${cur}">${cur}</option>`;
    });
    fromCurrency.value = 'USD';
    toCurrency.value = 'INR';
    updateFlags();
  });

function updateFlags() {
  fromFlag.src = `https://flagcdn.com/48x36/${currencyToFlag[fromCurrency.value]}.png`;
  toFlag.src = `https://flagcdn.com/48x36/${currencyToFlag[toCurrency.value]}.png`;
}

fromCurrency.addEventListener('change', updateFlags);
toCurrency.addEventListener('change', updateFlags);

function convert() {
  const from = fromCurrency.value;
  const to = toCurrency.value;
  const amt = parseFloat(amount.value);

  if (isNaN(amt) || amt <= 0) {
    resultDiv.innerText = 'Please enter a valid amount.';
    return;
  }

  if (from === to) {
    resultDiv.innerText = `Result: ${amt} ${from} = ${amt} ${to}`;
    return;
  }

  fetch(`${API_URL}?amount=${amt}&from=${from}&to=${to}`)
    .then(res => res.json())
    .then(data => {
      const converted = data.rates[to];
      resultDiv.innerText = `Result: ${amt} ${from} = ${converted} ${to}`;
      addToHistory(`${amt} ${from} = ${converted} ${to}`);
    });
}

function addToHistory(text) {
  const li = document.createElement('li');
  li.textContent = text;
  historyList.prepend(li);
}

darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  darkToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});
