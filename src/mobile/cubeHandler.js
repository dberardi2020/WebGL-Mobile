/**
 * Handles the entire process of drawing a mobile cube
 * @param element
 */
function drawCube(element) {
    // Create our cube
    createCube(element);

    // Create buffers for the points, colors, and normals
    handleBuffers(cubePoints, cubeNormals, element.color);

    // Cull and draw the cube
    gl.cullFace(gl.BACK);
    gl.drawArrays(gl.TRIANGLES, 0, cubePoints.length);
}

/**
 * Creates a cube for drawing.  This function is based off of a
 * class example, with additions for handling normals/lighting
 * @param element
 * @returns {[]}
 */
function createCube(element) {
    let x = element.coordinates.x;
    let y = element.coordinates.y;
    let z = element.coordinates.z;
    let scaleX;
    let scaleY;
    let scaleZ;

    if(typeof element.scale === 'object') {
        scaleX = element.scale.x;
        scaleY = element.scale.y;
        scaleZ = element.scale.z;
    } else {
        scaleX = element.scale;
        scaleY = element.scale;
        scaleZ = element.scale;
    }

    cubePoints = [];
    cubeNormals = [];

    let vertices = [];

    vertices = vertices.concat(quad(1, 0, 3, 2));
    vertices = vertices.concat(quad(2, 3, 7, 6));
    vertices = vertices.concat(quad(3, 0, 4, 7));
    vertices = vertices.concat(quad(6, 5, 1, 2));
    vertices = vertices.concat(quad(4, 5, 6, 7));
    vertices = vertices.concat(quad(5, 4, 0, 1));

    let cubePointsT = [];
    for (let i = 0; i < vertices.length; i++) {
        let coordinates = [
            ((vertices[i][0] * scaleX) + x),
            ((vertices[i][1] * scaleY) + y),
            ((vertices[i][2] * scaleZ) + z), 1.0];
        cubePointsT.push(coordinates);
    }

    cubePoints = cubePointsT;

    if (lightingType === lightingTypes.flat) {
        for (let i = 0; i < cubePoints.length - 2; i += 3) {
            let normal = newellMethod([cubePoints[i], cubePoints[i + 1], cubePoints[i + 2]]);

            cubeNormals.push([normal[0], normal[1], normal[2], 0.0]);
            cubeNormals.push([normal[0], normal[1], normal[2], 0.0]);
            cubeNormals.push([normal[0], normal[1], normal[2], 0.0]);
        }
    }

    return cubePointsT;
}

/**
 * Used to create a cube. This function is based off of a class
 * example, with additions for handling normals/lighting
 * @param a
 * @param b
 * @param c
 * @param d
 * @returns {[]}
 */
function quad(a, b, c, d) {
    let finalVertices = [];

    let vertices = [
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0)
    ];

    let indices = [a, b, c, a, c, d];

    for (let i = 0; i < indices.length; ++i) {
        finalVertices.push(vertices[indices[i]]);

        if (lightingType === lightingTypes.gouraud) {
            cubeNormals.push(
                vertices[indices[i]][0],
                vertices[indices[i]][1],
                vertices[indices[i]][2], 0.0);
        }
    }

    texCoordsArray.push(texCoord[0]);
    texCoordsArray.push(texCoord[1]);
    texCoordsArray.push(texCoord[2]);
    texCoordsArray.push(texCoord[0]);
    texCoordsArray.push(texCoord[2]);
    texCoordsArray.push(texCoord[3]);

    return finalVertices;
}