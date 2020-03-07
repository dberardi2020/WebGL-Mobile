/**
 * Based off of a function given in class, modified
 * to handle the mobile in this project
 * @param element
 * @param mobileLevel
 */
function drawShadows(element, mobileLevel) {
    let shadowElement = { ...element };
    shadowElement.color = shadowColor;
    let yTranslation;

    // Determine y-offset for shadows
    switch (mobileLevel) {
        case mobileLevels.top:
            yTranslation = -shadowElement.coordinates.y;
            break;
        case mobileLevels.middle:
            yTranslation = shadowElement.coordinates.y - 2.5;
            break;
        case mobileLevels.bottom:
            yTranslation = shadowElement.coordinates.y - 0.93;
            break;
    }

    if(shadowsOn) {
        modelViewMatrix = mult(modelViewMatrix, translate(lightPosition[0], lightPosition[1], lightPosition[2]));
        modelViewMatrix = mult(modelViewMatrix, shadowMap);
        modelViewMatrix = mult(modelViewMatrix, translate(-lightPosition[0], -lightPosition[1], -lightPosition[2]));
        modelViewMatrix = mult(translate(vec3(0, yTranslation, 0)), modelViewMatrix);
        gl.uniformMatrix4fv(modelView, false, flatten(modelViewMatrix));

        if (shadowElement.shape === "sphere") {
            drawSphere(shadowElement);
        } else if (shadowElement.shape === "cube") {
            drawCube(shadowElement);
        }
    }
}