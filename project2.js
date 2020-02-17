// Used for determining bounds
let xbounds = {"xMin": Number.POSITIVE_INFINITY, "xMax": Number.NEGATIVE_INFINITY};
let ybounds = {"yMin": Number.POSITIVE_INFINITY, "yMax": Number.NEGATIVE_INFINITY};
let zbounds = {"zMin": Number.POSITIVE_INFINITY, "zMax": Number.NEGATIVE_INFINITY};

/**
 * Initiates rendering and passes file and key input
 * interactions to appropriate functions
 */
function runProgram() {
    render();

    let input = document.getElementById("fileSelector");
    input.addEventListener('change', function () {
      readFile(input);
    });

    window.onkeydown = function (event) {
        handleKeyPress(event.key);
    };
}

//  --- Helper Functions --- //

/**
 * Clears the file input field
 */
function clearInputValue() {
    let input = document.getElementById("fileSelector");
    input.value = "";
}

/**
 * Resets all variables, buffers and console logs
 * used for each mesh on upload of new file
 */
function reset() {
    fileContentsArray = [];
    vertexArray = [];
    drawingInstructions = [];
    points = [];
    colors = [];
    numVertices = 0;
    numPolygons = 0;
    xbounds.xMax = Number.NEGATIVE_INFINITY;
    xbounds.xMin = Number.POSITIVE_INFINITY;
    ybounds.yMax = Number.NEGATIVE_INFINITY;
    ybounds.yMin = Number.POSITIVE_INFINITY;
    zbounds.zMax = Number.NEGATIVE_INFINITY;
    zbounds.zMin = Number.POSITIVE_INFINITY;
    translateX = {"pos": false, "neg": false, "offset": 0};
    translateY = {"pos": false, "neg": false, "offset": 0};
    translateZ = {"pos": false, "neg": false, "offset": 0};
    rotateXAxis = {"pos": false, "theta": 0};
    pulse = {"pulseOn": false, "pulseOffset": 0, "pulseOut": false, "pulseCount": 0};
    normals = [];

    // Clear buffer array to clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    console.clear();
}