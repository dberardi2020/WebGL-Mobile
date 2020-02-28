/**
 * Handles all set up for WebGL and JS program, and sets
 * important variables to be used elsewhere
 */
function initialize() {
    // Set the description on the page. This is done here
    // because it is easier to create variable in JS than
    // type out in HTML
    document.getElementById("description").innerHTML = description;

    // Get reference to canvas to be used throughout program
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = WebGLUtils.setupWebGL(canvas, undefined);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    program = initShaders(gl, "vshader", "fshader");
    gl.useProgram(program);

    // Setup viewport and clear color
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    // Enable culling
    gl.enable(gl.CULL_FACE);

    // Save aspect ratio for use throughout program
    aspectRatio = canvas.width / canvas.height;

    // Setup projection and modelview matrix
    projection = gl.getUniformLocation(program, "projectionMatrix");
    modelView = gl.getUniformLocation(program, "modelMatrix");

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Start program functionality once initialization has complete
    runProgram();
}