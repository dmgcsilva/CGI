var canvas;
var gl;
var program;

var aspect;
var rot = 0;
var height = 0.5;
var obj = "cube", objPicker;
var vis = "filled", visPicker;
var map = "ortogonal", mapPicker;
var mProjectionLoc, mModelViewLoc, colorFlagLoc, mapFlagLoc;

var matrixStack = [];
var modelView;

    /*
    This project was made by Diogo Silva 50548 and João Silva 50651
    For the CGI teachers team of DI FCT NOVA
    */

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
    canvas.height = window.innerHeight - 25;

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
    gl.clearColor(0.15, 0.15, 0.15, 1.0);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, 'default-vertex', 'default-fragment');

    gl.useProgram(program);

    mModelViewLoc = gl.getUniformLocation(program, "mModelView");
    mProjectionLoc = gl.getUniformLocation(program, "mProjection");
    colorFlagLoc = gl.getUniformLocation(program, "uColorFlag");
	mapFlagLoc = gl.getUniformLocation(program, "mapFlag");


    cubeInit(gl);
    cylinderInit(gl);
    sphereInit(gl);

    setupTexture();
    setupCallbacks();

    render();
}

function setupCallbacks() {
    objPicker = document.getElementById("objPicker");
    objPicker.onchange = function() {
        obj = objPicker.value;
    }

	visPicker = document.getElementById("visPicker");
    visPicker.onchange = function() {
        vis = visPicker.value;
    }

	mapPicker = document.getElementById("mapPicker");
    mapPicker.onchange = function() {
        map = mapPicker.value;
    }

    window.addEventListener("keypress", function(e) {
      switch(e.key) {
        case 'a': //rotate left
          rot += 1;
          break;
        case 'w': //lift pedestal
            if(height < 1.0)
                height += 0.05;
          break;
        case 'd': //rotate right
          rot -= 1;
          break;
        case 's': //lower pedestal
            if(height > 0.0)
                height -= 0.05;
          break;
        default:
          break;
      }
    });

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
	switch (vis) {
                case "filled":
                    cylinderDrawFilled(gl, program);
                    break;
                case "frame":
                    cylinderDrawWireFrame(gl, program);
                    break;
                default:
                }
}

function cuboLargo() {
	multScale([0.3,1,0.3]);
	gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
	switch (vis) {
                case "filled":
                    cubeDrawFilled(gl, program);
                    break;
                case "frame":
                    cubeDrawWireFrame(gl, program);
                    break;
                default:
            }
}

function cuboFino() {
    multScale([0.2,1,0.2]);
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
    switch (vis) {
                case "filled":
                    cubeDrawFilled(gl, program);
                    break;
                case "frame":
                    cubeDrawWireFrame(gl, program);
                    break;
                default:
            }
}

function cuboTopo() {
    multScale([1.1,0.2,1.1]);
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
    switch (vis) {
                case "filled":
                    cubeDrawFilled(gl, program);
                    break;
                case "frame":
                    cubeDrawWireFrame(gl, program);
                    break;
                default:
            }
}

function drawObj() {
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
    gl.uniform1f(colorFlagLoc, 1.0);

	switch (map) {
        case "ortogonal":
			gl.uniform1f(mapFlagLoc, 0.0);
            break;
        case "cilindrico":
            gl.uniform1f(mapFlagLoc, 1.5);
            break;
		case "esferico":
			gl.uniform1f(mapFlagLoc, 3.0);
			break;
		default:
    }

    switch (obj) {
        case "cube":
		switch (vis) {
                case "filled":
                    cubeDrawFilled(gl, program);
                    break;
                case "frame":
                    cubeDrawWireFrame(gl, program);
                    break;
                default:
            }
            break;
        case "cylinder":
            switch (vis) {
                case "filled":
                    cylinderDrawFilled(gl, program);
                    break;
                case "frame":
                    cylinderDrawWireFrame(gl, program);
                    break;
                default:
                }
            break;
        case "sphere":
            switch (vis) {
                case "filled":
                    sphereDrawFilled(gl, program);
                    break;
                case "frame":
                    sphereDrawWireFrame(gl, program);
                    break;
                default:
                }
            break;
        default:
    }

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}


function render()
{
    requestAnimationFrame(render);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	modelView = lookAt([3,4,2], [0,2,0], [0,1,0]);

	var mProjection = ortho(-3*aspect,3*aspect,-3,3,-10,10);

    gl.uniformMatrix4fv(mProjectionLoc, false, flatten(mProjection));

	gl.uniform1f(colorFlagLoc, 0.0);

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
