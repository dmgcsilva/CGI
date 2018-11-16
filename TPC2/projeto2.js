const SQUARE = "Square", SPHERE = "Sphere", CYLINDER = "Cylinder", BUNNY = "Bunny";
const OBLIQUE = "Oblique", AXONOMETRIC = "Axonometric", PRESPECTIVE = "Prespective";
const FILLED = "Filled", WIRE = "Wire";

var gl, canvas, mProjection, mModelView = mat4(), ctm, locP, locM, loc, program;
var mModel = mat4(), mView = mat4();
var multipleView = false;
var button1View, button4Views, object, filling, gammaSlide, thetaSlide;
var proj,text,a,l,fov, theta, gamma;
var resizeX, resizeY, scale, zoomSlide;
var x,y;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }

	cubeInit(gl);
	sphereInit(gl);
    cylinderInit(gl);
    bunnyInit(gl);

    calcResize();
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

    document.body.appendChild(document.createTextNode("Zoom: "));
    zoomSlide = createSlide("zoomSlide", 0.05, 15, 1, 0.05);
    scale = zoomSlide.value;

	document.body.appendChild(document.createTextNode(" Fov: "));
    fovSlide = createSlide("fovSlide", 1, 100, 30, 1);
    fov = fovSlide.value;

    document.body.appendChild(document.createElement("p"));
	text = document.createTextNode("Axonometric	");
    document.body.appendChild(text);
    document.body.appendChild(document.createTextNode("Gamma: "));
    gammaSlide = createSlide("gammaSlide", 1, 89, 50, 0.5);
    gamma = gammaSlide.value;
    document.body.appendChild(document.createTextNode("Theta: "));
    thetaSlide = createSlide("thetaSlide", 1, 89, 50, 0.5);
    theta = thetaSlide.value;

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
	text = document.createTextNode(" X ");
    document.body.appendChild(text);
	xSlide = createSlide("xSlide", -5, 5, 0, 0.5);
    x = xSlide.value;
	text = document.createTextNode(" Y ");
	document.body.appendChild(text);
    ySlide = createSlide("ySlide", -5, 5, 0, 0.5);
    y = ySlide.value;

    setupCallbacks();
	render();
}
function calcResize() {
    width = window.innerWidth;
    heigth = window.innerHeight - 200;
    canvas.width = width;
    canvas.height = heigth;

    var min = Math.min(heigth,width);
    resizeY = heigth/min;
    resizeX = width/min;
}

function setupCallbacks() {
    gammaSlide.onchange = function() {
        gamma = gammaSlide.value;
        console.log("gamma: " + gamma);
    };
    thetaSlide.onchange = function() {
        theta = thetaSlide.value;
        console.log("theta: " + theta);
    };
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
	zoomSlide.onchange = function() {
        scale = zoomSlide.value;
        console.log("zoom: " + scale);
    };
    window.onresize = function() {
        calcResize();
    };
	xSlide.onchange = function() {
		x=xSlide.value;
	};
	ySlide.onchange = function() {
		y=ySlide.value;
	};
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
	dropDown.options.add( new Option("Sphere",SPHERE));
	dropDown.options.add( new Option("Square",SQUARE));
	dropDown.options.add( new Option("Cylinder",CYLINDER));
	dropDown.options.add( new Option("Bunny",BUNNY));
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

    mModel = mat4();
    mView = mat4();

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
        case BUNNY:
            switch (filling.value) {
                case FILLED:
                    bunnyDrawFilled(gl, program);
                    break;
                case WIRE:
                    bunnyDrawWireFrame(gl,program);
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
    mProjection = ortho(-1*resizeX/scale,1*resizeX/scale,-1*resizeY/scale,1*resizeY/scale,-1,1);

    draw();
}

function seeLeftSide() {
    var at = [0, 0, 0];
    var eye = [-1, 0, 0];
    var up = [0, 1, 0];

	mView = lookAt(eye, at, up);
	mProjection = ortho(-1*resizeX/scale,1*resizeX/scale,-1*resizeY/scale,1*resizeY/scale,-10,10);

    draw();
}

function seeAboveSide() {
    var at = [0, 0, 0];
    var eye = [0, 1, 0];
    var up = [0, 0, 1];

	mView = lookAt(eye, at, up);
	mProjection = ortho(-1*resizeX/scale,1*resizeX/scale,-1*resizeY/scale,1*resizeY/scale,-10,10);

    draw();
}

function axonometricProjection() {
    var at = [0, 0, 0];
    var eye = [1, 1, 1];
    var up = [0, 1, 0];


	mView = mat4();
    mModel = mult(rotateX(gamma),rotateY(theta));
    mProjection = ortho(-1*resizeX/scale,1*resizeX/scale,-1*resizeY/scale,1*resizeY/scale,-10,10);
    draw();

    mModel = mat4();
}

function obliqueProjection() {
	var rx = -l*Math.cos(a);
	var ry = -l*Math.sin(a);

	mModel = mat4([
	1, 0,  rx, 0,
	0, 1, ry, 0,
	0, 0, 1, 0,
	0, 0, 0, 1]);

	mProjection = ortho(-1*resizeX/scale,1*resizeX/scale,-1*resizeY/scale,1*resizeY/scale,-10,10);

	draw();
    mModel = mat4();
}


function perspectiveProjection() {
	var at = [0, 0, 0];
    var eye = [x, y, 3];
    var up = [0, 1, 0];
	var aspect = canvas.width/canvas.height;

	mView = lookAt(eye, at, up);
	mProjection = perspective(fov*scale,aspect,0.1,10);

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
    gl.enable(gl.DEPTH_TEST);
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
