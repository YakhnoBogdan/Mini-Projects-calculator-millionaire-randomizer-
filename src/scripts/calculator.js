const calculator = document.querySelector('.calculator');

const options = {
    controlsBoard: calculator.querySelector('.calculator__controls-board'),
    digits: calculator.querySelectorAll('.digit-sign'),
    signs: calculator.querySelectorAll('.calc-sign'),
    outputField: calculator.querySelector('.calculator__output'),
    clearButton: calculator.querySelector('#clear'),
    percentButton: calculator.querySelector('#percent'),
    equalsButton: calculator.querySelector('.equal'),
    comma: calculator.querySelector('.comma'),
    minus: calculator.querySelector('#positive-negative'),
}


class Calculator {
    constructor(options) {
        this.controlsBoard = options.controlsBoard;
        this.outputField = options.outputField;
        this.prevValue = this.outputField.value;
        this.digits = options.digits;
        this.signs = options.signs;
        this.minus = options.minus;
        this.clearButton = options.clearButton;
        this.percentButton = options.percentButton;
        this.equalsButton = options.equalsButton;
        this.comma = options.comma;
        this.controlsBoard.addEventListener('click', this);
        this.controlsBoard.addEventListener('keydown', this);
    }

    clear() {
        this.outputField.value = '0';
        this.prevValue = '';
        this.nextValue = '';
        this.sign = '';
        this.signs.forEach(el => el.classList.remove('black'));
        this.tempValue = '';
    }

    updateOutput(digit) {
        if (this.sign) {
            this.nextValue === '' ?
                this.outputField.value = '' : digit;
            this.outputField.value += digit;
            this.nextValue = this.outputField.value
            this.tempValue = '';
        } else {
            this.outputField.value == '0' ?
                this.outputField.value = '' : digit;
            this.outputField.value += digit;
            this.prevValue = this.outputField.value;
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

    addComma(comma) {
        if (!this.outputField.value.includes(comma)) {
            this.outputField.value += comma;
            if (this.prevValue && !this.nextValue && this.sign) {
                this.nextValue = '0' + comma;
                this.outputField.value = this.nextValue;
            } else if (this.prevValue && this.tempValue && this.sign) {
                this.nextValue = '0' + comma;
                this.outputField.value = this.nextValue;
            } 
        }
    }

    addMinus() {
        if (this.outputField.value == '0') return;
        if (this.outputField.value.includes('-')) {
            this.outputField.value = this.outputField.value.split('-')[1];
            this.prevValue ? this.nextValue = this.outputField.value : this.prevValue = this.outputField.value;
        } else {
            this.outputField.value = '-' + this.outputField.value;
            if (this.prevValue && !this.nextValue) {
                this.prevValue = this.outputField.value;
            } else if (this.prevValue && this.nextValue) {
                this.nextValue = this.outputField.value;
            } else if (this.prevValue && this.tempValue) {
                this.prevValue = this.outputField.value;
            }
        }
    }

    backspace() {
        this.outputField.value = this.outputField.value.slice(0, this.outputField.value.length - 1);
        this.nextValue ? this.nextValue = this.outputField.value : this.prevValue = this.outputField.value;
    }
    getPercent() {
        if (this.prevValue && this.nextValue && (this.sign == '+' || this.sign == '-')) {
            this.outputField.value = (this.prevValue / 100) * this.nextValue;
            this.nextValue = this.outputField.value;
        } else  {
            this.outputField.value = this.outputField.value / 100;
            this.prevValue ? this.nextValue = this.outputField.value : this.prevValue = this.outputField.value;
        }
    }

    equals() {
        this.signs.forEach(element => element.classList.remove('black'));
        if (this.prevValue && this.nextValue && this.sign && !this.tempValue) {
            this.tempValue = this.nextValue;
            this.outputField.value = this.calculation(this.prevValue, this.nextValue, this.sign);
            this.prevValue = this.outputField.value;
            this.nextValue = '';
        } else if (this.prevValue && this.sign && this.tempValue){
            this.outputField.value = this.calculation(this.prevValue, this.tempValue, this.sign);
            this.prevValue = this.outputField.value;
        } else if (this.prevValue && this.sign) {
            this.outputField.value = this.calculation(this.prevValue, this.prevValue, this.sign);
            this.tempValue = this.prevValue;
        }
    }

    calculation(prevValue, nextValue, sign) {
        switch (sign) {
            case '+':
                if (prevValue.includes('.') || nextValue.includes('.')) {
                    return ((+prevValue) * 10 + (+nextValue) * 10) / 10;
                }
                return (+prevValue) + (+nextValue);
                break;

            case '-':
                if (prevValue.includes('.') || nextValue.includes('.')) {
                    return ((+prevValue) * 10 - (+nextValue) * 10) / 10;
                }
                return (+prevValue) - (+nextValue);
                break;

            case 'x':
                if (prevValue.includes('.') || nextValue.includes('.')) {
                    return ((+prevValue) * 10 * (+nextValue) * 10) / 10;
                }
                return (+prevValue) * (+nextValue);
                break;

            case '/':
                if (prevValue.includes('.') || nextValue.includes('.')) {
                    return (((+prevValue) * 10) / ((+nextValue) * 10)) / 10;
                }
                return (+prevValue) / (+nextValue);
                break;
            default:
                break;
        }
    }

    handleEvent(event) {

        if (event.type == 'click') {
            switch (event.target) {
                case this.clearButton:
                    this.clear();
                    break;
                case this.comma:
                    this.addComma(event.target.innerText);
                    break;
                case this.equalsButton:
                    this.equals();
                    break;
                case this.percentButton:
                    this.getPercent();
                    break;
                case this.minus:
                    this.addMinus();
                    break;
                default:
                    if (event.target.classList.contains('digit-sign')) {
                        this.updateOutput(event.target.innerText);
                    } else if (event.target.classList.contains('calc-sign')) {
                        this.focusSign(event.target.innerText);
                        this.signs.forEach(element => element.classList.remove('black'));
                        event.target.classList.add('black');
                    }
                    break;
            }
        }

        if (event.type == 'keydown') {
            this.equalsButton.focus();
            if ([...this.digits].some(el => el.innerText.includes(event.key))) {
                this.updateOutput(event.key);
            } else if ([...this.signs].some(el => el.innerText.includes(event.key))) {
                this.focusSign(event.key);
                this.signs.forEach(element => {
                    element.classList.remove('black')
                    if (element.innerText == event.key) {
                        element.classList.add('black');
                    }
                });
            } else {
                switch (event.code) {
                    case 'KeyC':
                        this.clear();
                        break;
                    case 'Backspace':
                        this.backspace();
                        break;
                    case 'Period':
                        this.addComma('.');
                        break;

                    default:
                        break;
                }
            }
        }

    }
}

let calc = new Calculator(options);
calc.clear();



calculator.addEventListener('click', () => {
    console.log(`sign: ${calc.sign} | prev: ${calc.prevValue} | next: ${calc.nextValue}`);
})