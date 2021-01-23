var rows = 10, cols = 10;
var resolution = 50;
var data = [];
var grid = [];
var dirs = [0,1,1,0,-1,-1,1,-1,0];
var stop = 0;
var squares;
var svg = null;
var delay = 100;
var transition = 150;

function initData(){
    data = [];
    newg = [];
    resolution = document.getElementById("resolution").value;
    rows = document.getElementById("rows").value;
    cols = document.getElementById("cols").value;

    for(i=0; i<rows; i++){
        var temp = [];
        for(j=0; j<cols; j++){
            data.push({
                x: j,
                y: i
            });
            if(i<grid.length&&j<grid[i].length)
                temp.push(grid[i][j]);
            else
                temp.push(0);
        }
        newg.push(temp);
    }
    grid = newg;
}

function enterSquare(){
    squares
    .enter().append("rect")
    .attr("class","square")
    .attr("x", function(d) {
        return resolution*Math.floor(Math.random()*cols);
    })
    .attr("y", function(d) {
        return resolution*Math.floor(Math.random()*rows);
    })
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .on("click", handleClick)
    .style("stroke", "black")
    .style("fill","grey");
}

function render(sec, translation = false){
    if(translation){
        squares
        .transition().duration(sec)
        .attr("width", resolution)
        .attr("height", resolution)
        .attr("x", function(d) { return resolution*d.x; })
        .attr("y", function(d) { return resolution*d.y; })
        .style("fill", function(d) {
            return grid[d.y][d.x] ? "white" : "black";
        });
    }
    else{
        squares
        .transition().duration(sec)
        .style("fill", function(d) {
            return grid[d.y][d.x] ? "white" : "black";
        });
    }
}

function random(){
    for(i=0; i<rows; i++)
        for(j=0; j<cols; j++)
            grid[i][j] = Math.floor(Math.random()*2);
    render(500);
}

function reset(){
    for(i=0; i<rows; i++)
        for(j=0; j<cols; j++)
            grid[i][j] = 0;
    render(500);
}

function update(){
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
    render(transition);
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
        return grid[d.y][d.x] ? "white" : "black";
    });
}

function handleClick(d,i){
    grid[d.y][d.x] = 1-grid[d.y][d.x];
}

function renderAnimateButtonText(){
    document.getElementById("evolveButton").setAttribute("value", stop?"Pause":"Play");
}

function evolve(){
    if(stop){
        clearInterval(stop);
        stop = 0;
    }
    else    stop = setInterval(update, delay);
    renderAnimateButtonText();
}

// function handleDelay(){
//     delay = document.getElementById("delay").value;
//     transition = document.getElementById("transition").value;
// }

function handleChange(){
    if(stop) evolve();
    initData();
    if(svg==null){
        svg = d3.select("svg")
        .attr("width", 1)
        .attr("height", 1)
        .attr("class", "svg-container")
        .style("background-color", "black");
    }
    svg.transition().duration(500)
    .attr("width", resolution*cols)
    .attr("height", resolution*rows);

    squares = svg.selectAll(".square").data(data, function(d){
        return 1000*d.x+d.y;
    });
    enterSquare();
    squares.exit().remove();
    squares = svg.selectAll(".square");
    render(750, true);
}

handleChange();
