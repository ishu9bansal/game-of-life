var rows = 10, cols = 10;
var resolution = 50;
var data = [];
var grid = [];
var stop = 0;
var squares;
var svg = null;
var delay = 100;
var transition = 150;
var factor = 1.0;
var width = 1250;
var height = 650;
var universe = "box";

function initData(){
    data = [];
    grid = [];
    draw_area = document.getElementsByClassName("draw_area")[0];
    width = draw_area.clientWidth;
    height = draw_area.clientHeight;
    svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "grey");
}

// data manipulator methods
function rescaleData(r,c){
    document.getElementById("rows").innerText = rows = r;
    document.getElementById("cols").innerText = cols = c;
    newg = [];
    data = [];
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

function update(){
    for(i=0; i<rows; i++){
        for(j=0; j<cols; j++){
            var c = 0;
            for(k=0; k<8; k++)
                c += multiverse[universe].neighbor(i,j,k);    // universe boundary condition
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
// control data binders
function changeResolution(value = null){
    if(value!=null && value>=3 && value<=50){
        document.getElementById("resolution").value = value;
    }
    resolution = parseInt(document.getElementById("resolution").value);
}

function changeUniverse(key = null){
    if(key && multiverse[key]){
        document.getElementById("universe").value = key;
    }
    universe = document.getElementById("universe").value;
}

function changeSpeed(value = null){
    if(value!=null && value>-4 && value<4){
        document.getElementById("speed").value = value;
    }
    speed = document.getElementById("speed").value;
    factor = Math.pow(2,speed);
    if(stop){
        evolve();
        evolve();
    }
}

// event listners
function handleKeyPress(e){
    k = e.which-37;
    if(stop||k<0||k>3)  return;
    if(!multiverse[universe].pan)   return;
    xy = multiverse[universe].pan(k);
    if(!xy) return;
    moveGrid(...xy);
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

function handleResetChange(){
    reset_type = document.getElementById("reset").value;
    document.getElementById("scale").style.visibility = patterns[reset_type]["scale"]?"visible":"hidden";
}

// animation
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

// complex controls
function handleChange(res = null, r = null, c = null){
    // pause animation if playing
    if(stop) evolve();

    // update or get latest resolution
    changeResolution(res);

    // if rows and cols are not given assume the max which can fit
    if(r==null) r = Math.floor(height/resolution);
    if(c==null) c = Math.floor(width/resolution);

    // rescale grid and data array
    rescaleData(r,c);

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

function evolve(){
    if(stop){
        clearInterval(stop);
        stop = 0;
    }
    else    stop = setInterval(update, delay/factor);
    document.getElementById("play_pause").setAttribute("class", stop?"fa fa-pause":"fa fa-play");
}

function reset(){
    reset_type = document.getElementById("reset").value;
    scale = document.getElementById("scale").value;
    pattern = patterns[reset_type];
    changeUniverse(pattern["universe"]);
    changeSpeed(pattern["speed"]);
    for(i=0; i<rows; i++)
        for(j=0; j<cols; j++)
            grid[i][j] = pattern.call && pattern.call(i,j,scale) ? 1 : 0;
    l = patternLength(pattern);
    for (var i = 0; i < l; i++) {
        grid[pattern.y[i]][pattern.x[i]] = 1;
    }
    render(500);
}

// helper methods
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

function initializeSelectOptions(selectId, optionsMap, default_value){
    select_element = document.getElementById(selectId);
    for(key in optionsMap){
        option = document.createElement("option");
        option.value = key;
        option.innerText = optionsMap[key]["name"];
        select_element.add(option);
    }
    select_element.value = default_value;
}

// initial callbacks
initData();
initializeSelectOptions("universe", multiverse, universe);
initializeSelectOptions("reset", patterns, "empty");
handleChange();
window.onkeydown = handleKeyPress;
