var dirs = [0,1,1,0,-1,-1,1,-1,0];
var dir4 = [0,-1,0,1,0];

function boxNeighbor(i,j,k){
	var I = i+dirs[k];
    var J = j+dirs[k+1];
    return I>=0&&I<rows&&J>=0&&J<cols ? grid[I][J]%2 : 0;
}

function boxPan(k){
	return null;
}

var box_universe = {
	"name": "Box",
	"pan": boxPan,
	"neighbor": boxNeighbor
};

function torusNeighbor(i,j,k){
    var I = (i+dirs[k]+rows)%rows;
    var J = (j+dirs[k+1]+cols)%cols;
    return grid[I][J]%2;
}

function torusPan(k){
	return [dir4[k+1],dir4[k]];
}

var torus_universe = {
	"name": "Torus",
	"pan": torusPan,
	"neighbor": torusNeighbor
};

var multiverse = {
	"box": box_universe,
	"torus": torus_universe
};