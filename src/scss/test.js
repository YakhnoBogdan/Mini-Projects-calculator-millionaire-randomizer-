class Calculator {
    constructor(calcElement, outputField) {
        this.outputField = outputField;
        this.prevValue = outputField.value;
    }
    clear() {
        this.outputField.value = '0';
        this.prevValue = '';
        this.nextValue = '';
        this.sign = '';
    }
    updateOutput(digit) {

        if (this.sign) {
            this.nextValue == '' ?
                this.outputField.value = '' : digit;
            this.outputField.value += digit;
            this.nextValue = outputField.value

        } else {
            this.outputField.value == '0' ?
                this.outputField.value = '' : digit;
            this.outputField.value += digit;
            this.prevValue = outputField.value;
        }
    }
    focusSign(sign) {
        if (this.sign && this.prevValue && this.nextValue) {
            this.outputField.value = this.calculation(this.prevValue, this.nextValue, this.sign);
            this.prevValue = this.outputField.value;
            this.nextValue = '';
        } else if (!this.prevValue) {
            this.prevValue = this.outputField.value;
        }
        this.sign = sign;
    }
    getPercent() {
        this.prevValue /= 100;
        this.outputField.value = this.prevValue;
    }
    equal() {
        if (this.prevValue && this.nextValue && this.sign) {
            this.outputField.value = this.calculation(this.prevValue, this.nextValue, this.sign);
        }
    }
    calculation(prevValue, nextValue, sign) {
        switch (sign) {
            case '+':
                return (+prevValue) + (+nextValue);
                break;

            case '-':
                return (+prevValue) - (+nextValue);
                break;

            case 'x':
                return (+prevValue) * (+nextValue);
                break;

            case '/':
                return (+prevValue) / (+nextValue);
                break;
            default:
                break;
        }
    }
}
const calculator = document.querySelector('.calculator');
const outputField = calculator.querySelector('.calculator__output');
const clearButton = calculator.querySelector('#clear');
const digitsSign = calculator.querySelectorAll('.digit-sign');
const calculatorControlBoard = calculator.querySelector('.calculator__controls-board');
const percentButton = calculator.querySelector('#percent');
const equalButton = calculator.querySelector('.equal');

let calc = new Calculator(calculator, outputField);
calc.clear();

calculatorControlBoard.addEventListener('click', (event) => {
    if (event.target.classList.contains('digit-sign')) {
        calc.updateOutput(event.target.innerText);
        console.log(calc);
    }
    if (event.target.classList.contains('calc-sign')) {
        calc.focusSign(event.target.innerText);
        console.log(calc);
    }
    if (event.target == clearButton) {
        calc.clear();
    }
    if (event.target == percentButton) {
        calc.getPercent();
    }
    if (event.target == equalButton) {
        calc.equal();
        console.log(calc);
    }
})


