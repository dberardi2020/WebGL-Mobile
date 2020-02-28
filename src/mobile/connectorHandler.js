/**
 * Given three elements. in a triangle formation, create a set of connectors
 * which resemble an upside down field goal post.
 * @param topElement
 * @param bottomElementLeft
 * @param bottomElementRight
 */
function drawConnectors(topElement, bottomElementLeft, bottomElementRight) {
    // A point representing the center of the top element
    let topPoint = vec4(topElement.coordinates.x, topElement.coordinates.y, topElement.coordinates.z, 1.0);

    // The y coordinate which falls halfway between the top element and the bottom two elements
    // This assumes that both bottom element share the same y value (which is true for this project)
    let halfYCoord = (topElement.coordinates.y + bottomElementLeft.coordinates.y) / 2;

    // A point which when connected to the topPoint creates a line going from the center of the
    // topPoint straight down till it is halfway between the top and bottom points.  The "post"
    let halfYMiddlePoint = vec4(topElement.coordinates.x, halfYCoord, topElement.coordinates.z, 1.0);

    // When put together these two points create a line which runs perpendicular to the before mentioned line
    // This line starts and ends in the x-direction directly above both bottom elements, and halfway between
    // the top and bottom elements in the y-direction
    let halfYLeftPoint = vec4(bottomElementLeft.coordinates.x, halfYCoord, bottomElementLeft.coordinates.z, 1.0);
    let halfYRightPoint = vec4(bottomElementRight.coordinates.x, halfYCoord, bottomElementRight.coordinates.z, 1.0);

    // These two points represent the center of the two bottom elements, and will be used to create a line
    // from the center of each element straight up to connect with the previous mentioned perpendicular line
    let middlePoint1 = vec4(bottomElementLeft.coordinates.x, bottomElementLeft.coordinates.y, bottomElementLeft.coordinates.z, 1.0);
    let middlePoint2 = vec4(bottomElementRight.coordinates.x, bottomElementRight.coordinates.y, bottomElementRight.coordinates.z, 1.0);

    // Push all points into array for rendering.  The ordering determines what connects where
    let connectors = [];
    // Line 1
    connectors.push(topPoint);
    connectors.push(halfYMiddlePoint);
    // Line 2
    connectors.push(halfYLeftPoint);
    connectors.push(halfYRightPoint);
    // Line 3
    connectors.push(halfYLeftPoint);
    connectors.push(middlePoint1);
    // Line 4
    connectors.push(halfYRightPoint);
    connectors.push(middlePoint2);

    renderConnectors(connectors);
}

/**
 * This function takes the array of connectors and renders it appropriately
 * @param connectors
 */
function renderConnectors(connectors) {
    // Points and position
    let connectorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, connectorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(connectors), gl.STATIC_DRAW);

    let vertexPosition = gl.getAttribLocation(program, "vertexPosition");
    gl.vertexAttribPointer(vertexPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    // Connector colors
    let colors = [];
    for (let i = 0; i < connectors.length; i++) {
        colors.push(vec4(0.0, 0.0, 0.0, 1.0));
    }

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    let vertexColor = gl.getAttribLocation(program, "vertexColor");
    gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexColor);

    // Draw
    gl.drawArrays(gl.LINES, 0, connectors.length);
}