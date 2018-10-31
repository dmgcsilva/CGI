var gl, mView, mProjection, mModel, locV, locP, loc, program;
var mModel = mat4();
window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
	cubeInit(gl);
	sphereInit(gl);
    
    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
	
	sphereDrawWireFrame(gl, program);
	
	var at = [0, 0, 0];
    var eye = [1, 1, 1];
    var up = [0, 1, 0];
    mView = lookAt(eye, at, up);
    mProjection = ortho(-2,2,-2,2,10,-10);
	
	locV = gl.getUniformLocation(program, "mView");
	locP = gl.getUniformLocation(program, "mProjection");
	loc = gl.getUniformLocation(program, "mModel");
	
	render();
}

function render() {
	
	sphereDrawWireFrame(gl, program);
	
	gl.uniformMatrix4fv(locV, false, flatten(mView));
	gl.uniformMatrix4fv(locP, false, flatten(mProjection));
	gl.uniformMatrix4fv(loc, false, flatten(mModel));
	
	requestAnimFrame(render);
}