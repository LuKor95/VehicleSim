var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var startButton = document.getElementById("startButton"); // Get the canvas element

var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

startButton.onclick = function () {
    startButton.remove();

    var scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });
};