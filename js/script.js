"use strict";

function handleInput(arr, input) {
	arr.push(input);
	// expression must start with number, initialise with true
	let isNumber = true;
	for (let i = 0, len = arr.length; i < len; ++i) {
		if (isNumber) {
			if (typeof(arr[i]) !== 'number') {
				arr.pop();
			}
			isNumber = false;
		} else {
			if (typeof(arr[i]) === 'number') {
				arr.pop();
			}
			isNumber = true;				
		}
	}
}

