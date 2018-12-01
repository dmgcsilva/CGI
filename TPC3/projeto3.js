var canvas;
var gl;
var program;

var aspect;
var rot = 0, rotSlider;
var height = 1, heightSlider;
var t1 = 1, t2, t3, t4;

var mProjectionLoc, mModelViewLoc;

var matrixStack = [];
var modelView;

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
    fit_canvas_to_window();

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, 'default-vertex', 'default-fragment');

    gl.useProgram(program);

    mModelViewLoc = gl.getUniformLocation(program, "mModelView");
    mProjectionLoc = gl.getUniformLocation(program, "mProjection");

    cylinderInit(gl);
	cubeInit(gl);
    sphereInit(gl);

    setupCallbacks();

    render();
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
}

function cil() {
	multScale([1,0.2,1]);
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
    multScale([1,0.2,1]);
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
    cubeDrawFilled(gl, program);
}

function drawObj() {

}


function render()
{
    requestAnimationFrame(render);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	modelView = lookAt([3,1,2], [0,0,0], [0,1,0]);

	var mProjection = ortho(-3,3,-1,3,-10,10);

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
	multTranslation(t4);
	pushMatrix();
		drawObj();
	popMatrix();
}
