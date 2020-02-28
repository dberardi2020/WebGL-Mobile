/**
 * Handles key presses
 * @param key: The key that was pressed
 */
function handleKeyPress(key) {
    switch (key) {
        case 'm':
            lightingType = lightingTypes.gouraud;
            console.log("Gouraud shading enabled");
            break;
        case 'M':
            lightingType = lightingTypes.flat;
            console.log("Flat shading enabled");
            break;
        case 'p':
            spotlightAngle += 0.01;
            console.log("Increasing spotlight angle");
            break;
        case 'P':
            spotlightAngle -= 0.01;
            console.log("Decreasing spotlight angle");
            break;
        case 'R':
            location.reload();
            break;
    }
}