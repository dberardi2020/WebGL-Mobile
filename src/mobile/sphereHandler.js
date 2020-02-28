/**
 * Handles the entire process of drawing a mobile sphere
 * @param element
 */
function drawMobileSphere(element) {
    // Create our sphere
    drawSphere(element);

    // Create buffers for the points, colors, and normals
    handleBuffers(spherePoints, sphereNormals, element.color);

    // Cull and draw the sphere
    gl.cullFace(gl.FRONT);
    gl.drawArrays(gl.TRIANGLES, 0, spherePoints.length);
}

/**
 * Creates a sphere for drawing. This function is based off of a
 * class example, with additions for handling normals/lighting
 * @param element
 * @returns {[]}
 */
function drawSphere(element) {
    let x = element.coordinates.x;
    let y = element.coordinates.y;
    let z = element.coordinates.z;

    spherePoints = [];
    sphereNormals = [];

    let a = vec4(0.0, 0.0, -1.0, 1);
    let b = vec4(0.0, 0.942809, 0.333333, 1);
    let c = vec4(-0.816497, -0.471405, 0.333333, 1);
    let d = vec4(0.816497, -0.471405, 0.333333, 1);

    divideTriangle(a, b, c, 4);
    divideTriangle(d, c, b, 4);
    divideTriangle(a, d, b, 4);
    divideTriangle(a, c, d, 4);

    let spherePointsT = [];
    for (let i = 0; i < spherePoints.length; i++) {
        let coordinates = [
            ((spherePoints[i][0] * element.scale) + x),
            ((spherePoints[i][1] * element.scale) + y),
            ((spherePoints[i][2] * element.scale) + z), (1.0)];
        spherePointsT.push(coordinates);
    }

    spherePoints = spherePointsT;

    if (lightingType === lightingTypes.flat) {
        for (let i = 0; i < spherePoints.length - 2; i += 3) {
            let normal = newellMethod([
                spherePoints[i],
                spherePoints[i + 1],
                spherePoints[i + 2]]);

            sphereNormals.push([-normal[0], -normal[1], -normal[2], 0.0]);
            sphereNormals.push([-normal[0], -normal[1], -normal[2], 0.0]);
            sphereNormals.push([-normal[0], -normal[1], -normal[2], 0.0]);
        }
    }

    return spherePointsT;
}

/**
 * Used to create sphere from triangles. This function is based off
 * of a class example, with additions for handling normals/lighting
 * @param a
 * @param b
 * @param c
 * @param count
 */
function divideTriangle(a, b, c, count) {
    if (count > 0) {
        let ab = mix(a, b, 0.5);
        let ac = mix(a, c, 0.5);
        let bc = mix(b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle(a, ab, ac, count - 1);
        divideTriangle(bc, c, ac, count - 1);
        divideTriangle(ab, b, bc, count - 1);
        divideTriangle(ab, bc, ac, count - 1);
    } else {
        spherePoints.push(a);
        spherePoints.push(b);
        spherePoints.push(c);

        if (lightingType === lightingTypes.gouraud) {
            sphereNormals.push(a[0], a[1], a[2], 0.0);
            sphereNormals.push(b[0], b[1], b[2], 0.0);
            sphereNormals.push(c[0], c[1], c[2], 0.0);
        }
    }
}
