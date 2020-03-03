let black = new Uint8Array([0, 0, 0, 255]);

function setupCubeMapNoImages() {
    setupCubeMap(false);
}

function setupCubeMapWithImages() {
    setImages();
    loadImages();
}

function setImages() {
    for (let i = 0; i < envMapLinks.length; i++) {
        envMapArray[i].crossOrigin = "";
        envMapArray[i].src = envMapLinks[i];
    }
}

function loadImages() {
    let totalImagesLoaded = 0;

    // Wait for all the images to be loaded
    envMapArray.forEach(function (img) {
        img.onload = function () {
            totalImagesLoaded++;

            // Once all images have loaded, configure the cube map images
            if (totalImagesLoaded === 6) {
                setupCubeMap(true);
            }
        };
    });
}

function texImage2D(withImages) {
    if (withImages) {
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, envMap.posX);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, envMap.negX);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, envMap.posY);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, envMap.negY);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, envMap.posZ);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, envMap.negZ);
    } else {
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, black);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, black);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, black);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, black);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, black);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, black);
    }
}

function setupCubeMap(withImages) {
    cubeMap = gl.createTexture();

    gl.activeTexture(gl.TEXTURE2);

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    texImage2D(withImages);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.uniform1i(gl.getUniformLocation(program, "texMap"), 2);
}

function handleRefs() {
    if(refractionOn && reflectionOn) {
        // console.log("Both");
        gl.uniform1f(gl.getUniformLocation(program, "vTextureSwitch"), refsToggle.bothOn);
    } else if(refractionOn) {
        gl.uniform1f(gl.getUniformLocation(program, "vTextureSwitch"), refsToggle.refractionOn);
    } else if(reflectionOn) {
        gl.uniform1f(gl.getUniformLocation(program, "vTextureSwitch"), refsToggle.reflectionOn);
    } else {
        gl.uniform1f(gl.getUniformLocation(program, "vTextureSwitch"), refsToggle.bothOff);
    }
}