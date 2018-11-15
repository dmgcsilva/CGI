var bunny_normals = [];
var bunny_edges = [];

var bunny_points_buffer;
var bunny_normals_buffer;
var bunny_faces_buffer;
var bunny_edges_buffer;

function bunnyInit(gl) {
    bunnyUploadData(gl);
    bunnysAddNormals();
}

function bunnyUploadData(gl) {
    bunny_points_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bunny_points_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(bunny_points), gl.STATIC_DRAW);

    bunny_normals_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bunny_normals_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(bunny_normals), gl.STATIC_DRAW);

    bunny_faces_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bunny_faces_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bunny_faces), gl.STATIC_DRAW);
}

function bunnyDrawFilled(gl, program) {
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, bunny_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, bunny_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bunny_faces_buffer);
    gl.drawElements(gl.TRIANGLES, bunny_faces.length, gl.UNSIGNED_SHORT, 0);
}

function bunnysAddNormals() {
    var supported = [];
    var normals = [];
    var n = vec3(0,0,0);
    console.log(bunny_points.length/3);
    bunny_normals.push(n);
    for(var index = 1; index < bunny_points.length/3; index++) {
        console.log("index: " + index);
        supported = getSupportedTriangles(index);
        for(var j = 0; j < supported.length; j += 3) {
            console.log("adding normal of: " +  supported[j] + " " + supported[j+1] + " " + supported[j+2]);
            normals.push(calcNormalOf(supported[j],supported[j+1],supported[j+2]));
        }
        for(var k = 0; k < normals.length; k++) {
            n.x += normals[k].x;
            n.y += normals[k].y;
            n.z += normals[k].z;
        }
        n.x /= k;
        n.y /= k;
        n.z /= k;
        console.log("ind: " + index + " normals: " + normals.length + " sup: " + supported.length);
        bunny_normals.push(normalize(n));
        supported = []; //clear array
        normals = [];
    }
    console.log(bunny_normals.length);
}

function calcNormalOf(a,b,c) {
    a *= 3;
    b *= 3;
    c *= 3;
    var vertexA = vec3(bunny_points[a],bunny_points[a+1],bunny_points[a+2]);
    var vertexB = vec3(bunny_points[b],bunny_points[b+1],bunny_points[b+2]);
    var vertexC = vec3(bunny_points[c],bunny_points[c+1],bunny_points[c+2]);
    var AB = vec3(vertexB.x-vertexA.x, vertexB.y-vertexA.y, vertexB.z-vertexA.z);
    var AC = vec3(vertexC.x-vertexA.x, vertexC.y-vertexA.y, vertexC.z-vertexA.z);

    var normal = AB*AC;
    return normal;
}

function getSupportedTriangles(v) {
    var result = [];
    for(var i= 0; i < bunny_faces.length; i++) {
        var offset = i%3;
        if (bunny_faces[i] == v) {
            result.push(bunny_faces[offset]);
            result.push(bunny_faces[offset+1]);
            result.push(bunny_faces[offset+2]);
        }
    }
    return result;
}
