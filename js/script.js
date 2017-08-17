"use strict";

(function() {
	// calculator constructor with inbuilt functions
	function Calculator() {
		// private variables
		const expression = [];
		let result = 0;
		// clear expression array and result
		this.clearAll = function() {
			expression.length = 0;
			result = 0;
		};
		// clear last variable / operator
		this.clearLast = function() {
			return expression.pop();
		};
		this.isValidExpression = function() {
			let isNumber = true;
			for (let i = 0, len = expression.length; i < len; ++i) {
				if (isNumber) {
					if (typeof(expression[i]) !== 'number') {
						return false;
					}
					isNumber = false;
				} else {
					if (typeof(expression[i]) === 'number') {
						return false;
					}
					isNumber = true;				
				}
			}
			// if last value is a number, expression is complete
			return typeof(expression[expression.length - 1]) === 'number';
		};
		// evaluates the expression array and stores result into result
		// and updates expression
		this.evaluate = function() {
			result = eval(expression.join(''));
			expression.length = 0;
			expression.push(result);
		};
		this.lastInput = function() {
			return expression[expression.length - 1];
		};
		// adds an input (variable or operator) to the expression array if it is valid 
		this.addInput = function(input) {
			// if the last item of expression array was a variable (number), next should be an operator
			if (typeof(this.lastInput()) === 'number') {
				if (typeof(input) === 'string') {
					expression.push(input);
				}
			} else {
				if (typeof(input) === 'number') {
					expression.push(input);
				}
			}
		};
		this.getExpression = function() {
			return expression.join(' ');
		}
		this.getResult = function() {
			return result;
		};
	}

	// returns the value of key pressed by user
	// param1: ascii value of key pressed
	// param2: boolean of whether or not shift was pressed
	function getKeyPressed(keycode, isShifting) {
		const keys = {
			48: 0,
		    49: 1,
		    50: 2,
		    51: 3,
		    52: 4,
		    53: 5,
		    54: 6,
		    55: 7,
		    56: 8,
		    57: 9,
		    61: "=",
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
			56: "*",
			187: "+"
		};
		return isShifting ? shiftKeys[keycode] : keys[keycode]; 
	}

	// variables
	const screen = document.getElementById('screen');
	let calculator = new Calculator();

	window.addEventListener('keydown', function(e) {
		let keycode = e.keyCode || e.which,
			key = getKeyPressed(keycode, e.shiftKey),
			type = typeof(key);

		// if user wants to evaluate expression
		if (key === '=' || keycode === 13) {
			if (calculator.isValidExpression()) {
				calculator.evaluate();
				screen.textContent = calculator.getResult();
			}
		} else if (key !== undefined) {
			// if number was pressed and last input was number
			if (type === 'number' && typeof(calculator.lastInput()) === 'number') {
				// if last value of expression isn't result, continue adding digits to current number
				if (calculator.lastInput() !== calculator.getResult()) {
					calculator.addInput((calculator.clearLast() * 10) + key);
				} else {
					calculator.clearAll();
					calculator.addInput(key);
				}
			} else {
				calculator.addInput(key);
			}
			// display full expression
			screen.textContent = calculator.getExpression();
		}
	});
}());

