const SQUARE = "Square", SPHERE = "Sphere", CYLINDER = "Cylinder";
const OBLIQUE = "Oblique", AXONOMETRIC = "Axonometric", PRESPECTIVE = "Prespective";
const FILLED = "Filled", WIRE = "Wire";

var gl, canvas, mProjection, mModelView = mat4(), ctm, locP, locM, loc, program;
var mModel = mat4(), mView = mat4();
var multipleView = false, alpha = 30, beta = 30;
var button1View, button4Views, object, filling, aSlide, bSlide;
<<<<<<< HEAD
var proj,text,a,l,fov;
=======
var proj;
>>>>>>> 94d348461bdd86f7eb008ef2e2715740420391a4

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

	locP = gl.getUniformLocation(program, "mProjection");
	locM = gl.getUniformLocation(program, "mModelView");

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

	proj = projectionDropDown();
    object = objectDropDown();
    filling = fillingDropDown();

    document.body.appendChild(document.createElement("p"));
<<<<<<< HEAD
	text = document.createTextNode("Axonometric	");
    document.body.appendChild(text);
=======

>>>>>>> 94d348461bdd86f7eb008ef2e2715740420391a4
    document.body.appendChild(document.createTextNode("Alpha: "));
    aSlide = createSlide("alphaSlide", 1, 89, 36.5, 0.5);
    alpha = aSlide.value;
    document.body.appendChild(document.createTextNode("Beta: "));
    bSlide = createSlide("betaSlide", 1, 89, 36.5, 0.5);
    beta = bSlide.value;
<<<<<<< HEAD
	
	document.body.appendChild(document.createElement("p"));
	text = document.createTextNode("Oblique	");
    document.body.appendChild(text);
    document.body.appendChild(document.createTextNode("Alpha: "));
    alpSlide = createSlide("alpSlide", 1, 89, 45, 0.5);
    a = radians(alpSlide.value);
    document.body.appendChild(document.createTextNode("l: "));
    lSlide = createSlide("lSlide", 0.1, 1, 0.5, 0.05);
    l = lSlide.value;
	
	document.body.appendChild(document.createElement("p"));
	text = document.createTextNode("Perspective ");
    document.body.appendChild(text);
    document.body.appendChild(document.createTextNode("Fov: "));
    fovSlide = createSlide("fovSlide", 1, 180, 90, 1);
    fov = fovSlide.value;
	
=======
>>>>>>> 94d348461bdd86f7eb008ef2e2715740420391a4
    setupCallbacks();
	render();
}

function setupCallbacks() {
    aSlide.onchange = function() {
        alpha = aSlide.value;
        console.log("alpha: " + alpha);
    };
    bSlide.onchange = function() {
        beta = bSlide.value;
        console.log("Beta: " + beta);
    };
<<<<<<< HEAD
	alpSlide.onchange = function() {
        a = radians(alpSlide.value);
        console.log("alpha: " + alpSlide.value);
    };
    lSlide.onchange = function() {
        l = lSlide.value;
        console.log("l: " + l);
    };
	fovSlide.onchange = function() {
        fov = fovSlide.value;
        console.log("fov: " + fov);
    };
=======
>>>>>>> 94d348461bdd86f7eb008ef2e2715740420391a4
}
function projectionDropDown() {
    dropDown = document.createElement("select");
    dropDown.id = "projSelect";
	dropDown.options.add( new Option("Oblique",OBLIQUE));
	dropDown.options.add( new Option("Axionometric",AXONOMETRIC));
	dropDown.options.add( new Option("Perspective",PRESPECTIVE));
	document.body.appendChild(dropDown);
	return dropDown;
}

function objectDropDown() {
    dropDown = document.createElement("select");
    dropDown.id = "objectSelect";
<<<<<<< HEAD
	dropDown.options.add( new Option("Square",SQUARE));
	dropDown.options.add( new Option("Sphere",SPHERE));
=======
	dropDown.options.add( new Option("Sphere",SPHERE));
	dropDown.options.add( new Option("Square",SQUARE));
>>>>>>> 94d348461bdd86f7eb008ef2e2715740420391a4
	dropDown.options.add( new Option("Cylinder",CYLINDER));
	document.body.appendChild(dropDown);
	return dropDown;
}

function fillingDropDown() {
    dropDown = document.createElement("select");
    dropDown.id = "fillingSelect";
	dropDown.options.add( new Option("Filled",FILLED));
	dropDown.options.add( new Option("Wire Frame",WIRE));
	document.body.appendChild(dropDown);
	return dropDown;
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
    mModelView = mult(mView,mModel);
	gl.uniformMatrix4fv(locP, false, flatten(mProjection));
	gl.uniformMatrix4fv(locM, false, flatten(mModelView));

    switch (object.value) {
        case SQUARE:
            switch (filling.value) {
                case FILLED:
                    cubeDrawFilled(gl, program);
                    break;
                case WIRE:
                    cubeDrawWireFrame(gl, program);
                    break;
                default:
                    alert("Filling undifined");
            }
            break;
        case SPHERE:
            switch (filling.value) {
                case FILLED:
                    sphereDrawFilled(gl, program);
                    break;
                case WIRE:
                    sphereDrawWireFrame(gl, program);
                    break;
                default:
                    alert("Filling undifined");
                }
            break;
        case CYLINDER:
            switch (filling.value) {
                case FILLED:
                    cylinderDrawFilled(gl, program);
                    break;
                case WIRE:
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

function seeFront() {
	var at = [0, 0, 0];
    var eye = [0, 0, 0];
    var up = [0, 1, 0];

	mView = lookAt(eye, at, up);
	mProjection = ortho(-1,1,-1,1,10,-10);

    draw();
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

function axonometricProjection() {
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

    var max = Math.max(r1, r2, r3);
    r1 = r1/max;
    r2 = r2/max;
    r1 = r3/max;

    mModel = mult(scalem(r2,r1,r3),mModel);
    draw();

    mModel = mat4();
}

function obliqueProjection() {
	var at = [0,0,0];
	var eye = [1,1,1];
	var up = [0,1,0];
<<<<<<< HEAD
	
	
	var rx = -Math.cos(a); //faz sentido por aqui o l???
	var ry = -Math.sin(a);
=======

	var a = 45;
	var l = 1;
	var rx = -l*Math.cos(a);
	var ry = -l*Math.sin(a);
>>>>>>> 94d348461bdd86f7eb008ef2e2715740420391a4

	mView = lookAt(eye, at, up);
	mProjection = ortho(-1,1,-1,1,10,-10);

<<<<<<< HEAD
	mModel = scalem(rx,ry,l);

	draw();
	
	mModel = mat4();
=======
	//mModel = mult(scalem(rx,ry,1),mModel);

	draw();
>>>>>>> 94d348461bdd86f7eb008ef2e2715740420391a4
}


function perspectiveProjection() {
	var at = [0, 0, 0];
    var eye = [1, 1, 1];
    var up = [0, 1, 0];
<<<<<<< HEAD
	
	var aspect = 1;

	mView = lookAt(eye, at, up);
	mProjection = perspective(fov,aspect,0,3);
=======

	var fov = 90;
	var aspect = 1;

	mView = lookAt(eye, at, up);
	mProjection = perspective(fov,aspect,0,1);
>>>>>>> 94d348461bdd86f7eb008ef2e2715740420391a4

	draw();
}

function selectForthProj() {
    switch (proj.value) {
        case OBLIQUE:
            obliqueProjection();
            break;
        case AXONOMETRIC:
            axonometricProjection();
            break;
        case PRESPECTIVE:
            perspectiveProjection();
            break;
        default:
            obliqueProjection();
    }
}


function render() {
    //gl.depthFunc(gl.LESS);
    gl.enable(gl.CULL_FACE)
    if(multipleView) {
        //Quadrante superior esquerdo
    	gl.viewport(0,canvas.height/2,canvas.width/2, canvas.height/2);
        seeFront();


        //Quadrante superior direito
        gl.viewport(canvas.width/2, canvas.height/2,canvas.width/2, canvas.height/2);
        seeLeftSide();

        //Quadrante inferior esquerdo
        gl.viewport(0,0,canvas.width/2, canvas.height/2);
        seeAboveSide();


        //Quadrante inferior direito
        gl.viewport(canvas.width/2,0,canvas.width/2, canvas.height/2);
        selectForthProj();
    } else {
        gl.viewport(0,0,canvas.width, canvas.height);
        selectForthProj();
    }

	requestAnimFrame(render);
}