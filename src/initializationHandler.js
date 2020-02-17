// Program architecture
let canvas;
let gl;
let program;
let canvasWidth, canvasHeight;

// Buffers
let pointBuffer, colorBuffer;

// Attributes
let vertexPosition, vertexColors;

// Strings for HTML
let description =
    "Please choose a .ply file to display\n\n" +
    "Keyboard Shortcuts (Toggles):\n" +
    "X: Translate in +x direction\n" +
    "C: Translate in -x direction\n" +
    "Y: Translate in +y direction\n" +
    "U: Translate in -y direction\n" +
    "Z: Translate in +z direction\n" +
    "A: Translate in -z direction\n" +
    "R: Rotate around x-axis\n" +
    "B: Pulse mesh";

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

    // Save canvas height and width for use throughout program
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    //Set up the viewport
    gl.viewport(0, 0, canvasWidth, canvasHeight);

    // Clear buffer array to clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    // Allocate memory for our points
    pointBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);

    // Array for our points/vertices
    vertexPosition = gl.getAttribLocation(program, "vertexPosition");
    gl.vertexAttribPointer(vertexPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    // Allocate memory for our colors
    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    // Array for our vertex colors
    vertexColors = gl.getAttribLocation(program, "vertexColor");
    gl.vertexAttribPointer(vertexColors, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexColors);

    // Start program functionality once initialization has complete
    runProgram();
}