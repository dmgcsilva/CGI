var gl, canvas, mView, mProjection, mModel, ctm, locV, locP, locM, loc, program;
var mModel = mat4();

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
	cubeInit(gl);
	sphereInit(gl);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
	
	sphereDrawWireFrame(gl, program);
	
	var at = [0, 0, 0];
    var eye = [0, 0, 0];
    var up = [0, 1, 0];
    
	mView = lookAt(eye, at, up);
	mProjection = ortho(-1,1,-1,1,10,-10);
	
	render();
}

function draw(x,y) {
	locV = gl.getUniformLocation(program, "mView");
	locP = gl.getUniformLocation(program, "mProjection");
	locM = gl.getUniformLocation(program, "mModel");
	gl.uniformMatrix4fv(locV, false, flatten(mView));
	gl.uniformMatrix4fv(locP, false, flatten(mProjection));
	gl.uniformMatrix4fv(locM, false, flatten(mModel));
}

function render() {
	gl.viewport(0,0,canvas.width/2, canvas.height/2);
	sphereDrawWireFrame(gl, program);
	draw();
	
	gl.viewport(canvas.width/2,0,canvas.width/2, canvas.height/2);
	sphereDrawWireFrame(gl, program);
	draw();
	
	gl.viewport(0,canvas.height/2,canvas.width/2, canvas.height/2);
	sphereDrawWireFrame(gl, program);
	draw();
	
	gl.viewport(canvas.width/2, canvas.height/2,canvas.width/2, canvas.height/2);
	sphereDrawWireFrame(gl, program);
	draw();
	
	requestAnimFrame(render);
}