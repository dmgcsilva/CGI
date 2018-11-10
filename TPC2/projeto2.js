var gl, canvas, mView, mProjection, mModel, ctm, locV, locP, locM, loc, program;
var mModel = mat4();
var multipleView = true, alpha = 30, beta = 30;
var button1View, button4Views, object = "Cilindro", filling = "Filled";

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }

	cubeInit(gl);
	sphereInit(gl);
    cylinderInit(gl);

    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    locV = gl.getUniformLocation(program, "mView");
	locP = gl.getUniformLocation(program, "mProjection");
	locM = gl.getUniformLocation(program, "mModel");

	var at = [0, 0, 0];
    var eye = [1, 1, 1];
    var up = [0, 1, 0];

	mView = lookAt(eye, at, up);
	mProjection = ortho(-1,1,-1,1,10,-10);

    document.body.appendChild(document.createElement("p"));
    button1View = createButton("1 Projecao", "b1view", function() {
        multipleView = false;
    });
    button4Views = createButton("4 Projecoes", "b4views", function() {
        multipleView = true;
    });

	render();
}

function createButton(name, id, func) {
  button = document.createElement("INPUT");
  button.setAttribute("type", "button");
  button.id = id;
  button.value = name;
  button.onclick = func;
  document.body.appendChild(button);
  return button;
}

function createSlide(id, min, max, def, step) {
    var slide = document.createElement("INPUT");
    slide.setAttribute("type", "range");
    slide.id = id;
    slide.defaultValue = def;
    slide.step = step;
    slide.max = max;
    slide.min = min;
    document.body.appendChild(slide);
    return slide;
}

function draw() {
    gl.uniformMatrix4fv(locV, false, flatten(mView));
	gl.uniformMatrix4fv(locP, false, flatten(mProjection));
	gl.uniformMatrix4fv(locM, false, flatten(mModel));

    switch (object) {
        case "Quadrado":
            switch (filling) {
                case "Filled":
                    cubeDrawFilled(gl, program);
                    break;
                case "Wire":
                    cubeDrawWireFrame(gl, program);
                    break;
                default:
                    alert("Filling undifined");
            }
            break;
        case "Esfera":
            switch (filling) {
                case "Filled":
                    sphereDrawFilled(gl, program);
                    break;
                case "Wire":
                    sphereDrawWireFrame(gl, program);
                    break;
                default:
                    alert("Filling undifined");
                }
            break;
        case "Cilindro":
            switch (filling) {
                case "Filled":
                    cylinderDrawFilled(gl, program);
                    break;
                case "Wire":
                    cylinderDrawWireFrame(gl, program);
                    break;
                default:
                    alert("Filling undifined");
            }
            break;
        default:
            alert("object undifined");
    }
}

function seeLeftSide() {
    var at = [0, 0, 0];
    var eye = [-1, 0, 0];
    var up = [0, 1, 0];

	mView = lookAt(eye, at, up);
	mProjection = ortho(-1,1,-1,1,10,-10);

    draw();
}

function seeAboveSide() {
    var at = [0, 0, 0];
    var eye = [0, 1, 0];
    var up = [0, 0, 1];

	mView = lookAt(eye, at, up);
	mProjection = ortho(-1,1,-1,1,10,-10);

    draw();
}

function axonemetricProjection() {
    var at = [0, 0, 0];
    var eye = [1, 1, 1];
    var up = [0, 1, 0];

    var alpha2 = alpha * Math.PI/180;
    var beta2 = beta * Math.PI/180;

    var t = Math.atan(Math.sqrt(Math.tan(alpha2)/Math.tan(beta2))) - Math.PI/2,
    y = Math.asin(Math.sqrt(Math.tan(alpha2)*Math.tan(beta2))),
    r1 = Math.cos(y),
    r2 = Math.cos(t)/Math.cos(beta2),
    r3 = -Math.sin(t)/Math.cos(alpha2);
	mView = lookAt(eye, at, up);
	mProjection = ortho(-1,1,-1,1,10,-10);
    var mModel2 = mModel;
    mModel = mult(scalem(r1,r2,r3),mModel);

    draw();

    mModel = mModel2;
}

function render() {
    //gl.depthFunc(gl.LESS);
    gl.enable(gl.CULL_FACE)
    if(multipleView) {
        //Quadrante superior esquerdo
    	gl.viewport(0,canvas.height/2,canvas.width/2, canvas.height/2);
        draw();


        //Quadrante superior direito
        gl.viewport(canvas.width/2, canvas.height/2,canvas.width/2, canvas.height/2);
        seeLeftSide();

        //Quadrante inferior esquerdo
        gl.viewport(0,0,canvas.width/2, canvas.height/2);
        seeAboveSide();


        //Quadrante inferior direito
        gl.viewport(canvas.width/2,0,canvas.width/2, canvas.height/2);
        axonemetricProjection();
    } else {
        gl.viewport(0,0,canvas.width, canvas.height);
        axonemetricProjection();
    }

	requestAnimFrame(render);
}
