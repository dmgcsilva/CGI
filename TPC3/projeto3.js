var canvas;
var gl;
var program;

var aspect;
var rot = 0, rotSlider;
var height = 1, heightSlider;
var obj, objPicker;
var t1 = 1, t2, t3, t4;

var mProjectionLoc, mModelViewLoc, vTexCoordsLoc;

var matrixStack = [];
var modelView;
var texCoords_buffer = [];

// Stack related operations
function pushMatrix() {
    var m =  mat4(modelView[0], modelView[1],
           modelView[2], modelView[3]);
    matrixStack.push(m);
}
function popMatrix() {
    modelView = matrixStack.pop();
}
// Append transformations to modelView
function multMatrix(m) {
    modelView = mult(modelView, m);
}
function multTranslation(t) {
    modelView = mult(modelView, translate(t));
}
function multScale(s) {
    modelView = mult(modelView, scalem(s));
}
function multRotationX(angle) {
    modelView = mult(modelView, rotateX(angle));
}
function multRotationY(angle) {
    modelView = mult(modelView, rotateY(angle));
}
function multRotationZ(angle) {
    modelView = mult(modelView, rotateZ(angle));
}

function fit_canvas_to_window()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    aspect = canvas.width / canvas.height;
    gl.viewport(0, 0,canvas.width, canvas.height);

}



window.onresize = function () {
    fit_canvas_to_window();
}

window.onload = function() {
    canvas = document.getElementById('gl-canvas');

    gl = WebGLUtils.setupWebGL(document.getElementById('gl-canvas'));
    //fit_canvas_to_window();
    gl.viewport(0, 0,canvas.width, canvas.height);
    aspect = 1;
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, 'default-vertex', 'default-fragment');

    gl.useProgram(program);

    mModelViewLoc = gl.getUniformLocation(program, "mModelView");
    mProjectionLoc = gl.getUniformLocation(program, "mProjection");
    vTexCoordsLoc = gl.getAttribLocation(program, "vTexCoord");


    texCoords_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoords_buffer);
    gl.enableVertexAttribArray(vTexCoordsLoc);
    gl.vertexAttribPointer(vTexCoordsLoc, 2, gl.FLOAT, false, 0, 0);
    setupTextCoords();


	cubeInit(gl);
    cylinderInit(gl);
    sphereInit(gl);

    setupTexture();
    setupCallbacks();

    render();
}

function setupTextCoords() {
    var texCoords_buffer = new Float32Array([
        // front
        0, 0,
        1, 0,
        1, 1,
        0, 1,
        // right side
        1, 0,
        2, 0,
        2, 1,
        1, 1,
        // back
        0, 0,
        0, 1,
        1, 1,
        1, 0,
        // left side
        0, 0,
        0, 1,
        0, 1,
        0, 0,
        // top
        0, 1,
        1, 1,
        1, 2,
        0, 2,
        // bottom
        0, 0,
        0, -1,
        1, -1,
        1, 0

    ]);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords_buffer), gl.STATIC_DRAW);
}

function setupCallbacks() {
    rotSlider = document.getElementById("rotationSlider");
    rotSlider.onchange = function() {
        rot = rotSlider.value;
    }
    heightSlider = document.getElementById("heightSlider");
    heightSlider.onchange = function() {
        height = heightSlider.value;
    }
    objPicker = document.getElementById("objPicker");
    objPicker.onchange = function() {
        obj = objPicker.value;
    }

}

function setupTexture() {
    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([0, 0, 255, 255]));

    // Asynchronously load an image
    var image = new Image();
    image.src = "UV_Grid_Sm.jpg";
    image.addEventListener('load', function() {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    });
}

function cil() {
	multScale([1.1,0.2,1.1]);
	gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
	cylinderDrawFilled(gl, program);
}

function cuboLargo() {
	multScale([0.3,1,0.3]);
	gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
	cubeDrawFilled(gl, program);
}

function cuboFino() {
    multScale([0.2,1,0.2]);
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
    cubeDrawFilled(gl, program);
}

function cuboTopo() {
    multScale([1.1,0.2,1.1]);
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
    cubeDrawFilled(gl, program);
}

function drawObj() {
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
    switch (obj) {
        case "cube":
            cubeDrawFilled(gl,program);
            break;
        case "cylinder":
            cylinderDrawFilled(gl,program);
            break;
        case "sphere":
            sphereDrawFilled(gl,program);
            break;
        default:
            cubeDrawFilled(gl,program);
    }
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    gl.enableVertexAttribArray(vTexCoordsLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoords_buffer);
    gl.vertexAttribPointer(vTexCoordsLoc, 2, gl.FLOAT, false, 0, 0);
}


function render()
{
    requestAnimationFrame(render);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	modelView = lookAt([3,4,2], [0,2,0], [0,1,0]);

	var mProjection = ortho(-2*aspect,2*aspect,-2,2,-10,10);

    gl.uniformMatrix4fv(mProjectionLoc, false, flatten(mProjection));



	multRotationY(rot);
	pushMatrix();
		cil();
	popMatrix();
	multTranslation([0,0.6,0]);
	pushMatrix();
		cuboLargo();
	popMatrix();
	multTranslation([0,height,0]);
	pushMatrix();
		cuboFino();
	popMatrix();
	multTranslation([0,0.6,0]);
	pushMatrix();
		cuboTopo();
	popMatrix();
	multTranslation([0,0.6,0]);
	pushMatrix();
		drawObj();
	popMatrix();
}
