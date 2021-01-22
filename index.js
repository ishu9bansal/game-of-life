var rows = 10, cols = 10;
var resolution = 50;
var data = [];
var svg = d3.select("svg")
    .attr("width", resolution*cols)
    .attr("height", resolution*rows)
    .attr("class", "svg-container")
    .style("background-color", "black");
var grid = [];
for(i=0; i<rows; i++){
    var temp = [];
    for(j=0; j<cols; j++){
        data.push({
            x: i,
            y: j
        });
        temp.push(Math.random() < 0.5);
    }
    grid.push(temp);
}

var squares = svg.selectAll(".square")
    .data(data)
    .enter().append("rect")
    .attr("class","square")
    .attr("x", function(d) { return resolution*d.x; })
    .attr("y", function(d) { return resolution*d.y; })
    .attr("width", resolution)
    .attr("height", resolution)
    .style("stroke", "black");

function update(){
    squares.style("fill", function(d) {
        // return grid[d.x][d.y] ? "white" : "black";
        return Math.random() < 0.5 ? "white" : "black";
    });
}


