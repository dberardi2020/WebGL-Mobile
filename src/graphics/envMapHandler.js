/**
 * Function used for drawing the wall. Uses the drawCube function
 * to create walls, and then textures/colors them appropriately
 */
function drawWalls() {
    let leftWall = {
        "coordinates": {"x": -7, "y": 3, "z": -6.5},
        "scale": {"x": 0.1, "y": 12, "z": 10},
        "color": vec4(0.0, 0.0, 1.0, 1.0)
    };

    let backWall = {
        "coordinates": {"x": 0, "y": 4, "z": -15},
        "scale": {"x": 24, "y": 16, "z": 0.1},
        "color": vec4(0.0, 0.0, 1.0, 1.0)
    };

    if (environmentMapOn) {
        gl.uniform1f(gl.getUniformLocation(program, 'vTextureSwitch'), envMapToggles.envMapStone);

        drawCube(leftWall);
        drawCube(backWall);

        setupTextureBuffer();

        let stones = new Image();
        stones.crossOrigin = "";
        stones.src = "http://web.cs.wpi.edu/~jmcuneo/stones.bmp";

        stones.onload = function () {
            configureTexture(stones, textures.stone);
        };

        texCoordsArray = [];

    } else {
        gl.uniform1f(gl.getUniformLocation(program, 'vTextureSwitch'), envMapToggles.envMapOff);

        drawCube(leftWall);
        drawCube(backWall);
    }
}

/**
 * Function used for drawing the floor. Uses the drawCube function
 * to create the floor, and then textures/colors it appropriately
 */
function drawFloor() {
    let floor = {
        "coordinates": {"x": 0, "y": -3.5, "z": -7},
        "scale": {"x": 25, "y": 0.1, "z": 15},
        "color": vec4(0.5, 0.5, 0.5, 1.0)
    };

    if (environmentMapOn) {
        gl.uniform1f(gl.getUniformLocation(program, 'vTextureSwitch'), envMapToggles.envMapGrass);

        drawCube(floor);

        setupTextureBuffer();

        let grass = new Image();
        grass.crossOrigin = "";
        grass.src = "http://web.cs.wpi.edu/~jmcuneo/grass.bmp";

        grass.onload = function () {
            configureTexture(grass, textures.grass);
        };

        texCoordsArray = [];

    } else {
        gl.uniform1f(gl.getUniformLocation(program, 'vTextureSwitch'), envMapToggles.envMapOff);
        drawCube(floor);
    }
}

/**
 * Function taken from class, modified to handle
 * the specific textures used in the project
 * @param image
 * @param textureType
 */
function configureTexture(image, textureType) {
    let texture = gl.createTexture();

    if (textureType === textures.stone) {
        gl.activeTexture(gl.TEXTURE0);
    } else if (textureType === textures.grass) {
        gl.activeTexture(gl.TEXTURE1);
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    if (textureType === textures.stone) {
        gl.uniform1i(gl.getUniformLocation(program, "stone"), textureType);
    } else if (textureType === textures.grass) {
        gl.uniform1i(gl.getUniformLocation(program, "grass"), textureType);
    }
}