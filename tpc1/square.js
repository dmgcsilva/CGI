var gl, dragLoc, slideLoc, dropDownLoc, scaleLoc, propLoc, time_loc;
var canvas, lastX, lastY, dragging, slide, dropDown, aniButton, resetButton, reScaleButton;
var drag = vec3(0.0,0.0,0.0), scale = 1;
var timex = Math.PI/2.0, timey = 0.0, timeInc = 0.0;
var prop = vec2(1.0,1.0);

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }

    // Three vertices
    var vertices = [
        vec2(-1,1),
        vec2(-1,-1),
        vec2(1,1),
        vec2(1,-1)
    ];

    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    //Load uniforms to the shadder
    dragLoc = gl.getUniformLocation(program, "drag");
    gl.uniform3fv(dragLoc, drag);
    scaleLoc = gl.getUniformLocation(program, "scale");
    gl.uniform1f(scaleLoc, scale);
    time_loc = gl.getUniformLocation(program, "time");

    // Create paragraph and slide to adjust the iterations desired
    document.body.appendChild(document.createElement("p"));
    createSlide();

    slideLoc = gl.getUniformLocation(program, "n");
    gl.uniform1i(slideLoc, slide.value);

    createDropDown();

    dropDownLoc = gl.getUniformLocation(program, "func");
    gl.uniform1i(dropDownLoc, dropDown.value);

    propLoc = gl.getUniformLocation(program, "prop");
    gl.uniform2fv(propLoc, prop);

    //Create animation related buttons
    createAnimationButton();
    createResetButton();
    //Create the zoom text and two paragraphs
    document.body.appendChild(document.createElement("p"));
    var text = document.createTextNode("Use Q to zoom in and E to zoom out. Have fun and check if your caps lock is off.");
    document.body.appendChild(text);
    document.body.appendChild(document.createElement("p"));

    //create rescale and recenter button
    createReScaleButton();
    // setup callbacks
    setupCallBacks();
    render();
}
function createDropDown() {
    dropDown = document.createElement("select");
    dropDown.id = "dropDownID";
    dropDown.options.add( new Option("Funcao n1",1));
    dropDown.options.add( new Option("Funcao n2",2));
    dropDown.options.add( new Option("Funcao n3",3));
    dropDown.options.add( new Option("Funcao n4",4));
    dropDown.options.add( new Option("Função n5",5));
    dropDown.options.add( new Option("Função n6",6));
    document.body.appendChild(dropDown);
}
function createSlide() {
    slide = document.createElement("INPUT");
    slide.setAttribute("type", "range");
    slide.id = "slide_id";
    slide.defaultValue = 1;
    slide.step = 1;
    slide.max = 10;
    slide.min = 1;
    document.body.appendChild(slide);
}

function createAnimationButton() {
  aniButton = document.createElement("INPUT");
  aniButton.setAttribute("type", "button");
  aniButton.id = "aniButton";
  aniButton.value = "Animation";
  document.body.appendChild(aniButton);
}

function createResetButton() {
  resetButton = document.createElement("INPUT");
  resetButton.setAttribute("type", "button");
  resetButton.id = "reset";
  resetButton.value = "Reset Animation";
  resetButton.onclick = function() {
    timex = Math.PI/2.0;
    timey = 0.0;
    timeInc = 0.0;
  }
  document.body.appendChild(resetButton);
}

function createReScaleButton() {
  reScaleButton = document.createElement("INPUT");
  reScaleButton.setAttribute("type", "button");
  reScaleButton.id = "reScaleButton";
  reScaleButton.value = "Rescale Canvas";
  reScaleButton.onclick = function() {
    scale = 1.0;
    drag = vec3(0.0,0.0,0.0);
  };
  document.body.appendChild(reScaleButton);
}

function setupCallBacks() {
    window.onresize = function() {
        var height = window.innerHeight;
        var width = window.innerWidth;
        canvas.width = width;
        canvas.height = height;
        console.log("h: " + height + " w: " + width);
        var x = 1.0;
        var y = 1.0;
        if(height > width)
          x = height/width;
        else if (width > height)
          y = width/height;

        prop = vec2(x,y);
        console.log("x: " + prop.x + " y: " + prop.y);
        gl.viewport(0,0,width,height);
};
    canvas.addEventListener("mousedown", function(e) {
        console.log("mousedown");

        dragging  = true;
        lastX = e.clientX;
        lastY = e.clientY;
});

    canvas.addEventListener("mouseup", function() {
        console.log("mouseup");
        dragging = false;
});

    canvas.addEventListener("mousemove", function(e) {
        console.log("mousemove");
        if (dragging) {
            var newX = e.clientX,
            newY = e.clientY;

            var dx = -1*scale*(newX - lastX),
                dy = scale*(newY - lastY);
            var model_dx = 2*(dx/canvas.width),
                model_dy = 2*(dy/canvas.height);

            drag[0] += model_dx;
            drag[1] += model_dy;

            lastX = newX;
            lastY = newY;
            console.log("drag X: " + drag[0]);
            console.log("drag Y: " + drag[1]);
    }
});
    window.addEventListener("keypress", function(e) {
      //console.log("key pressed");
      switch(e.key) {
        case 'q':
          console.log("Q");
          scale -= 1/500 * scale*2.0;
          break;
        case 'e':
          console.log("E");
          scale += 1/500 * scale*2.0;
          break;
        default:
          console.log("default");
          break;
      }
    });

    aniButton.onclick = function() {
      if (timeInc == 0.0)
        timeInc = 0.01;
      else
        timeInc = 0.0;
    }
}


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.uniform2f(time_loc, timex, timey);
    timex += timeInc;
    timey += timeInc;

    gl.uniform3fv(dragLoc, drag);
    gl.uniform1i(slideLoc, slide.value);
    gl.uniform1i(dropDownLoc, dropDown.value);
    gl.uniform1f(scaleLoc, scale);
    gl.uniform2fv(propLoc, prop);

    requestAnimFrame(render);
}
