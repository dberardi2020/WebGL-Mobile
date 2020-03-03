/**
 * Generates the mobile, sets up lighting and then starts render loop.
 * Also listens for key events and passes them to their handler
 */
function runProgram() {
    // Generate the elements for the mobile (semi-random)
    generateMobile();

    // Setup lighting
    setLighting();

    // Setup cube map
    setupCubeMapNoImages();
    setupCubeMapWithImages();

    // Start rendering
    render();

    window.onkeydown = function (event) {
        handleKeyPress(event.key);
    };
}