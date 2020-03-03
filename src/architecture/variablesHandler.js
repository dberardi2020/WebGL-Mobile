// Strings for HTML
let description =
    "Keyboard Shortcuts:\n" +
    "\tM: Enable Flat Shading\n" +
    "\tm: Enable Gouraud Shading\n" +
    "\tP: Decrease spotlight\n" +
    "\tp: Increase spotlight\n" +
    "\tR: Generate new mobile\n" +
    "\tC: Toggle Reflection\n" +
    "\tD: Toggle Refraction\n";

// Projection variables
let eyeZ = 9;
const eye = vec3(0, 0, eyeZ);
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

// Matrices used for rotating within the mobile
const originCoords = vec3(eye[0] - at[0], eye[1] - at[1], eye[2] - at[2]);
const originCoordsInversion = vec3(-originCoords[0], -originCoords[1], -originCoords[2]);

// Program architecture
let canvas;
let gl;
let program;

// Graphics pipeline
let aspectRatio;
let projection;
let modelView;

// Graphics pipeline matrices
let modelViewMatrix, perspectiveMatrix;

// Arrays for storing/drawing our shapes
let spherePoints = [];
let sphereNormals = [];
let cubePoints = [];
let cubeNormals = [];

// Lighting variables and state
let spotlightAngle = 0.95;
let lightingTypes = {gouraud: "gouraud", flat: "flat"};
let lightingType = lightingTypes.gouraud; // start the simulation w/ gouraud shading

// The stack which handles the mobile hierarchy
let stack = [];

// Define colors for shapes in mobile
let red = vec4(1.0, 0.0, 0.0, 1.0);
let green = vec4(0.0, 1.0, 0.0, 1.0);
let yellow = vec4(1.0, 1.0, 0.0, 1.0);
let aqua = vec4(0.0, 1.0, 1.0, 1.0);
let orange = vec4(1.0, 0.5, 0.0, 1.0);
let pink = vec4(1.0, 0.1, 0.6, 1.0);
let purple = vec4(0.6, 0.4, 0.8, 1.0);
let colors = [red, green, yellow, aqua, orange, pink, purple];

// Define coordinates for layers
let topCoords =
    [
        {"x": 0.0, "y": 2.1, "z": 0.0}
    ];
let middleCoords =
    [
        {"x": 1.75, "y": 0.2, "z": 0.0},
        {"x": -1.75, "y": 0.2, "z": 0.0}
    ];
let bottomCoords =
    [
        {"x": 0.75, "y": -1.5, "z": 0.0},
        {"x": 2.75, "y": -1.5, "z": 0.0},
        {"x": -2.75, "y": -1.5, "z": 0.0},
        {"x": -0.75, "y": -1.5, "z": 0.0}
    ];

// Map for references of shapes used in program
let shapes = {sphere: "sphere", cube: "cube"};

// Array representation of shapes values
let shapesArray = Object.values(shapes);

// Map for each level, and corresponding number of elements in each
let mobileLevels = {top: 1, middle: 2, bottom: 4};

// Scales for each object in the mobile, used to get the right
// sizing and proportions for mobile elements
let topSphereScale = 0.7;
let topCubeScale = 1.1;
let divScale = 0.85;
let middleSphereScale = topSphereScale * divScale;
let middleCubeScale = topCubeScale * divScale;
let bottomSphereScale = middleSphereScale * divScale;
let bottomCubeScale = middleCubeScale * divScale;

// Arrays to hold elements on each of the three mobile levels
let topElement;
let middleElements = [];
let bottomElements = [];

/************** Cube Map and Texture Variables **************/

let cubeMap;

let envMapLinks = [
    "http://web.cs.wpi.edu/~jmcuneo/env_map_sides/nvnegx.bmp",
    "http://web.cs.wpi.edu/~jmcuneo/env_map_sides/nvnegy.bmp",
    "http://web.cs.wpi.edu/~jmcuneo/env_map_sides/nvnegz.bmp",
    "http://web.cs.wpi.edu/~jmcuneo/env_map_sides/nvposx.bmp",
    "http://web.cs.wpi.edu/~jmcuneo/env_map_sides/nvposy.bmp",
    "http://web.cs.wpi.edu/~jmcuneo/env_map_sides/nvposz.bmp",
];

let envMap = {
    "negX": new Image(),
    "negY": new Image(),
    "negZ": new Image(),
    "posX": new Image(),
    "posY": new Image(),
    "posZ": new Image(),
};

let envMapArray = Object.values(envMap);

let reflectionOn = false;
let refractionOn = false;

let refsToggle = {
    "bothOff": 0.0,
    "refractionOn": 1.0,
    "reflectionOn": 2.0,
    "bothOn": 3.0,
};
