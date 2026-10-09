const display = document.querySelector('.display');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const decimalButton = document.querySelector('.decimal');
const equalButton = document.querySelector('.equal');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('del');

let currentValue = '0';
let previousValue = null;
let currentOperator = null;
let waitingForNextValue = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function handleNumberClick(event) {
  const value = event.currentTarget.dataset.value;

  if (waitingForNextValue) {
    currentValue = value;
    waitingForNextValue = false;
  } else {
    currentValue = currentValue === '0' ? value : currentValue + value;
  }

  updateDisplay();
}

function handleOperatorClick(event) {
  const operator = event.currentTarget.dataset.op;
  const inputValue = Number(currentValue);

  if (currentOperator && waitingForNextValue) {
    currentOperator = operator;
    return;
  }

  if (previousValue === null) {
    previousValue = inputValue;
  } else if (!waitingForNextValue) {
    previousValue = calculate(previousValue, inputValue, currentOperator);
    currentValue = String(previousValue);
    updateDisplay();
  }

  currentOperator = operator;
  waitingForNextValue = true;
}

function calculate(first, second, operator) {
  switch (operator) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '*':
      return first * second;
    case '/':
      return second === 0 ? 'Error' : first / second;
    case '%':
      return second === 0 ? 'Error' : first % second;
    default:
      return second;
  }
}

function handleEquals() {
  if (currentOperator === null || waitingForNextValue) {
    return;
  }

  const inputValue = Number(currentValue);
  const result = calculate(previousValue, inputValue, currentOperator);

  currentValue = result === 'Error' ? 'Error' : String(result);
  previousValue = null;
  currentOperator = null;
  waitingForNextValue = false;
  updateDisplay();
}

function handleDecimal() {
  if (waitingForNextValue) {
    currentValue = '0.';
    waitingForNextValue = false;
    updateDisplay();
    return;
  }

  if (!currentValue.includes('.')) {
    currentValue += '.';
    updateDisplay();
  }
}

function clearCalculator() {
  currentValue = '0';
  previousValue = null;
  currentOperator = null;
  waitingForNextValue = false;
  updateDisplay();
}

function deleteDigit() {
  if (waitingForNextValue) {
    waitingForNextValue = false;
    currentValue = String(previousValue ?? 0);
    updateDisplay();
    return;
  }

  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
  updateDisplay();
}

numberButtons.forEach((button) => {
  button.addEventListener('click', handleNumberClick);
});

operatorButtons.forEach((button) => {
  button.addEventListener('click', handleOperatorClick);
});

decimalButton.addEventListener('click', handleDecimal);
equalButton.addEventListener('click', handleEquals);
clearButton.addEventListener('click', clearCalculator);
deleteButton.addEventListener('click', deleteDigit);

updateDisplay();

window.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    const button = [...numberButtons].find((item) => item.dataset.value === key);
    if (button) button.click();
  }

  if (['+', '-', '*', '/', '%'].includes(key)) {
    const button = [...operatorButtons].find((item) => item.dataset.op === key);
    if (button) button.click();
  }

  if (key === '.') {
    decimalButton.click();
  }

  if (key === 'Enter' || key === '=') {
    equalButton.click();
  }

  if (key === 'Backspace') {
    deleteDigit();
  }

  if (key === 'Escape') {
    clearCalculator();
  }
});
