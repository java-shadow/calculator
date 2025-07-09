// Calculator State
let currentInput = '0';
let expression = '';
let lastResult = null;
let justEvaluated = false;

const display = document.getElementById('display');
const formulaDisplay = document.getElementById('formula-display');

function updateDisplay(value) {
    display.textContent = value;
}

function updateFormulaDisplay(formula) {
    formulaDisplay.textContent = formula;
}

function clearAll() {
    currentInput = '0';
    expression = '';
    lastResult = null;
    justEvaluated = false;
    updateDisplay(currentInput);
    updateFormulaDisplay('');
}

document.getElementById('clear').addEventListener('click', clearAll);

function inputNumber(num) {
    if (justEvaluated) {
        currentInput = num;
        justEvaluated = false;
        updateFormulaDisplay('');
    } else if (currentInput === '0') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    updateDisplay(currentInput);
    updateFormulaDisplay(expression + currentInput);
}

function inputDecimal() {
    if (justEvaluated) {
        currentInput = '0.';
        justEvaluated = false;
        updateFormulaDisplay('');
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay(currentInput);
    updateFormulaDisplay(expression + currentInput);
}

function inputOperator(op) {
    if (justEvaluated) {
        expression = lastResult !== null ? lastResult.toString() : currentInput;
        justEvaluated = false;
    } else {
        // If operator is pressed after another operator (except negative sign)
        if (/[-+*/]$/.test(expression)) {
            // Allow negative sign after operator
            if (op === '-' && !/[-]$/.test(expression)) {
                expression += op;
            } else {
                // Replace last operator (except for negative)
                expression = expression.replace(/[-+*/]+$/, op);
            }
        } else {
            expression += currentInput;
            expression += op;
        }
    }
    currentInput = '';
    updateDisplay(op);
    updateFormulaDisplay(expression);
}

function evaluate() {
    if (justEvaluated) return;
    expression += currentInput;
    // Replace multiple operators with the last one (except negative)
    expression = expression.replace(/([+*/])-+/, '$1-');
    expression = expression.replace(/([+*/])-+([+*/])/, '$2');
    try {
        // Use Function constructor for safe evaluation
        let result = Function('return ' + expression.replace(/[^-+*/.\d]/g, ''))();
        // Handle floating point precision
        result = Math.round((result + Number.EPSILON) * 10000) / 10000;
        updateDisplay(result);
        updateFormulaDisplay(expression + '=' + result);
        lastResult = result;
        currentInput = result.toString();
        expression = '';
        justEvaluated = true;
    } catch (e) {
        updateDisplay('Error');
        updateFormulaDisplay('');
        currentInput = '0';
        expression = '';
        justEvaluated = false;
    }
}

// Number buttons
['zero','one','two','three','four','five','six','seven','eight','nine'].forEach((id, num) => {
    document.getElementById(id).addEventListener('click', () => inputNumber(num.toString()));
});

document.getElementById('decimal').addEventListener('click', inputDecimal);

document.getElementById('add').addEventListener('click', () => inputOperator('+'));
document.getElementById('subtract').addEventListener('click', () => inputOperator('-'));
document.getElementById('multiply').addEventListener('click', () => inputOperator('*'));
document.getElementById('divide').addEventListener('click', () => inputOperator('/'));

document.getElementById('equals').addEventListener('click', evaluate);

document.addEventListener('DOMContentLoaded', clearAll); 