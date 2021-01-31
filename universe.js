var dirs = [0,1,1,0,-1,-1,1,-1,0];
var dir4 = [0,-1,0,1,0];

function boxNeighbor(i,j,k){
	var I = i+dirs[k];
    var J = j+dirs[k+1];
    return I>=0&&I<rows&&J>=0&&J<cols ? [I,J] : null;
}

var box_universe = {
	"name": "Box",
	"neighbor": boxNeighbor
};

function torusNeighbor(i,j,k){
    var I = (i+dirs[k]+rows)%rows;
    var J = (j+dirs[k+1]+cols)%cols;
    return [I,J];
}

var torus_universe = {
	"name": "Torus",
		// left, up, right, down
	"pan": [true,true,true,true],
	"neighbor": torusNeighbor
};

function cylinderNeighbor(i,j,k){
	var I = (i+dirs[k]+rows)%rows;
	var J = j+dirs[k+1];
	return I>=0&&I<rows&&J>=0&&J<cols ? [I,J] : null;
}

var cylinder_universe = {
	"name": "Cylinder",
		// left, up, right, down
	"pan": [false,true,false,true],
	"neighbor": cylinderNeighbor
}

function mobiusNeighbor(i,j,k){
	var J = j+dirs[k+1];
	if(J<0||J>=cols)	return null;
	var I = (i+dirs[k]+2*rows)%(2*rows);
	return [I%rows,I<rows?J:(cols-1-J)];
}

var mobius_universe = {
	"name": "Mobius Strip",
		// left, up, right, down
	"pan": [false,true,false,true],
	"neighbor": mobiusNeighbor
}

function weirdNeighbor(i,j,k){
	var I = (i+dirs[k]+2*rows)%(2*rows);
	var J = (j+dirs[k+1]+2*cols)%(2*cols);
	return [J<cols?I%rows:(rows-1-I%rows),I<rows?J%cols:(cols-1-J%cols)];
}

var weird_universe = {
	"name": "Weird",
		// left, up, right, down
	"pan": [true,true,true,true],
	"neighbor": weirdNeighbor
}

function kleinNeighbor(i,j,k){
	var I = (i+dirs[k]+2*rows)%(2*rows);
	var J = (j+dirs[k+1]+cols)%cols;
	return [I%rows,I<rows?J:(cols-1-J)];
}

var klein_universe = {
	"name": "Klein Bottle",
		// left, up, right, down
	"pan": [true,true,true,true],
	"neighbor": kleinNeighbor
}

var multiverse = {
	"box": box_universe,
	"torus": torus_universe,
	"cylinder": cylinder_universe,
	"mobius": mobius_universe,
	"weird": weird_universe,	// fucks up corners
	"klein": klein_universe
};