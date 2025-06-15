var gosper_gun = {
	"x": [1, 1, 2, 2, 11, 11, 11, 12, 12, 13, 13, 14, 14, 15, 16, 16, 17, 17, 17, 18, 21, 21, 21, 22, 22, 22, 23, 23, 25, 25, 25, 25, 35, 35, 36, 36],
	"y": [5, 6, 5, 6, 5, 6, 7, 4, 8, 3, 9, 3, 9, 6, 4, 8, 5, 6, 7, 6, 3, 4, 5, 3, 4, 5, 2, 6, 1, 2, 6, 7, 3, 4, 3, 4],
	"universe": "cylinder",
	"name": "Gosper's Gun"
};

var game_of_life = {
	"x": [ 54, 56, 55, 56, 13, 14, 15, 21, 26, 30, 33, 34, 35, 36, 37, 55, 12, 16, 20, 22, 26, 27, 29, 30, 33, 12, 19, 23, 26, 28, 30, 33, 60, 12, 19, 23, 26, 30, 33, 34, 35, 36, 61, 12, 14, 15, 16, 19, 20, 21, 22, 23, 26, 30, 33, 59, 60, 61, 12, 16, 19, 23, 26, 30, 33, 12, 16, 19, 23, 26, 30, 33, 13, 14, 15, 19, 23, 26, 30, 33, 34, 35, 36, 37, 41, 42, 43, 47, 48, 49, 50, 51, 40, 44, 47, 40, 44, 47, 40, 44, 47, 48, 49, 50, 5, 7, 40, 44, 47, 5, 6, 40, 44, 47, 6, 40, 44, 47, 41, 42, 43, 47, 8, 19, 26, 27, 28, 29, 30, 33, 34, 35, 36, 37, 40, 41, 42, 43, 44, 7, 19, 28, 33, 40, 7, 8, 9, 19, 28, 33, 40, 19, 28, 33, 34, 35, 36, 40, 41, 42, 43, 19, 28, 33, 40, 19, 28, 33, 40, 19, 28, 33, 40, 58, 19, 20, 21, 22, 23, 26, 27, 28, 29, 30, 33, 40, 41, 42, 43, 44, 57, 58, 59, 58, 7, 8, 7, 8, 55, 55, 60, 61, 62, 55],
	"y": [ 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 15, 15, 15, 15, 15, 15, 15, 15, 16, 16, 16, 17, 17, 17, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 29, 29, 29, 29, 30, 30, 30, 30, 30, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 32, 34, 34, 35, 35, 35, 36, 36, 36, 36, 37],
	"universe": "cylinder",
	"name": "Landing screen"
};

var glider = {
	"x": [2, 3, 1, 2, 3],
	"y": [1, 2, 3, 3, 3],
	"universe": "klein",
	"name": "Glider"
}

var glider_army = {
	"blueprint": [
		[0,0,0,0,0],
		[0,0,1,0,0],
		[0,0,0,1,0],
		[0,1,1,1,0],
		[0,0,0,0,0]
	],
	"call": function(i,j,v){
		if(i>=5*Math.floor(rows/5)||j>=5*Math.floor(cols/5))
			return false;
		return this.blueprint[i%5][j%5];
	},
	"grid": function(res, h, w){
		r = Math.floor(h/res);
		c = Math.floor(w/res);
		r = 5*Math.floor(r/5);
		c = 5*Math.floor(c/5);
		newg = [];
		for(i=0; i<r; i++){
			var temp = [];
			for(j=0; j<c; j++){
				temp.push(this.blueprint[i%5][j%5]);
			}
			newg.push(temp);
		}
		return newg;
	},
	"speed": 1,
	"universe": "torus",
	"name": "Glide Army"
}

var empty_pattern = {
	"name": "Empty"
};

var random_pattern = {
	"scale": true,
	"call": function(i,j,v){ return Math.random()<v; },
	"universe": "mobius",
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
	"glider": glider,
	"gosper": gosper_gun,
	"home": game_of_life,
	"glider_army": glider_army
};

// TODO: add tutorial

function capturePattern(){
	arr = {
		"x": [],
		"y": []
	};
	for(i=0; i<grid.length; i++){
	    for(j=0; j<grid[i].length; j++){
	        if(grid[i][j]){
	            arr.x.push(j);
	            arr.y.push(i);
	        }
	    }
	}
	return arr;
}
