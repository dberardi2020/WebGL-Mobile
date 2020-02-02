// Base of our Web Application
let canvas;
let gl;
let program;

// Buffers
let pointBuffer, colorBuffer;

// Attributes
let vertexPosition, vertexColors;
let vertexColorBlack = vec4(0.0, 0.0, 0.0, 1.0);
let vertexColorRed = vec4(1.0, 0.0, 0.0, 1.0);
let vertexColorGreen = vec4(0.0, 1.0, 0.0, 1.0);
let vertexColorBlue = vec4(0.0, 0.0, 1.0, 1.0);
let currentColor = vertexColorBlack;

// Storage of File Data
let fileContents;
let fileContentsArray = [];
let canvasWidth, canvasHeight;
let totalNumLines;

// Array of Lines
let linesToDraw = [];

// Strings for HTML
let drawModeDescription =
    "Welcome to Draw Mode: Click anywhere on the canvas to start drawing\n\n" +
    "Keyboard Shortcuts:\n" +
    "F: Switch to File Mode\n" +
    "C: Cycle Drawing Color\n" +
    "D: Clear the Canvas\n" +
    "Hold B + Click: Start a New Line\n";
let fileModeDescription =
    "Welcome to File Mode: Please choose a .dat file to display\n\n" +
    "Keyboard Shortcuts:\n" +
    "D: Switch to Draw Mode\n" +
    "C: Cycle Drawing Color\n" +
    "F: Clear the Canvas\n";

// This is the function which is called upon document load,
// which mainly handles initialization and keyboard functions
function main() {
    initialize();
    readFile();

    let colorPicker = document.getElementById("colorPicker");
    colorPicker.addEventListener("input", function (event) {
        // Reads Hex color value from color palette
        let colorHex = event.target.value;
        console.log("Custom color selected (in HEX): " + colorHex);

        // Gets the corresponding HEX value for each RGB value
        let RR = hexToDec(colorHex.substring(1,3))/255;
        let GG = hexToDec(colorHex.substring(3,5))/255;
        let BB = hexToDec(colorHex.substring(5,7))/255;
        console.log("Corresponding Decimal values: Red-" + RR + ", Green-" + GG + ", Blue-" + BB);

        // Determines grayscale of given color
        let grayScale = 0.299 * RR + 0.587 * GG + 0.114 * BB;
        console.log("Grayscale value: " + grayScale);

        // Given the grayscale, reject colors which would not
        // be visible against a white background
        if (grayScale < 0.6) {
            // Sets current color to given color
            currentColor = vec4(RR, GG, BB, 1.0);

            // Redraws image with given color
            drawImage();
        } else {
            alert("The chosen color will not be visible on the current canvas");
        }
    });

    window.onkeypress = function (event) {
        // On "d" being pressed, enter draw mode and reset extent
        if (event.key === "d") {
            reset();
            setBaseExtent();
            document.getElementById("CurrentMode").innerHTML = "Draw Mode";
            document.getElementById("fileSelector").style.display = "none";
            document.getElementById("description").innerHTML = drawModeDescription;
            drawMode();
        }
        // On "f" being pressed, enter file mode and reset extent
        if (event.key === "f") {
            reset();
            setBaseExtent();
            document.getElementById("CurrentMode").innerHTML = "File Mode";
            document.getElementById("fileSelector").style.display = "block";
            document.getElementById("description").innerHTML = fileModeDescription;
            document.getElementById("fileSelector").value = "";
        }

        // On "c" being pressed, cycle through the
        // colors: black, red, blue and green
        if (event.key === "c") {
            console.log("Switching the color");
            switch (currentColor) {
                case vertexColorBlack:
                    currentColor = vertexColorRed;
                    break;
                case vertexColorRed:
                    currentColor = vertexColorBlue;
                    break;
                case vertexColorBlue:
                    currentColor = vertexColorGreen;
                    break;
                case vertexColorGreen:
                    currentColor = vertexColorBlack;
                    break;
                default:
                    currentColor = vertexColorBlack;
            }
            drawImage();
        }
    }
}

// Sets up basic WebGL functions and buffers
function initialize() {
    document.getElementById("description").innerHTML = fileModeDescription;

    canvas = document.getElementById('webgl');
    // Get the rendering context for WebGL
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    program = initShaders(gl, "vshader", "fshader");
    gl.useProgram(program);

    // Initialize global canvas size variables
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

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
}

// Given a .dat file, this function will read the files
// content into a variable for use throughout the program.
// Otherwise, it will alert the user of invalid file type
function readFile() {
    let input = document.getElementById("fileSelector");
    input.addEventListener('change', function (event) {
        reset();

        // get fileName to determine if it is valid
        let fileName = input.files[0].name;

        // Throws error if you upload anything other than .dat file
        if (!fileName.endsWith(".dat")) {
            alert("Invalid File Type");
            input.value = "";
            return;
        }

        // Read file contents into "fileContents" variable
        const fileReader = new FileReader();
        fileReader.onload = function () {
            fileContents = fileReader.result;
            createArrayFromFile();
        }
        fileReader.readAsText(input.files[0]);
    })
}

// This function takes the entire file, puts it into a temporary array
// with each element of the array being each line of the array, then copies
// it into a final array for use, that removes all lines up to and including
// any line with a "*", and all white spaces
function createArrayFromFile() {
    // Create array with each line of the file for easier parsing
    let fileContentsLines = fileContents.split('\n');
    console.log("The contents of the given file, split line by line:");
    console.log(fileContentsLines);

    // Starting line for parsing
    let startingLine = 0;

    // If there is any "*" present in the file
    // remove all lines up to and including that line
    if (fileContents.includes("*")) {
        console.log("The given file contains a '*', determining which line to start at")
        for (let x = 0; x < fileContentsLines.length; x++) {
            if (!fileContentsLines[x].includes("*")) {
                continue;
            }
            startingLine = x + 1;
            console.log("The starting line is: " + startingLine);
        }
    } else {
        console.log("The given file does not contain any '*', starting line is 0");
    }

    // Remove all arbitrary white space lines in the file
    for (let line = startingLine; line < fileContentsLines.length; line++) {
        console.log("Removing all blank lines from the file");
        if (fileContentsLines[line] !== "") {
            fileContentsArray.push(fileContentsLines[line]);
        }
    }
    console.log("The resulting array is the following:");
    console.log(fileContentsArray);

    handleFileParameters();
}

// Determines if the file defines its own extent, and gets the
// total number of polyline in the figure.  If needed, passes the
// extent of to setBaseExtent() for processing
function handleFileParameters() {
    let startingIndex;

    // Get elements or the first line in the file
    let firstLine = fileContentsArray[0].match(/\S+/g);
    console.log("The first line of the formatted array is: ");
    console.log(firstLine);

    if (firstLine.length === 4) {
        console.log("File defines an extent");
        let proj = ortho(parseFloat(firstLine[0]), parseFloat(firstLine[2]), parseFloat(firstLine[3]), parseFloat(firstLine[1]), -1.0, 1.0);
        let extentsWidth = parseFloat(firstLine[2]) - parseFloat(firstLine[0]);
        let extentsHeight = parseFloat(firstLine[1]) - parseFloat(firstLine[3]);
        setExtent(proj, extentsWidth, extentsHeight);
        totalNumLines = parseInt(fileContentsArray[1]);
        startingIndex = 2;
    } else {
        setBaseExtent();
        totalNumLines = parseInt(fileContentsArray[0]);
        startingIndex = 1;
    }
    console.log("The file contains a total of " + totalNumLines + " polylines");

    getFilePolylines(startingIndex);
}

// Parses out each polyline in the given image, puts each into
// a variable (linesToDraw) and passes that of to drawImage()
function getFilePolylines(startingIndex) {
    for (let i = startingIndex; i < fileContentsArray.length; i++) {
        let pointsArray = [];

        let numPoints = parseInt(fileContentsArray[i]);
        console.log("The number of points in this polyline is: " + numPoints);
        for (let j = 0; j < numPoints; j++) {
            i++;
            let currentPoint = fileContentsArray[i].match(/\S+/g);
            console.log("Adding the point: " + currentPoint + " to the points array");
            let x = parseFloat(currentPoint[0]);
            let y = parseFloat(currentPoint[1]);
            pointsArray.push(vec4(x, y, 0.0, 1.0));
        }
        linesToDraw.push(pointsArray);
    }
    drawImage();
}

// Takes each polyline in the image, and passes
// it off to drawPolyline() for drawing
function drawImage() {
    for (let i in linesToDraw) {
        drawPolyline(linesToDraw[i]);
    }
}

// Takes any array of points, and draws its corresponding polyline
function drawPolyline(pointsArray) {
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    setColor(pointsArray);

    // Draw a dot on the first click
    gl.drawArrays(gl.POINTS, 0, 1);

    gl.drawArrays(gl.LINE_STRIP, 0, pointsArray.length);
}

// Sets the color of any given array of points
function setColor(pointsArray) {
    // for all of our points, push a color
    let vertexColors = [];
    for (let p in pointsArray) {
        vertexColors.push(currentColor);
    }

    // let cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);
}

// Adjust the size of the canvas and viewport
// to preserve the aspect ratio of a drawing
function adjustCanvasViewport(extentsWidth, extentsHeight) {
    let extentsRatio = extentsWidth / extentsHeight;
    let canvasRatio = canvasWidth / canvasHeight;

    if (extentsRatio > canvasRatio) {
        gl.viewport(0, 0, canvasWidth, canvasWidth / extentsRatio);
        canvas.height = canvasWidth / extentsRatio;
        canvas.width = canvasWidth;
    } else if (extentsRatio < canvasRatio) {
        gl.viewport(0, 0, canvasHeight * extentsRatio, canvasHeight);
        canvas.height = canvasHeight;
        canvas.width = canvasHeight * extentsRatio;
    }
}

// Handles all draw mode functionality, such as detecting click events,
// starting a new line, calculating proper x,y coordinates and redrawing
// image on each click
function drawMode() {
    let currentLine = [];
    let newLine = false;
    let numClicks = 0;

    canvas.onclick = function (event) {
        if (document.getElementById("CurrentMode").innerHTML === "Draw Mode") {
            console.log("Mouse Click");

            // Determine if "b" is being pressed
            window.onkeydown = function (event) {
                if (event.key === "b") {
                    newLine = true;
                }
            };

            // Determine if "b" is being pressed
            window.onkeyup = function (event) {
                if (event.key === "b") {
                    newLine = false;
                }
            };

            // Handle "b" press or > 100 clicks
            if (newLine || numClicks === 100) {
                currentLine = [];
                numClicks = 0;
            }

            // Get the canvas rectangle
            let rect = canvas.getBoundingClientRect();

            // Given the viewport and extent, get coordinates for points
            let x = ((event.clientX - rect.left) / canvas.width) * 640;
            let y = ((canvas.height - (event.clientY - rect.top)) / canvas.height) * 480;

            let mouseClickCoordinates = vec4(x, y, 0.0, 1.0);
            currentLine.push(mouseClickCoordinates);
            linesToDraw.push(currentLine);
            drawImage();

            numClicks++;
        }
    }
}


// // Adjust canvas viewport given any extent
function setExtent(proj, extentWidth, extentHeight) {
    let modelMatrix = gl.getUniformLocation(program, "modelMatrix");
    gl.uniformMatrix4fv(modelMatrix, false, flatten(proj));
    adjustCanvasViewport(extentWidth, extentHeight);
}

// Reset the canvas, and all associated values used for drawing to the canvas
function reset() {
    // Reset values to clear previous .dat file
    fileContentsArray = [];
    linesToDraw = [];
    console.log("File Contents Array Cleared, the following should be empty: \"" + fileContentsArray + "\"")

    // Set the viewport
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Clear buffer array to clear the canvas
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

// Sets the base extent for the canvas, for when it is not defined
// or when the canvas is being reset to its initial state
function setBaseExtent() {
    let proj = ortho(0.0, 640.0, 0.0, 480.0, -1.0, 1.0);
    setExtent(proj, 640, 480);
}

function hexToDec(hex) {
    let dec = 0;
    for (let x = 0; x < hex.length; x++) {
        let hexdigit = parseInt(hex[x], 16);
        dec = (dec << 4) | hexdigit;
    }
    return dec;
}

