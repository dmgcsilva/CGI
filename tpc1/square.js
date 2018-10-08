var gl, dragLoc, slideLoc, dropDownLoc, scaleLoc;
var canvas, lastX, lastY, dragging, slide, dropDown;
var drag = vec3(0.0,0.0,0.0), scale = 1, zoom = 0;

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
    
    dragLoc = gl.getUniformLocation(program, "drag");
    gl.uniform3fv(dragLoc, drag);
    scaleLoc = gl.getUniformLocation(program, "scale");
    gl.uniform1f(scaleLoc, scale);
    
    document.body.appendChild(document.createElement("p"));
    createSlide();
    
    slideLoc = gl.getUniformLocation(program, "n");
    gl.uniform1i(slideLoc, slide.value);
    
    createDropDown();
    
    dropDownLoc = gl.getUniformLocation(program, "func");
    gl.uniform1i(dropDownLoc, dropDown.value);
    
    setupCallBacks();
    render();
}
function createDropDown() {
    dropDown = document.createElement("select");
    dropDown.id = "dropDownID";
    dropDown.options.add( new Option("Função nº1",1));
    dropDown.options.add( new Option("Função nº2",2));
    dropDown.options.add( new Option("Função nº3",3));
    dropDown.options.add( new Option("Função nº4",4));
    dropDown.options.add( new Option("Função nº5",5));
    dropDown.options.add( new Option("Função nº6",6));
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

function setupCallBacks() {
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
        
            var dx = -1*(newX - lastX),
                dy = -1*-1*(newY - lastY);
            var model_dx = 2*(dx/canvas.width),
                model_dy = 2*(dy/canvas.height);
        
            drag[0] += model_dx;
            drag[1] += model_dy;
        
            lastX = newX;
            lastY = newY;
            console.log(drag[0]);
    }
});
    canvas.addEventListener("mousewheel", function(e) {
        console.log("Delta " + e.wheelDelta);
        var res;
        zoom += e.wheelDelta;
        scale = Math.max((canvas.width - zoom)/canvas.width, 0.1);//funciona assumindo que o canvas e quadrado
        scale = Math.min(scale, 200.0);
        if(scale == 200.0 || scale == 0.1) {
            zoom -= e.wheelDelta;
        }
        console.log("zoom: " + zoom);
        console.log("scale: " + scale);
    })
}


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    gl.uniform3fv(dragLoc, drag);
    gl.uniform1i(slideLoc, slide.value);
    gl.uniform1i(dropDownLoc, dropDown.value);
    gl.uniform1f(scaleLoc, scale);
    
    requestAnimFrame(render);
}
