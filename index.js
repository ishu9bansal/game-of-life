// globals
var rows = 10, cols = 10;
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
var resolution = 25;
var universe = "box";
var mode = "gosper";
var scale = 0.2;

// configs
const SPEED_VALUE = 0;
const config = {
    "resolution": {
        min: 3,
        max: 50,
        step: 1,
        type: "range",
        binder: changeResolution,
        var: "resolution"
    },
    "scale": {
        min: 0,
        max: 1,
        step: 0.01,
        type: "range",
        binder: changeScale,
        var: "scale"
    },
    "speed": {
        min: -3,
        max: 3,
        step: 1,
        type: "range",
        binder: changeSpeed,
        var: "SPEED_VALUE"
    },
    "universe": {
        keys: multiverse,
        type: "select",
        binder: changeUniverse,
        var: "universe"
    },
    "reset": {
        keys: patterns,
        type: "select",
        binder: changeMode,
        var: "mode"
    }
}

function init(){
    // setup drawing dimension limits
    draw_area = document.getElementsByClassName("draw_area")[0];
    width = draw_area.clientWidth;
    height = draw_area.clientHeight;

    // setup svg
    svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "grey");

    // set up resolution
    initializeRangeOptions("resolution", config["resolution"]);
    changeResolution(resolution);

    // setup rows and cols using res
    rows = Math.floor(height/resolution);
    cols = Math.floor(width/resolution);

    // setup scale
    initializeRangeOptions("scale", config["scale"]);
    changeScale(scale);

    // setup speed
    initializeRangeOptions("speed", config["speed"]);
    changeSpeed(SPEED_VALUE);

    // setup multiverse
    initializeSelectOptions("universe", multiverse);
    changeUniverse(universe);

    // setup reset modes and patterns
    initializeSelectOptions("reset", patterns);
    reset(mode);

    // setup secret functionality
    window.onkeydown = handleKeyPress;
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
    newg = [];
    for(i=0; i<rows; i++){
        var temp = [];
        for(j=0; j<cols; j++){
            temp.push(grid[(i+y+rows)%rows][(j+x+cols)%cols]);
        }
        newg.push(temp);
    }
    grid = newg;
}

// control data binders
function changeResolution(value = null){
    resolution = parseInt(validateUpdateAndGet("resolution",value));
}

function changeUniverse(key = null){
    universe = validateUpdateAndGet("universe",key);
}

function changeSpeed(value = null){
    speed = validateUpdateAndGet("speed",value);
    factor = Math.pow(2,speed);
    if(stop){
        evolve();
        evolve();
    }
}

function changeMode(key = null){
    mode = validateUpdateAndGet("reset",key);
    document.getElementById("scale").style.visibility = patterns[mode]["scale"]?"visible":"hidden";
}

function changeScale(value = null){
    scale = validateUpdateAndGet("scale",value);
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

function reset(val = null){
    changeMode(val);
    changeScale();
    pattern = patterns[mode];
    changeUniverse(pattern.universe);
    changeSpeed(pattern.speed);
    newg = [];
    r = rows;
    c = cols;
    res = patternRes(pattern);
    if(res && res<resolution){
        resolution = res;
        r = Math.floor(height/res);
        c = Math.floor(width/res);
    }
    for(i=0; i<r; i++){
        var temp = [];
        for(j=0; j<c; j++){
            temp.push(pattern.call && pattern.call(i,j,scale) ? 1 : 0);
        }
        newg.push(temp);
    }
    grid = newg;
    for (var i = 0; res&&i < pattern.x.length; i++) {
        grid[pattern.y[i]][pattern.x[i]] = 1;
    }
    newg = null;
    if(pattern.grid)    newg = pattern.grid(resolution,height,width);
    if(newg && newg.length>=3 && newg[0].length>=3){
        grid = newg;
        r = grid.length;
        c = grid[0].length;
    }
    handleChange(resolution, r, c);
}

// helper methods
function patternRes(pattern){
    res = 0;
    if(
        pattern &&
        pattern.x &&
        pattern.y &&
        pattern.x.length == pattern.y.length &&
        pattern.x.length
    ){
        res = Math.floor(Math.min(width/(Math.max(...pattern.x)+2),height/(Math.max(...pattern.y)+2)));
    }
    if(res>=config.resolution.min)  return res;
    return null;
}

function validate(id, value){
    if(!config[id] || value==null) return false;
    if(config[id].type=="range")    return value>=config[id].min && value<=config[id].max;
    if(config[id].type=="select")   return !!config[id].keys[value];
    return false;
}

function validateUpdateAndGet(id, value){
    if(validate(id, value)){
        document.getElementById(id).value = value;
    }
    return document.getElementById(id).value;
}

function initializeSelectOptions(selectId, optionsMap){
    select_element = document.getElementById(selectId);
    for(key in optionsMap){
        option = document.createElement("option");
        option.value = key;
        option.innerText = optionsMap[key]["name"];
        select_element.add(option);
    }
}

function initializeRangeOptions(selectId, conf){
    document.getElementById(selectId).min = conf.min;
    document.getElementById(selectId).max = conf.max;
    document.getElementById(selectId).step = conf.step;
}

// initial callbacks
init();
