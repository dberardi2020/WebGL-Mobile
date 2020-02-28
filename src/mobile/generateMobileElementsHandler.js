let colorPicker = colors;
let numSphere = 0;
let numCubes = 0;

/**
 * Generate mobile elements for each level
 */
function generateMobile() {
    generateMobileElements(mobileLevels.top);
    generateMobileElements(mobileLevels.middle);
    generateMobileElements(mobileLevels.bottom);
}

/**
 * Generate mobile element for any given level. Assigns coordinates
 * to each element based on there level in the mobile.  Puts finished
 * element into array for rendering later.
 * @param mobileLevel
 */
function generateMobileElements(mobileLevel) {
    let newElement;

    for (let i = 0; i < mobileLevel; i++) {
        newElement = generateSingleElement();
        newElement.scale = getScale(mobileLevel, newElement);

        switch (mobileLevel) {
            case mobileLevels.top:
                newElement.coordinates = topCoords[i];
                topElement = newElement;
                break;
            case mobileLevels.middle:
                newElement.coordinates = middleCoords[i];
                newElement.parent = topElement;
                middleElements.push(newElement);
                break;
            case mobileLevels.bottom:
                newElement.coordinates = bottomCoords[i];

                switch (i) {
                    case 0:
                    case 1:
                        newElement.parent = middleElements[0];
                        break;
                    case 2:
                    case 3:
                        newElement.parent = middleElements[1];
                        break;
                }

                bottomElements.push(newElement);
                break;
        }
    }
}

/**
 * Generates a single element for the mobile.  null fields filled in throughout the generation process
 * @returns {{parent: null, shape: null, color: null, rotation: number, coordinates: null, scale: null}}
 */
function generateSingleElement() {
    let newElement = {
        "rotation": 0,
        "shape": null,
        "coordinates": null,
        "color": null,
        "parent": null,
        "scale": null
    };

    newElement.color = getColor();
    newElement.shape = getShape();

    return newElement;
}

/**
 * Assigns a scale to an element based off of its shape and
 * level within the mobile.
 * @param mobileLevel
 * @param element
 * @returns {number}
 */
function getScale(mobileLevel, element) {
    switch (mobileLevel) {
        case mobileLevels.top:
            if (element.shape === shapes.sphere) {
                return topSphereScale;
            } else {
                return topCubeScale;
            }
        case mobileLevels.middle:
            if (element.shape === shapes.sphere) {
                return middleSphereScale;
            } else {
                return middleCubeScale;
            }
        case mobileLevels.bottom:
            if (element.shape === shapes.sphere) {
                return bottomSphereScale;
            } else {
                return bottomCubeScale;
            }
    }
}

/**
 * Returns a random color for each mobile element.  Maintains the
 * requirement that each element must be a different color
 * @returns {*}
 */
function getColor() {
    let colorIndex = Math.floor(Math.random() * colors.length);
    let color = colorPicker[colorIndex];

    colorPicker.splice(colorIndex, 1);

    return color;
}

/**
 * Returns a random shape for each mobile element.  Maintains the
 * requirements that there must be at least 3 spheres and 3 cubes
 * @returns {string}
 */
function getShape() {
    let shape;

    if (numSphere > 3) {
        shape = shapes.cube;
    } else if (numCubes > 3) {
        shape = shapes.sphere;
    } else {
        shape = shapesArray[Math.floor(Math.random() * shapesArray.length)];

        switch (shape) {
            case shapes.cube:
                numCubes++;
                break;
            case shapes.sphere:
                numSphere++;
                break;
        }
    }

    return shape;
}