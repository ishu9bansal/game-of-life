var gosper_gun = {
	"x": [1, 1, 2, 2, 11, 11, 11, 12, 12, 13, 13, 14, 14, 15, 16, 16, 17, 17, 17, 18, 21, 21, 21, 22, 22, 22, 23, 23, 25, 25, 25, 25, 35, 35, 36, 36],
	"y": [5, 6, 5, 6, 5, 6, 7, 4, 8, 3, 9, 3, 9, 6, 4, 8, 5, 6, 7, 6, 3, 4, 5, 3, 4, 5, 2, 6, 1, 2, 6, 7, 3, 4, 3, 4],
	"universe": "torus",
	"name": "Gosper's Gun"
};

var empty_pattern = {
	"name": "Empty"
};

var random_pattern = {
	"scale": true,
	"call": function(i,j,v){ return Math.random()<v; },
	"name": "Random"
};

var full_pattern = {
	"call": function(i,j,v){ return true; },
	"name": "Full"
};

var patterns = {
	"empty": empty_pattern,
	"random": random_pattern,
	"full": full_pattern,
	"gosper": gosper_gun
};

// TODO: glider array
