function render() {
    // Setup modelView matrix
    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelView, false, flatten(modelViewMatrix));

    // Setup projection
    perspectiveMatrix = perspective(45.0, aspectRatio, .1, 500);
    gl.uniformMatrix4fv(projection, false, flatten(perspectiveMatrix));

    // Draw the mobile for each render
    drawMobile();

    // Update the vertex shader with our current spotlight angle
    updateSpotlightAngle();

    // Request another animation frame (infinite)
    requestAnimationFrame(render);
}

/**
 * Updates the vertex shader with our current spotlight angle
 */
function updateSpotlightAngle() {
    gl.uniform1f(gl.getUniformLocation(program, "spotlightAngle"), spotlightAngle);
}