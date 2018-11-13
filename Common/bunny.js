var bunny_normals = [];
var bunny_edges = [];

var bunny_points_buffer;
var bunny_normals_buffer;
var bunny_faces_buffer;
var bunny_edges_buffer;

function bunnyInit(gl) {
    bunnyUploadData(gl);
}

function bunnyUploadData(gl) {
    bunny_points_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bunny_points_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(bunny_points), gl.STATIC_DRAW);

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

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bunny_faces_buffer);
    gl.drawElements(gl.TRIANGLES, bunny_faces.length, gl.UNSIGNED_SHORT, 0);
}
