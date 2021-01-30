var gosper_gun = {
	"x": [1, 1, 2, 2, 11, 11, 11, 12, 12, 13, 13, 14, 14, 15, 16, 16, 17, 17, 17, 18, 21, 21, 21, 22, 22, 22, 23, 23, 25, 25, 25, 25, 35, 35, 36, 36],
	"y": [5, 6, 5, 6, 5, 6, 7, 4, 8, 3, 9, 3, 9, 6, 4, 8, 5, 6, 7, 6, 3, 4, 5, 3, 4, 5, 2, 6, 1, 2, 6, 7, 3, 4, 3, 4],
	"universe": "torus",
	"name": "Gosper's Gun"
};

var glider = {
	"x": [2, 3, 1, 2, 3],
	"y": [1, 2, 3, 3, 3],
	"universe": "torus",
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
	"glider_army": glider_army
};


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
