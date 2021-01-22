var rows = 10, cols = 10;
var resolution = 50;
var data = [];
var grid = [];
function init(){
    for(i=0; i<rows; i++){
        var temp = [];
        for(j=0; j<cols; j++){
            data.push({
                x: i,
                y: j
            });
            temp.push(0);
        }
        grid.push(temp);
    }
}
init();

var svg = d3.select("svg")
    .attr("width", resolution*cols)
    .attr("height", resolution*rows)
    .attr("class", "svg-container")
    .style("background-color", "black");

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
        return grid[d.x][d.y] ? "white" : "black";
    });
}

function random(){
    for(i=0; i<rows; i++)
        for(j=0; j<cols; j++)
            grid[i][j] = Math.floor(Math.random()*2);
}
