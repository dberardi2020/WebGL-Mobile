let canvas;
let gl;
let program;

// Strings for HTML
let description =
    "Please choose a .ply file to display\n\n" +
    "Keyboard Shortcuts:\n" +
    "D: Switch to Draw Mode\n" +
    "C: Cycle Drawing Color\n" +
    "F: Clear the Canvas\n";

// Buffers
let pointBuffer, colorBuffer;

// Attributes
let vertexPosition, vertexColors;
let vertexColorWhite = vec4(1.0, 1.0, 1.0, 1.0);

// Storage of File Data
let canvasWidth, canvasHeight;
let fileContents;
let fileContentsLength;
let fileContentsArray = [];
let vertexArray = [];
let drawingInstructions = [];
let points;
let colors;
let numVertices;
let numPolygons;



var theta = 45;
var alpha = 0;

function main() {
    initialize();
    readFile();
}

function initialize() {
    document.getElementById("description").innerHTML = description;

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

    // Initialize global canvas size variables
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    //Set up the viewport
    gl.viewport(0, 0, canvasWidth, canvasHeight);

    points = [];
    colors = [];

    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );

    // Allocate memory for our points
    pointBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Array for our points/vertices
    vertexPosition = gl.getAttribLocation(program, "vertexPosition");
    gl.vertexAttribPointer(vertexPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    // Allocate memory for our colors
    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    // Array for our vertex colors
    vertexColors = gl.getAttribLocation(program, "vertexColor");
    gl.vertexAttribPointer(vertexColors, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexColors);

    //This is how we handle extents
    var thisProj = ortho(-1, 1, -1, 1, -1, 1);
    var projMatrix = gl.getUniformLocation(program, 'projMatrix');
    gl.uniformMatrix4fv(projMatrix, false, flatten(thisProj));

    // Clear buffer array to clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
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
    })
}

// This function takes the entire file, puts it into a temporary array
// with each element of the array being each line of the array, then copies
// it into a final array for use, that removes all white spaces
function createArrayFromFile() {
    // Create array with each line of the file for easier parsing
    fileContentsArray = fileContents.split('\n');
    fileContentsLength = fileContentsArray.length;

    console.log("The contents of the given file, split line by line:");
    console.log(fileContentsArray);

    handleFileParameters();
}

// Handles all file parameters
function handleFileParameters() {
    for(let i = 0; i < 9; i++) {
        let line = parseLine(fileContentsArray[i]);
        switch (i) {
            case 0:
                if(line[0] !== ("ply" || "Ply")) {
                    console.log("Invalid File Structure: Did not start with \"ply\" or \"Ply\"")
                    clearInputValue();
                    return;
                }

                break;
            case 2:
                numVertices = parseInt(line[2]);
                console.log("Number of vertices: " + numVertices);
                break;
            case 6:
                numPolygons = parseInt(line[2]);
                console.log("Number of polygons: " + numPolygons);
                break;
            default:
                break;
        }
    }

    for(let i = 9; i < (numVertices + 9); i++) {
        vertexArray.push(fileContentsArray[i]);
    }

    console.log(vertexArray);

    for(let i = (numVertices + 9); i < (numVertices + numPolygons + 9); i++) {
        drawingInstructions.push(fileContentsArray[i]);
    }

    console.log(drawingInstructions);

    getPoints();
}

function getPoints() {
    // for(let i in drawingInstructions) {
    //     let currentLine = parseLine(drawingInstructions[i]);
    //
    //     for(let j = 1; j < 4; j++) {
    //         let currentPoint = parseLine(vertexArray[parseInt(currentLine[j])]);
    //         let x = parseFloat(currentPoint[0]);
    //         let y = parseFloat(currentPoint[1]);
    //         let z = parseFloat(currentPoint[2]);
    //         points.push(vec4(x,y,z,1.0));
    //     }
    // }

    // var vertices = [
    //     vec4( -0.5, -0.5,  0.5, 1.0 ),
    //     vec4( -0.5,  0.5,  0.5, 1.0 ),
    //     vec4(  0.5,  0.5,  0.5, 1.0 ),
    //     vec4(  0.5, -0.5,  0.5, 1.0 ),
    //     vec4( -0.5, -0.5, -0.5, 1.0 ),
    //     vec4( -0.5,  0.5, -0.5, 1.0 ),
    //     vec4(  0.5,  0.5, -0.5, 1.0 ),
    //     vec4(  0.5, -0.5, -0.5, 1.0 )
    // ];
    //
    // for(let i=0; i <= vertices.length; i++) {
    //     points.push(vertices[i]);
    //     colors.push(vertexColorWhite);
    // }
    //
    // console.log(points);
    // console.log(colors);

    render();
}

// function render() {
//     console.log("Rendering");
//     gl.clear( gl.COLOR_BUFFER_BIT );
//
//     // gl.drawArrays(gl.POINTS, 0, points.length);
//     // gl.drawArrays(gl.TRIANGLES, 0, points.length);
//     gl.drawArrays(gl.LINE_LOOP, 0, points.length);
// }


function render() {
    var rotMatrix = rotate(theta, vec3(-1, -1, 0));
    //var rotMatrix = rotateY(theta);
    //var rotMatrix2 = rotateX(45);
    var translateMatrix = translate(alpha, 0, 0);
    //var tempMatrix = mult(rotMatrix, rotMatrix2);
    //var ctMatrix = mult(translateMatrix, tempMatrix);
    var ctMatrix = mult(translateMatrix, rotMatrix);

    theta += 0.5;
    //alpha += 0.005;

    var ctMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
    gl.uniformMatrix4fv(ctMatrixLoc, false, flatten(ctMatrix));

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // gl.drawArrays(gl.POINTS, 0, points.length);
    // gl.drawArrays(gl.TRIANGLES, 0, points.length);
    gl.drawArrays(gl.LINE_LOOP, 0, points.length);

    //console.log(theta);

    //if(theta < -90) {
    //	cancelAnimationFrame(id);
    //}
    //else
    //{
    // 	id = requestAnimationFrame(render);
    //}

}

function quad(a, b, c, d)
{
    var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5, -0.5, 1.0 )
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        // colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vec4(1.0, 1.0, 1.0, 1.0));

    }
}







//  --- Helper Functions --- //

function clearInputValue() {
    let input = document.getElementById("fileSelector");
    input.value = "";
}

function reset() {
    fileContentsArray = [];
    vertexArray = [];
    drawingInstructions = [];
    points= [];
    colors = [];

    // Clear buffer array to clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    console.clear();
}

function parseLine(lineToParse) {
    return lineToParse.match(/\S+/g);
}