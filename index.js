var rows = 10, cols = 10;
var resolution = 50;
var data = [];
var grid = [];
var dirs = [0,1,1,0,-1,-1,1,-1,0];
var stop = 0;
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
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .on("click", handleClick)
    .style("stroke", "black");

function update(){
    squares
    .transition().duration(250)
    .style("fill", function(d) {
        return grid[d.x][d.y] ? "white" : "black";
    });
}

function random(){
    for(i=0; i<rows; i++)
        for(j=0; j<cols; j++)
            grid[i][j] = Math.floor(Math.random()*2);
    update();
}

function evolve(){
    for(i=0; i<rows; i++){
        for(j=0; j<cols; j++){
            var c = 0;
            for(k=0; k<8; k++){
                var I = i+dirs[k];
                var J = j+dirs[k+1];
                if(I>=0&&I<rows&&J>=0&&J<cols)
                    c += grid[I][J]%2;
            }
            if(c==3||(c==2&&grid[i][j]==1))
                grid[i][j] += 2;
        }
    }
    for(i=0; i<rows; i++)
        for(j=0; j<cols; j++)
            grid[i][j] = Math.floor(grid[i][j]/2);
    update();
}

function handleMouseOver(d,i){
    d3.select(this)
    .transition().duration(250)
    .style("fill", "grey");
}

function handleMouseOut(d,i){
    d3.select(this)
    .transition().duration(250)
    .style("fill", function(d) {
        return grid[d.x][d.y] ? "white" : "black";
    });
}

function handleClick(d,i){
    grid[d.x][d.y] = 1-grid[d.x][d.y];
}

function updateAnimateButtonText(){
    document.getElementsById("animateButton").setAttribute("value", stop?"Pause":"Play")
}

function animate(){
    if(stop){
        clearInterval(stop);
        stop = 0;
    }
    else    stop = setInterval(evolve, 500);
    updateAnimateButtonText();
}
