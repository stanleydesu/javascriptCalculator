"use strict";

(function() {
	// calculator constructor
	function Calculator() {
		// private variables
		let expression = [],
			result = 0;

		// private functions
		function isNumber(n) {
			// if n is a number, Number(n) equates to the number, and not NaN
			// if n is an operator (e.g. '.' or '*'), Number(n) equates to NaN
			return !Object.is(NaN, Number(n)) || n !== n;
		}

		// functions the user can use to manipulate private variables
		// clear expression array and result
		this.clearAll = function() {
			expression.length = 0;
			result = 0;
		};
		// clear last variable / operator
		this.clearLast = function() {
			return expression.pop();
		};
		// check if current expression is valid
		this.isValidExpression = function() {
			let shouldBeNumber = true;
			for (let i = 0, len = expression.length; i < len; ++i) {
				if (shouldBeNumber) {
					// if current isn't a number
					if (!isNumber(expression[i])) {
						return false;
					}
					shouldBeNumber = false;
				} else {
					// if current is a number
					if (isNumber(expression[i])) {
						return false;
					}
					shouldBeNumber = true;				
				}
			}
			// if last value is a number, expression is complete
			return isNumber(expression[expression.length - 1]);
		};
		// evaluates the expression array, expression array becomes result
		this.evaluate = function() {
			if (this.isValidExpression()) {
				expression = expression.map(item => {
					if (isNumber(item)) {
						return Number(item);
					} else if (item === '^') {
						return '**';
					} else {
						return item;
					}
				});
				result = Number(eval(expression.join('')).toFixed(5));
				expression.length = 0;
				expression.push(result);
			}
		};
		// retrieves last input of expression array
		this.lastInput = function() {
			return expression[expression.length - 1];
		};
		// sets last input of expression array
		this.setLastInput = function(value) {
			expression[expression.length - 1] = value;
		};
		// adds an input (variable or operator) to the expression array if it is valid 
		this.addInput = function(input) {
			// if the last item of expression array was a variable (number) and input is a string
			if (isNumber(this.lastInput()) && !isNumber(input)) {
				expression.push(input);
			} else if (!isNumber(this.lastInput()) && isNumber(input)) {
				expression.push(input);
			}
		};
		// gets the expression in string form
		this.getExpression = function() {
			return expression.join('');
		};
		// gets the result
		this.getResult = function() {
			return result;
		};
		// handles all inputs
		this.handleInput = function(input) {
			let inputType = isNumber(input) ? 'number' : 'string',
				lastInput = calculator.lastInput(),
				lastInputType = isNumber(lastInput) ? 'number' : 'string';

			if (inputType === 'number') {
				// if current input and last input are numbers
				if (lastInputType === 'number') {
					// if last value of expression is result, clear expression
					// fallback for NaN added
					if (lastInput === this.getResult() || lastInput !== lastInput) {
						this.clearAll();
						this.addInput(input);
					} else {
						// continue adding more digits to last input (current number)
						this.setLastInput(lastInput + input);
					}
				} else {
					this.addInput(input);
				}
			} else if (inputType === 'string') {
				// if user wants to evaluate expression
				if (input === '=') {
					this.evaluate();
				} else if (input === '.') {
					// only allow a decimal point if last input is a number with no decimal point
					// and last input isn't result
					if (lastInputType === 'number' && lastInput !== this.getResult() && lastInput.indexOf('.') === -1) {
						this.setLastInput(lastInput + '.');
					}
				} else if (input === 'AC') {
					calculator.clearAll();
				} else if (input === 'CE') {
					calculator.clearLast();
				} else if (input === '±') {
					// if last input was a number, change last input to its additive inverse / opposite
					if (isNumber(calculator.lastInput())) {
						calculator.setLastInput(calculator.lastInput() * -1);
					}
				} else {
					// an operator was pressed
					this.addInput(input);
				}
			}
		};
	}

	// returns the value of key pressed by user
	function getKeyPressed(keycode, isShifting) {
		const keys = {
			8: "CE",
			13: "=",
			46: "CE",
			48: "0",
		    49: "1",
		    50: "2",
		    51: "3",
		    52: "4",
		    53: "5",
		    54: "6",
		    55: "7",
		    56: "8",
		    57: "9",
		    61: "=",
		    65: "AC",
		    67: "CE",
		    106: "*",
		    107: "+",
		    109: "-",
		    110: ".",
		    111: "/",
		    187: "=",
		    189: "-",
		    190: ".",
		    191: "/"
		},
		shiftKeys = {
			54: "^",
			56: "*",
			187: "+"
		};
		return isShifting ? shiftKeys[keycode] : keys[keycode]; 
	}

	// temporarily activates active state of button
	function toggleActiveState(button) {
		if (button) {
			button.classList.toggle('active');
			setTimeout(function() {
				button.classList.toggle('active');
			}, 100);
		}
	}

	// variables
	const screen = document.getElementById('screen'),
		  buttons = document.getElementById('buttons');

	let calculator = new Calculator();

	window.addEventListener('keydown', function(e) {
		let keycode = e.keyCode || e.which,
			isShifting = e.shiftKey,
			key = getKeyPressed(keycode, e.shiftKey);

		if (key) {
			toggleActiveState(document.querySelector(`[data-id="${key}"`));
			calculator.handleInput(key);
		}
		screen.textContent = calculator.getExpression();
	});

	buttons.addEventListener('click', function(e) {
		let key = e.target.getAttribute('data-id');
		if (key) {
			calculator.handleInput(key);
		}
		screen.textContent = calculator.getExpression();
	});
}());