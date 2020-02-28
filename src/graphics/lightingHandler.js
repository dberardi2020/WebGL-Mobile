/**
 * Handles the initial lighting setup
 */
function setLighting() {
    // Lighting constants
    let materialShininess = 30.0;
    let lightPosition = vec4(0.0, 4.0, 0.0, 0.0);

    let lightAmbient = vec4(0.5, 0.5, 0.5, 1.0);
    let materialAmbient = vec4(0.3, 0.3, 0.3, 1.0);

    let lightDiffuse = vec4(0.75, 0.75, 0.75, 1.0);
    let materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);

    let lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
    let materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);

    // Calculate our ambient, diffuse, and specular products
    let ambientProduct = mult(lightAmbient, materialAmbient);
    let diffuseProduct = mult(lightDiffuse, materialDiffuse);
    let specularProduct = mult(lightSpecular, materialSpecular);

   // Update vertex shader with our defined lighting constants
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
}