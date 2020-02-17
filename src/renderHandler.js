// Initialize scaleValue to be set later
let scaleValue = 1;

// Used to store points after they have been pulsed
let pointsPulsed = [];

// Used to store the faces normals
let normals = [];

/**
 * Handles each stage of the graphics pipeline
 */
function render() {

    // Sets the camera in the scene
    let eye = vec3(0, 0, 2);
    let at = vec3(0, 0, 0);
    let up = vec3(0, 1, 0);
    let modelView = lookAt(eye, at, up);

    // Handles all transformation matrices
    let model = mult(modelView, translationModel());
    model = mult(model, rotationModel());
    model = mult(model, scaleModel());
    model = mult(model, centerModel());

    // Clear buffers on each render
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Setup our model matrix
    let modelMatrix = gl.getUniformLocation(program, 'modelMatrix');
    gl.uniformMatrix4fv(modelMatrix, false, flatten(model));

    // Setup our projection matrix
    let thisProj = perspective(45, 1, 0.01, 200);
    let projMatrix = gl.getUniformLocation(program, 'projMatrix');
    gl.uniformMatrix4fv(projMatrix, false, flatten(thisProj));

    // Clear points to be rendered before pulsing
    pointsPulsed = [];

    // Pulse mesh, toggle handled within function
    pulseMesh();

    // Pass points to pointBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsPulsed), gl.STREAM_DRAW);

    // Pass colors to colorBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    // Draw mesh
    for (let i = 0; i < points.length - 2; i += 3) {
        gl.drawArrays(gl.LINE_LOOP, i, 3);
    }

    // Loops rendering for constant update
    requestAnimationFrame(render);
}

/**
 * Handles the translation of model
 * @returns {[*, *, *, *]|[*, *, *, *]}: translation matrix
 */
function translationModel() {
    let translationTheta = 0.01;

    // If +x translation enabled, increase x offset by {translationTheta}
    if(translateX.pos) {
        translateX.offset += translationTheta;
    }
    // If -x translation enabled, decrease x offset by {translationTheta}
    else if(translateX.neg) {
        translateX.offset -= translationTheta;
    }

    // If +y translation enabled, increase y offset by {translationTheta}
    if(translateY.pos) {
        translateY.offset += translationTheta;
    }
    // If -y translation enabled, decrease y offset by {translationTheta}
    else if(translateY.neg) {
        translateY.offset -= translationTheta;
    }

    // If +z translation enabled, increase z offset by {translationTheta}
    if(translateZ.pos) {
        translateZ.offset += translationTheta;
    }
    // If -z translation enabled, decrease z offset by {translationTheta}
    else if(translateZ.neg) {
        translateZ.offset -= translationTheta;
    }

    return translate(translateX.offset, translateY.offset, translateZ.offset);
}

/**
 * Handles the rotation of the model
 * @returns {[*, *, *, *]|[*, *, *, *]}: rotation matrix
 */
function rotationModel() {
    // The number of degrees one rotation equals
    let rotationTheta = 1;

    // If +x rotation enabled, increase x theta by {rotationTheta}
    if(rotateXAxis.pos) {
        rotateXAxis.theta += rotationTheta;
    }

    return rotateX(rotateXAxis.theta);
}

/**
 * Given the current bounds, determine the amount to scale matrix
 * @returns {[*, *, *, *]|[*, *, *, *]}: scale matrix
 */
function scaleModel() {
    let scaleX = (xbounds.xMax - xbounds.xMin);
    let scaleY = (ybounds.yMax - ybounds.yMin);
    let scaleZ = (zbounds.zMax - zbounds.zMin);

    scaleValue = Math.max(scaleX, scaleY, scaleZ);

    return mat4(
        1 / scaleValue, 0, 0, 0,
        0, 1 / scaleValue, 0, 0,
        0, 0, 1 / scaleValue, 0,
        0, 0, 0, 1
    );
}

/**
 * Given current bounds, determine the center of model
 * @returns {[*, *, *, *]|[*, *, *, *]}: center matrix
 */
function centerModel() {
    let centerX = 0.5 * (xbounds.xMax + xbounds.xMin);
    let centerY = 0.5 * (ybounds.yMax + ybounds.yMin);
    let centerZ = 0.5 * (zbounds.zMax + zbounds.zMin);

    return mat4(
        1, 0, 0, -centerX,
        0, 1, 0, -centerY,
        0, 0, 1, -centerZ,
        0, 0, 0, 1
    );
}

/**
 * Handles the pulsing of the mesh
 */
function pulseMesh() {
    // The distance the mesh with pulse out, lower = further
    let depth = 100;

    // The speed at which the mesh will pulse, but will also
    // make the mesh distance increase
    let pulseIterations = 60;

    // If pulse is enabled, do the following
    if(pulse.pulseOn) {
        // Switches pulse direction every {pulseIterations} pulses
        if (pulse.pulseCount % pulseIterations === 0) {
            pulse.pulseOut = !pulse.pulseOut;
        }

        // Determine pulse offset, given scale, depth, and direction
        if(pulse.pulseOut) {
            pulse.pulseCount++;
            pulse.pulseOffset += Math.abs(scaleValue * 0.025) / depth;
        } else {
            pulse.pulseOffset -= Math.abs(scaleValue * 0.025) / depth;
            pulse.pulseCount--;
        }
    }

    // Push pulsed points (must scale and translate properly) to be rendered
    for (let i = 0, j= 0; i < points.length - 2; i += 3, j++) {
        let matrixScaled = vec3(normals[j][0] * pulse.pulseOffset, normals[j][1] * pulse.pulseOffset, normals[j][2] * pulse.pulseOffset);
        let matrixTranslated = translate(matrixScaled);

        pointsPulsed.push(mult(matrixTranslated, vec4(points[i][0], points[i][1], points[i][2], 1.0)));
        pointsPulsed.push(mult(matrixTranslated, vec4(points[i + 1][0], points[i + 1][1], points[i + 1][2], 1.0)));
        pointsPulsed.push(mult(matrixTranslated, vec4(points[i + 2][0], points[i + 2][1], points[i + 2][2], 1.0)));
    }
}

/**
 * For each face in the model, calculate its normal using the Newell method
 */
function calculateNormals() {
    for (let i = 0; i < points.length - 2; i += 3) {
        newellMethod([points[i], points[i + 1], points[i + 2]])
    }
}

/**
 * Using the newell method, determine normal of a triangle face
 * @param facePoints: 3 points that make up a triangle face
 */
function newellMethod(facePoints) {
    let normal = {"x": 0, "y": 0, "z": 0};

    // Apply the newell method
    facePoints.push(facePoints[0]);
    for (let i = 0; i < facePoints.length - 1; i++) {
        normal.x += (facePoints[i][1] - facePoints[i + 1][1]) * (facePoints[i][2] + facePoints[i + 1][2]);
        normal.y += (facePoints[i][2] - facePoints[i + 1][2]) * (facePoints[i][0] + facePoints[i + 1][0]);
        normal.z += (facePoints[i][0] - facePoints[i + 1][0]) * (facePoints[i][1] + facePoints[i + 1][1]);
    }

    // Push normal to the normals array
    normals.push(normalize(vec3(normal.x, normal.y, normal.z))); // Return our normal
}