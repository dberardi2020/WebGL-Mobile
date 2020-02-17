// Keep track of which direction render should move/rotate, if any
// and its current offset in respect to its starting position
let translateX = {"pos": false, "neg": false, "offset": 0};
let translateY = {"pos": false, "neg": false, "offset": 0};
let translateZ = {"pos": false, "neg": false, "offset": 0};
let rotateXAxis = {"pos": false, "theta": 0};

// Keep track of pulse status, including whether it is enabled, its current offset,
// which direction it is currently pulsing and how many iterations it has pulsed
let pulse = {"pulseOn": false, "pulseOffset": 0, "pulseOut": false, "pulseCount": 0};

/**
 * Handles any key press
 * @param key: The key that was pressed
 */
function handleKeyPress(key) {
    // Disregard any shift key operations
    key.toLowerCase();

    switch (key) {
        // Toggle +x translation
        case "x":
            // If enabled, disable
            if(translateX.pos) {
                translateX.pos = false
            }
            // If disabled, disable -x translation
            // and enable +x translation
            else {
                translateX.neg = false;
                translateX.pos = true;
            }
            break;
        // Toggle -x translation
        case "c":
            // If enabled, disable
            if(translateX.neg) {
                translateX.neg = false;
            }
            // If disabled, disable +x translation
            // and enable -x translation
            else {
                translateX.pos = false;
                translateX.neg = true;
            }
            break;
        // Toggle +y translation
        case "y":
            // If enabled, disable
            if(translateY.pos) {
                translateY.pos = false;
            }
            // If disabled, disable -y translation
            // and enable +y translation
            else {
                translateY.neg = false;
                translateY.pos = true;
            }
            break;
        // Toggle -y translation
        case "u":
            // If enabled, disable
            if(translateY.neg) {
                translateY.neg = false;
            }
            // If disabled, disable +y translation
            // and enable -y translation
            else {
                translateY.pos = false;
                translateY.neg = true;
            }
            break;
        // Toggle +z translation
        case "z":
            // If enabled, disable
            if(translateZ.pos) {
                translateZ.pos = false;
            }
            // If disabled, disable -z translation
            // and enable +z translation
            else {
                translateZ.neg = false;
                translateZ.pos = true;
            }
            break;
        // Toggle -z translation
        case "a":
            // If enabled, disable
            if(translateZ.neg) {
                translateZ.neg = false;
            }
            // If disabled, disable +z translation
            // and enable -z translation
            else {
                translateZ.pos = false;
                translateZ.neg = true;
            }
            break;
        // Toggle +x rotation
        case "r":
            rotateXAxis.pos = !rotateXAxis.pos;
            break;
        // Toggle mesh pulse
        case "b":
            pulse.pulseOn = !pulse.pulseOn;
            break;
    }
}