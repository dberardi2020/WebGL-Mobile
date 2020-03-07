/**
 * Calls the draw functions for each level of the mobile,
 * creating it a top down fashion.  Also calls a function
 * to rotate the mobile on each render
 */
function drawMobile() {
    handleRefs();

    gl.disableVertexAttribArray(vTexCoord);
    rotateElements(0.5);

    drawTop();
    drawMiddle();
    drawBottom();
    gl.enableVertexAttribArray(vTexCoord);
}

/**
 * Draws the top layer of the mobile
 */
function drawTop() {
    stack.push(modelViewMatrix);

    rotateAboutSelfY(topElement);

    flattenMVMatrix();

    drawElement(topElement);

    maintainHierarchy();

    rotateOppositeSelfY(topElement);

    flattenMVMatrix();

    drawConnectors(topElement, middleElements[0], middleElements[1]);

    // These lines make it so the shadow rotates in the proper direction
    rotateAboutSelfY(topElement);
    rotateAboutSelfY(topElement);

    drawShadows(topElement, mobileLevels.top);
}

/**
 * Draws the middle layer of the mobile
 */
function drawMiddle() {
    for (let i = 0; i < middleElements.length; i++) {
        let currentElement = middleElements[i];

        maintainHierarchy();

        rotateAboutSelfY(currentElement);
        rotateWithParent(currentElement.parent);

        flattenMVMatrix();

        if (i === 0) {
            drawConnectors(middleElements[0], bottomElements[0], bottomElements[1]);
        } else {
            drawConnectors(middleElements[1], bottomElements[2], bottomElements[3]);
        }

        drawElement(currentElement);

        drawShadows(currentElement, mobileLevels.middle);
    }
}

/**
 * Draws the bottom layer of the mobile
 */
function drawBottom() {
    for (let i = 0; i < bottomElements.length; i++) {
        let currentElement = bottomElements[i];

        maintainHierarchy();

        rotateAboutSelfY(currentElement);
        rotateOppositeParent(currentElement);
        rotateWithParent(currentElement.parent.parent);

        flattenMVMatrix();

        drawElement(currentElement);

        drawShadows(currentElement, mobileLevels.bottom);
    }
}

/**
 * Implementation of the Newell method to get normal of face
 * @param facePoints
 * @returns {*}
 */
function newellMethod(facePoints) {
    let x = 0;
    let y = 0;
    let z = 0;

    // Apply the newell method
    facePoints.push(facePoints[0]);
    for (let i = 0; i < facePoints.length - 1; i++) {
        x += (facePoints[i][1] - facePoints[i + 1][1]) * (facePoints[i][2] + facePoints[i + 1][2]);
        y += (facePoints[i][2] - facePoints[i + 1][2]) * (facePoints[i][0] + facePoints[i + 1][0]);
        z += (facePoints[i][0] - facePoints[i + 1][0]) * (facePoints[i][1] + facePoints[i + 1][1]);
    }

    return vec3(x, y, z); // Return normal
}

/**
 * Rotates any element in respect to it's own y-axis
 * @param element
 */
function rotateAboutSelfY(element) {
    modelViewMatrix = mult(translate(-element.coordinates.x, -element.coordinates.y, eyeZ), modelViewMatrix);
    modelViewMatrix = mult(rotateY(element.rotation), modelViewMatrix);
    modelViewMatrix = mult(translate(element.coordinates.x, element.coordinates.y, -eyeZ), modelViewMatrix);
}

/**
 * Rotates any element opposite its own y-axis
 * @param element
 */
function rotateOppositeSelfY(element) {
    modelViewMatrix = mult(translate(-element.coordinates.x, -element.coordinates.y, eyeZ), modelViewMatrix);
    modelViewMatrix = mult(rotateY(-element.rotation), modelViewMatrix);
    modelViewMatrix = mult(translate(element.coordinates.x, element.coordinates.y, -eyeZ), modelViewMatrix);
}

/**
 * Rotates any element in respect to any given parent of that element
 * @param elementParent
 */
function rotateWithParent(elementParent) {
    modelViewMatrix = mult(translate(originCoords), modelViewMatrix);
    modelViewMatrix = mult(rotateY(-elementParent.rotation), modelViewMatrix);
    modelViewMatrix = mult(translate(originCoordsInversion), modelViewMatrix);
}

/**
 * Rotates any element opposite any given parent of that element
 * @param element
 */
function rotateOppositeParent(element) {
    modelViewMatrix = mult(translate(-element.parent.coordinates.x, -element.parent.coordinates.y, eyeZ), modelViewMatrix);
    modelViewMatrix = mult(rotateY(element.rotation), modelViewMatrix);
    modelViewMatrix = mult(translate(element.parent.coordinates.x, element.parent.coordinates.y, -eyeZ), modelViewMatrix);
}

/**
 * Rotates each element, setting the top element rotation to [rotationRate]
 * All other elements rotate at 3x the rate of the top element
 * @param rotationRate
 */
function rotateElements(rotationRate) {
    // Rotate elements of Mobile before each render
    let topRotationDelta = rotationRate;
    let rotationDelta = topRotationDelta * 3;

    topElement.rotation += topRotationDelta;

    middleElements.forEach(rotate);
    bottomElements.forEach(rotate);

    function rotate(item) {
        item.rotation += rotationDelta;
    }
}

/**
 * Handles flattening modelView Matrix
 */
function flattenMVMatrix() {
    gl.uniformMatrix4fv(modelView, false, flatten(modelViewMatrix));
}

/**
 * Given an element, determines it's shape and passes it to the proper draw function
 * @param element
 */
function drawElement(element) {
    switch (element.shape) {
        case "cube":
            drawCube(element);
            break;
        case "sphere":
            drawSphere(element);
            break;
    }
}

/**
 * Maintains stack hierarchy
 */
function maintainHierarchy() {
    modelViewMatrix = stack.pop();
    stack.push(modelViewMatrix);
}

