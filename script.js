var canvas = document.getElementById("renderCanvas");
var startButton = document.getElementById("startButton");
var mainContent = document.getElementById("mainContent");

var engine = new BABYLON.Engine(canvas, true);

startButton.onclick = function () {
    mainContent.classList.add("d-none");

    var scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });
};