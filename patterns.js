var gosper_gun = {
	"x": [1, 1, 2, 2, 11, 11, 11, 12, 12, 13, 13, 14, 14, 15, 16, 16, 17, 17, 17, 18, 21, 21, 21, 22, 22, 22, 23, 23, 25, 25, 25, 25, 35, 35, 36, 36],
	"y": [5, 6, 5, 6, 5, 6, 7, 4, 8, 3, 9, 3, 9, 6, 4, 8, 5, 6, 7, 6, 3, 4, 5, 3, 4, 5, 2, 6, 1, 2, 6, 7, 3, 4, 3, 4],
	"randomness": 0,
	"name": "Gosper's Gun"
};

var empty_pattern = {
	"randomness": 0,
	"name": "Empty"
};

var random_pattern = {
	"scale": function(v) {	randomness = v; },
	"name": "Random"
};

var full_pattern = {
	"randomness": 1,
	"name": "Full"
};

var patterns = {
	"empty": empty_pattern,
	"random": random_pattern,
	"full": full_pattern,
	"gosper": gosper_gun
};

// TODO: glider array
// TODO: resize resolution based on max size
