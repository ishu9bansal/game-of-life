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
var factor = 1.0;
var width = 1250;
var height = 650;
// TODO: arrow control for rows and cols
var universe = "box";

function initData(){
    data = [];
    newg = [];
    draw_area = document.getElementsByClassName("draw_area")[0];
    width = draw_area.clientWidth;
    height = draw_area.clientHeight;
    resolution = parseInt(document.getElementById("resolution").value);
    cols = Math.floor(width/resolution);
    rows = Math.floor(height/resolution);
    document.getElementById("rows").innerText = rows;
    document.getElementById("cols").innerText = cols;

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

function render(sec, translation = false){
    // TODO: move colors to css
    trans = squares
        .transition().duration(sec)
        // .style("opacity", 1)    // sprinkler glitch
        .style("fill", function(d) {
            return grid[d.y][d.x] ? "white" : "black";
        });
    if(translation){
        trans
        .attr("width", resolution)
        .attr("height", resolution)
        .attr("x", function(d) { return resolution*d.x; })
        .attr("y", function(d) { return resolution*d.y; })
        .on("start", function() {
            d3.select(this)
            .on("mouseover", null)
            .on("mouseout", null)
            .on("click", null);
        })
        .on("end", function() {
            d3.select(this)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("click", handleClick);
        });
    }
}

function reset(randomness, pattern){
    for(i=0; i<rows; i++)
        for(j=0; j<cols; j++)
            grid[i][j] = Math.random()<randomness?1:0;
    l = patternLength(pattern);
    for (var i = 0; i < l; i++) {
        grid[pattern.y[i]][pattern.x[i]] = 1;
    }
    render(500);
}

function patternLength(pattern){
    if(
        pattern && 
        pattern.x && 
        pattern.y && 
        pattern.x.length == pattern.y.length &&
        Math.max(...pattern.x)<cols-1 &&
        Math.max(...pattern.y)<rows-1
    )
        return pattern.x.length;
    return 0;
}

function resetHandler(){
    reset_type = document.getElementById("reset").value;
    randomness = 0;
    if(reset_type=="random"){
        randomness = document.getElementById("randomness").value;
    }
    else if(reset_type=="full") randomness = 1;
    pattern = null;
    if(reset_type=="gosper"){
        pattern = gosper_gun;
    }
    reset(randomness, pattern);
}

function changeUniverse(){
    universe = document.getElementById("universe").value;
}

function neighbor_active(i,j,k){
    var I = i+dirs[k];
    var J = j+dirs[k+1];
    if(universe=="torus"){
        I = (I+rows)%rows;
        J = (J+cols)%cols;
    }
    return I>=0&&I<rows&&J>=0&&J<cols ? grid[I][J]%2 : 0;
}

function update(){
    for(i=0; i<rows; i++){
        for(j=0; j<cols; j++){
            var c = 0;
            for(k=0; k<8; k++)
                c += neighbor_active(i,j,k);    // universe boundary condition
            if(c==3||(c==2&&grid[i][j]==1))     // game rule
                grid[i][j] += 2;
        }
    }
    for(i=0; i<rows; i++)
        for(j=0; j<cols; j++)
            grid[i][j] = Math.floor(grid[i][j]/2);
    render(transition/factor);
}

function moveGrid(x,y){
    newg = grid;
    for(i=0; i<rows; i++){
        for(j=0; j<cols; j++){
            newg[i][j] = grid[(i+y+rows)%rows][(j+x+cols)%cols];
        }
    }
    grid = newg;
}

function handleKeyPress(e){
    k = e.which-37;
    if(stop||k<0||k>3)  return;
    if(universe=="box") return;
    d = [0,-1,0,1,0];
    moveGrid(d[k+1],d[k]);
    render(500, true);
}

function handleStepForward(){
    if(stop)    evolve();
    update();
}

function handleMouseOver(d,i){
    d3.select(this)
    .transition().duration(250)
    .style("opacity", 0.5);
}

function handleMouseOut(d,i){
    d3.select(this)
    .transition().duration(250)
    .style("opacity", 1);
}

function handleClick(d,i){
    grid[d.y][d.x] = 1-grid[d.y][d.x];
    d3.select(this).style("fill", function(d) {
        return grid[d.y][d.x] ? "white" : "black";
    });
}

function evolve(){
    if(stop){
        clearInterval(stop);
        stop = 0;
    }
    else    stop = setInterval(update, delay/factor);
    document.getElementById("play_pause").setAttribute("class", stop?"fa fa-pause":"fa fa-play");
}

function handleSpeed(){
    speed = document.getElementById("speed").value;
    factor = Math.pow(2,speed);
    if(stop){
        evolve();
        evolve();
    }
}

function handleResetChange(){
    reset_type = document.getElementById("reset").value;
    document.getElementById("randomness").style.visibility = reset_type=="random"?"visible":"hidden";
}

function handleChange(){
    // pause animation if playing
    if(stop) evolve();

    // refresh base data and dimensions
    initData();

    // initialize main svg for the first time
    if(svg==null){
        svg = d3.select(".main")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "grey");
    }

    // slowly transition the silver lining change in dimensions
    svg.transition().duration(500)
    .attr("width", resolution*cols)
    .attr("height", resolution*rows);

    // bind updated data with unique key method
    squares = svg.selectAll(".square").data(data, function(d){
        return 1000*d.x+d.y;
    });

    // enter squares
    squares
    .enter().append("rect")
    .attr("class","square")
    .attr("x", function(d) {
        return resolution*Math.floor(Math.random()*cols);
    })
    .attr("y", function(d) {
        return resolution*Math.floor(Math.random()*rows);
    })
    .style("stroke", "black") // behaviour: grey gives a grid style, removing this smooth objects
    .style("fill","grey");

    // exit squares
    squares.exit().remove();

    // change squares selection
    squares = svg.selectAll(".square");

    // transition squares to the correct positions
    render(750, true);
}

handleChange();
window.onkeydown = handleKeyPress;
