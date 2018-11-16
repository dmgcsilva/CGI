var bunny_normals = [];
var bunny_edges = [];

var bunny_points_buffer;
var bunny_normals_buffer;
var bunny_faces_buffer;
var bunny_edges_buffer;

function bunnyInit(gl) {
    bunnysAddNormals();
    addEdges();
    bunnyUploadData(gl);
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

    bunny_edges_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bunny_edges_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bunny_edges), gl.STATIC_DRAW);
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
    var n = vec3(1.0,1.0,1.0);
    n = normalize(n);
    bunny_normals.push(n);
    for(var index=1; index < (bunny_points.length/3); index++) {
        supported = getSupportedTriangles(index);
        for(var k = 0; k < supported.length; k += 3) {
            normals.push(calcNormalOf(supported[k],supported[k+1],supported[k+2]));
        }
        n = vec3(0.0,0.0,0.0);
        for(var t = 0; t < normals.length; t++) {
            n[0] += normals[t][0];
            n[1] += normals[t][1];
            n[2] += normals[t][2];
        }
        n = normalize(n);
        bunny_normals.push(n);
    }

}

function calcNormalOf(a,b,c) {
    a *= 3;
    b *= 3;
    c *= 3;
    var temp = bunny_points[a];
    var vertexA = vec3();
    vertexA = vec3(bunny_points[a],bunny_points[a+1],bunny_points[a+2]);
    var vertexB = vec3(bunny_points[b],bunny_points[b+1],bunny_points[b+2]);
    var vertexC = vec3(bunny_points[c],bunny_points[c+1],bunny_points[c+2]);
    var AB = vec3(vertexB[0]-vertexA[0], vertexB[1]-vertexA[1], vertexB[2]-vertexA[2]);
    var AC = vec3(vertexC[0]-vertexA[0], vertexC[1]-vertexA[1], vertexC[2]-vertexA[2]);

    var normal = vec3(AB[1]*AC[2]-AC[1]*AB[2],AB[0]*AC[2]-AC[0]*AB[2],AB[0]*AC[1]-AC[0]*AB[1]);
    return normal;
}

function getSupportedTriangles(v) {
    var result = [];
    for(var i= 0; i < bunny_faces.length; i++) {
        var offset = i - i%3;
        if (bunny_faces[i] == v) {
            result.push(bunny_faces[offset]);
            result.push(bunny_faces[offset+1]);
            result.push(bunny_faces[offset+2]);
        }
    }
    return result;
}

function bunnyDrawWireFrame(gl, program) {
	gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, bunny_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


	gl.bindBuffer(gl.ARRAY_BUFFER, bunny_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bunny_edges_buffer);
    gl.drawElements(gl.LINES, bunny_edges.length, gl.UNSIGNED_SHORT, 0);
}

function addEdges() {
	for(var i = 0; i < bunny_faces.length;i+=3) {
		vertex1 = bunny_faces[i];
		vertex2 = bunny_faces[i+1];
		vertex3 = bunny_faces[i+2];
        if(isUnique(vertex1,vertex2)) {
            bunny_edges.push(vertex1);
    		bunny_edges.push(vertex2);
        }

        if(isUnique(vertex1,vertex3)) {
		      bunny_edges.push(vertex1);
		      bunny_edges.push(vertex3);
        }
        if(isUnique(vertex2,vertex3)) {
            bunny_edges.push(vertex2);
    		bunny_edges.push(vertex3);
        }
	}
}

function isUnique(a,b) {
    for(var i = 0; i < bunny_edges.length; i+=2) {
        if((bunny_edges[i] == a && bunny_edges[i+1] == b) ||
           (bunny_edges[i] == b && bunny_edges[i+1] == a))
           return false;
    }
    return true;
}
