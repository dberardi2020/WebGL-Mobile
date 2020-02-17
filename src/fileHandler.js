// Storage of File Data
let fileContents;
let fileContentsLength;
let fileContentsArray = [];
let vertexArray = [];
let drawingInstructions = [];
let points = [];
let colors = [];
let numVertices;
let numPolygons;

// Define the color white for lines
let vertexColorWhite = vec4(1.0, 1.0, 1.0, 1.0);

/**
 * Given a .ply file, reads the files content into
 * "fileContents" variable for use throughout the program.
 * Otherwise, it will alert the user of invalid file type
 * @param input: File contents
 */
function readFile(input) {
    reset();

    // get fileName to determine if it is valid
    let fileName = input.files[0].name;

    // Throws error if you upload anything other than .ply file
    if (!fileName.endsWith(".ply")) {
        alert("Invalid File Type");
        clearInputValue();
        return;
    }

    // Read file contents into "fileContents" variable
    const fileReader = new FileReader();
    fileReader.onload = function () {
        fileContents = fileReader.result;
        createArrayFromFile();
    };
    fileReader.readAsText(input.files[0]);
}

/**
 * This function takes the entire file, puts it into a temporary array
 * with each element of the array being each line of the file
 */
function createArrayFromFile() {
    // Create array with each line of the file for easier parsing
    fileContentsArray = fileContents.split('\n');

    // Store the number of lines in the file for use later
    fileContentsLength = fileContentsArray.length;

    handleFileParameters();
}

/**
 * Takes each line of the array and extracts the following data:
 * Number of Vertices
 * Number of Polygons
 * Vertices
 * Drawing Instructions
 *
 * Also, determines if file structure is valid, i.e. if the
 * first line contains the string "ply"
 */
function handleFileParameters() {
    for (let i = 0; i < 9; i++) {
        let line = parseLine(fileContentsArray[i]);
        switch (i) {
            case 0:
                // Reject file if first line isn't "ply" or "Ply"
                if (line[0] !== ("ply" || "Ply")) {
                    alert("File Structure is Invalid");
                    clearInputValue();
                    return;
                }

                break;
            case 2:
                // Store number of vertices in variable
                numVertices = parseInt(line[2]);
                break;
            case 6:
                // Store number of polygons in variable
                numPolygons = parseInt(line[2]);
                break;
            default:
                // Ignore lines that don't tell us anything
                break;
        }
    }

    // Save the vertex values to an array
    for (let i = 9; i < (numVertices + 9); i++) {
        vertexArray.push(fileContentsArray[i]);
    }

    // Save drawing instructions to an array
    for (let i = (numVertices + 9); i < (numVertices + numPolygons + 9); i++) {
        drawingInstructions.push(fileContentsArray[i]);
    }

    getPoints();
}

/**
 * Takes the drawing instructions, and gets matching vertices from
 * the vertexArray.  Passes vertices to getBounds for calculation.
 * Passes final points into points array and for each adds the
 * color white to the color array
 */
function getPoints() {
    for (let i in drawingInstructions) {
        let currentLine = parseLine(drawingInstructions[i]);

        for (let j = 1; j < 4; j++) {
            // match each instruction to its corresponding vertex value
            let currentPoint = parseLine(vertexArray[parseInt(currentLine[j])]);

            // Parse strings to usable float values
            let x = parseFloat(currentPoint[0]);
            let y = parseFloat(currentPoint[1]);
            let z = parseFloat(currentPoint[2]);

            // Pass values to update bounds
            getBounds(x, y, z);

            // Push values to there corresponding arrays
            points.push(vec4(x, y, z, 1.0));
            colors.push(vertexColorWhite);
        }
    }

    // Pre-calculate normals to increase render speed
    calculateNormals();
}

/**
 * Updates the highest and lowest x,y,z bound
 * @param x: New x value from vertexArray
 * @param y: New y value from vertexArray
 * @param z: New z value from vertexArray
 */
function getBounds(x, y, z) {
    if (x < xbounds.xMin)
        xbounds.xMin = x;
    if (x > xbounds.xMax)
        xbounds.xMax = x;
    if (y < ybounds.yMin)
        ybounds.yMin = y;
    if (y > ybounds.yMax)
        ybounds.yMax = y;
    if (z < zbounds.zMin)
        zbounds.zMin = z;
    if (z > zbounds.zMax)
        zbounds.zMax = z;
}

/**
 * Takes a line, and parses into an array where each
 * space separated string becomes an item in an array
 * @param lineToParse: A string which is one line of a file
 * @returns array where each space separated string becomes an item in the array
 */
function parseLine(lineToParse) {
    return lineToParse.match(/\S+/g);
}