var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

/*****************************Detect Devices*********************************************/

var gamepadApi = {
    connected: false,
    type: '',
    platform: '',
    buttons: [],
    axes: [],
    gear: 1
};

var forwardVector;
var rightVector;
var brake;
var gear;


/******* Add the create scene function ******/
var createScene = function() {
    var scene = new BABYLON.Scene(engine);

    var meshes = {};
    var listOfMeshes = [];

    var isVehicleReady = false;
    var isRoadReady = false;
    var switchCam = true;

    // camera
    var camera = new BABYLON.ArcRotateCamera("camera1",  0, 0, 10, new BABYLON.Vector3(-2.5, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(11.5, 2.5, 0));
    camera.upperBetaLimit = (Math.PI / 2);
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 100;
    camera.attachControl(canvas, true);

    var camera2 = new BABYLON.UniversalCamera("camera2", new BABYLON.Vector3(-4, 3.2, -1.3), scene);
    camera2.setTarget(new BABYLON.Vector3(-5, 3.2, -1.3));

    // camera.attachControl(canvas, true);
    scene.activeCamera = camera;

    // lights
    var light1 = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(1, 2, 0), scene);
    var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 1, 0), scene);
    light2.intensity = 0.75;

    // skybox
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:10000.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/bluecloud", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    // loading assets
    var assetsManager = new BABYLON.AssetsManager(scene);
    var meshTask = assetsManager.addMeshTask("", "", "meshes/car/", "dong-feng.babylon");
    var roadTask = assetsManager.addMeshTask("", "", "meshes/road/", "road.babylon");

    meshTask.onSuccess = function (task) {
        task.loadedMeshes.forEach(function (mesh) {
            meshes[mesh.id] = mesh;
        });
        isVehicleReady = true;
        isAllMeshReady();
    };

    roadTask.onSuccess = function (task) {
        task.loadedMeshes.forEach(function (mesh) {
            meshes[mesh.id] = mesh;
        });
        isRoadReady = true;
        isAllMeshReady();
    };

    assetsManager.load();

    function isAllMeshReady(){
        if (isVehicleReady){
            createVehicle();
        }
    }


    function createVehicle() {
        /***************************Car*********************************************/

        /*-----------------------Car Body------------------------------------------*/
        var carBody = meshes["car"];

        camera.parent = carBody;
        camera2.parent = carBody;

        /*-----------------------End Car Body------------------------------------------*/

        /*-----------------------Steering Wheel--------------------------------------*/

        var pivotSW = new BABYLON.Mesh("pivotSW", scene);
        pivotSW.parent = carBody;
        pivotSW.rotate(BABYLON.Axis.Z, Math.PI / 12, BABYLON.Space.LOCAL);
        pivotSW.position = new BABYLON.Vector3(-6, 2.3, -1.5);

        var steering_wheel = meshes["steering_wheel"];
        steering_wheel.parent = pivotSW;

        /*-----------------------End Steering Wheel--------------------------------------*/

        /*-----------------------Wheel------------------------------------------*/

        var wheelFI = meshes["pneu_left"];
        var wheelFO = meshes["pneu_right"];

        //rotate wheel so tread in xz plane
        wheelFI.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD);
        wheelFO.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD);
        /*-----------------------End Wheel------------------------------------------*/

        /*-------------------Pivots for Front Wheels-----------------------------------*/
        var pivotFI = new BABYLON.Mesh("pivotFI", scene);
        pivotFI.parent = carBody;
        pivotFI.position = new BABYLON.Vector3(-9.4, 0, -2.8);

        var pivotFO = new BABYLON.Mesh("pivotFO", scene);
        pivotFO.parent = carBody;
        pivotFO.position = new BABYLON.Vector3(-9.4, 0, 2.8);
        /*----------------End Pivots for Front Wheels--------------------------------*/

        /*------------Create other Wheels as Instances, Parent and Position----------*/
        // var wheelFO = wheelFI.createInstance("FO");
        wheelFO.parent = pivotFO;
        wheelFO.position = new BABYLON.Vector3(0, 0, 0);

        var wheelRI = wheelFI.createInstance("RI");
        wheelRI.parent = carBody;
        wheelRI.position = new BABYLON.Vector3(0, 0, -2.8);

        var wheelRO = wheelFO.createInstance("RO");
        wheelRO.parent = carBody;
        wheelRO.position = new BABYLON.Vector3(0, 0, 2.8);

        wheelFI.parent = pivotFI;
        wheelFI.position = new BABYLON.Vector3(0, 0, 0);
        /*------------End Create other Wheels as Instances, Parent and Position----------*/

        /*---------------------Create Car Centre of Rotation-----------------------------*/
        var pivot = new BABYLON.Mesh("pivot", scene); //current centre of rotation
        pivot.position.z = 350;
        carBody.parent = pivot;
        carBody.position = new BABYLON.Vector3(0, 0, -50);

        /*---------------------End Create Car Centre of Rotation-------------------------*/


        /*************************** End Car*********************************************/


        /*****************************Add Ground********************************************/

        var groundSizeWidth = 3000;
        var groundSizeHeight = 1000;

        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: groundSizeWidth, height: groundSizeHeight}, scene);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.826, 0.706, 0.549);
        ground.material = groundMaterial;
        ground.position = new BABYLON.Vector3(0, -1.4, 0);

        /*****************************End Add Ground********************************************/

        /*****************************Path Road********************************************/

        var points = [];
        var n = 50; // number of points - more points the slower the car
        var ra = 300; //radius
        var offsetX = 1000;

        points.push(new BABYLON.Vector3(0, 0.2, ra));
        for (let i = 0; i < n + 1; i++) {
            points.push(new BABYLON.Vector3((ra * Math.sin(Math.PI * (1 / n) * i) + offsetX), 0.2, ra * Math.cos(Math.PI * (1 / n) * i)));
        }
        // points.push(new BABYLON.Vector3(points[points.length-1]-offsetX, 0, -r));
        for (let i = 0; i < n + 1; i++) {
            points.push(new BABYLON.Vector3((ra * -Math.sin(Math.PI * (1 / n) * i) - offsetX), 0.2, ra * -Math.cos(Math.PI * (1 / n) * i)));
        }
        points.push(new BABYLON.Vector3(0, 0.2, ra));

        var track = BABYLON.MeshBuilder.CreateLines('track', {points: points}, scene);
        track.color = new BABYLON.Color3(1, 0, 0);

        /*****************************End Path Road********************************************/

        /*****************************Road********************************************/

        var straightRoadRight = meshes["straight_road"];
        var straightRoadLeft = straightRoadRight.createInstance();

        straightRoadRight.position = new BABYLON.Vector3(0, -1.3, 285);
        straightRoadLeft.position = new BABYLON.Vector3(0, -1.3, -285);
        // straightRoadRight.scaling.z = 0.8;

        var roundRoadUp = meshes["round_road"];
        var roundRoadDown = roundRoadUp.createInstance();

        roundRoadUp.position = new BABYLON.Vector3(-1285, -1.3, 0);
        roundRoadDown.rotation.y = Math.PI;
        roundRoadDown.position = new BABYLON.Vector3(1285, -1.3, 0);


        /*****************************End Road********************************************/

        /*****************************Particles to Show Movement********************************************/
        // var box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
        // box.position = new BABYLON.Vector3(20, 0, 10);
        //
        //
        // var boxesSPS = new BABYLON.SolidParticleSystem("boxes", scene, {updatable: false});
        //
        // //function to position of grey boxes
        // var set_boxes = function (particle, i, s) {
        //     particle.position = new BABYLON.Vector3(-200 + Math.random() * 400, 0, -200 + Math.random() * 400);
        // };
        //
        // //add 400 boxes
        // boxesSPS.addShape(box, 400, {positionFunction: set_boxes});
        // var boxes = boxesSPS.buildMesh(); // mesh of boxes
        // boxes.material = new BABYLON.StandardMaterial("", scene);
        // boxes.material.alpha = 0.25;
        /*****************************Particles to Show Movement********************************************/


        /****************************Key Controls************************************************/

        var map = {}; //object for multiple key presses
        scene.actionManager = new BABYLON.ActionManager(scene);

        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            if ((map["v"] || map["V"]) && switchCam) {
                scene.activeCamera = camera2;
            }else{
                scene.activeCamera = camera;
            }
            switchCam = !switchCam;
        }));

        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));

        /****************************End Key Controls************************************************/


        /****************************Variables************************************************/

        var theta = 0;
        var deltaTheta = 0;
        var sw = Math.PI/19;
        var D = 0; //distance translated per second
        var R = 50; //turning radius, initial set at pivot z value
        var NR; //Next turning radius on wheel turn
        var A = 4; // axel length
        var L = 4; //distance between wheel pivots
        var r = 1.5; // wheel radius
        var psi, psiRI, psiRO, psiFI, psiFO; //wheel rotations
        var phi; //rotation of car when turning

        var F; // frames per second

        const maxForwardSpeed = 50;
        const maxBrakeSpeed = maxForwardSpeed / 4;

        const turnBorder = Math.PI / 6;

        /****************************End Variables************************************************/


        /****************************Animation******************************************************/
        scene.registerBeforeRender(function () {
            updateGamepad(navigator.getGamepads()[0], D);
            if (gamepadApi.type === 'joystick') {
                // console.log("W="+gamepadApi.axes[0]);
                // console.log("F="+gamepadApi.axes[1]);
                // console.log("B="+gamepadApi.axes[2]);
                // console.log("G="+gamepadApi.gear);
                rightVector = gamepadApi.axes[0] * turnBorder;
                forwardVector = gamepadApi.axes[1] * maxForwardSpeed;
                brake = gamepadApi.axes[2] * maxBrakeSpeed;
                gear = gamepadApi.gear;

            } else if (gamepadApi.type === 'wheel') {
                rightVector = (gamepadApi.axes[0].toFixed(2)) * turnBorder;
                forwardVector = (gamepadApi.axes[1].toFixed(2)) * maxForwardSpeed;
                brake = (gamepadApi.axes[2].toFixed(2)) * maxBrakeSpeed;
                gear = gamepadApi.gear;
            }
        });

        scene.registerAfterRender(function () {
            F = engine.getFps();

            /** Forward, Backward movement for wheel**/
            if (forwardVector > 0 && D * gear < forwardVector) {
                if (gear === 1) {
                    D += 1;
                } else if (gear === -1) {
                    D -= 1;
                }
                console.log("Speed UP/DOWN");
            }
            if (D >= 0 && brake > 0) {
                if (D - brake < 0) {
                    D = 0;
                } else {
                    D -= brake;
                }
                console.log("BRAKE");
            }
            if (D < 0 && brake > 0) {
                if (Math.abs(D) - brake < 0) {
                    D = 0;
                } else {
                    D += brake;
                }
                console.log("BRAKE");
            }

            // if ((map["w"] || map["W"]) && D < maxForwardSpeed) {
            //     D += 1;
            // }
            //
            // if ((map["s"] || map["S"]) && D > -maxForwardSpeed) {
            //     D -= 1;
            // }

            if (!(map["w"] || map["W"]) && !(map["s"] || map["S"]) && D !== 0 && forwardVector === 0) {
                if (D > 0.05)
                    D -= 0.05;
                else if (D < -0.05)
                    D += 0.05;
                else
                    D = 0;
            }

            // if(!(map["a"] || map["A"]) && !(map["d"] || map["D"]) && rightVector===0 && theta !== 0) {
            //     if (theta > 0)
            //         deltaTheta = -Math.PI/252;
            //     else if (theta < 0)
            //         deltaTheta = Math.PI/252;
            //     theta += deltaTheta;
            //     pivotFI.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
            //     pivotFO.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
            //     if(Math.abs(theta) > 0.00000001) {
            //         NR = A/2 +L/Math.tan(theta);
            //     }
            //     else {
            //         theta = 0;
            //         NR = 0;
            //     }
            //     pivot.translate(BABYLON.Axis.Z, NR - R, BABYLON.Space.LOCAL);
            //     carBody.translate(BABYLON.Axis.Z, R - NR, BABYLON.Space.LOCAL);
            //     R = NR;
            // }


            var distance = D / F;
            psi = D / (r * F);

            if (rightVector < 0.0 && rightVector < theta) {

                deltaTheta = -Math.PI / 252;
                theta += deltaTheta;
                pivotFI.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
                pivotFO.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
                pivotSW.rotate(BABYLON.Axis.X, deltaTheta - sw, BABYLON.Space.LOCAL);
                if (Math.abs(theta) > 0.00000001) {
                    NR = A / 2 + L / Math.tan(theta);
                } else {
                    theta = 0;
                    NR = 0;
                }
                pivot.translate(BABYLON.Axis.Z, NR - R, BABYLON.Space.LOCAL);
                carBody.translate(BABYLON.Axis.Z, R - NR, BABYLON.Space.LOCAL);
                R = NR;

            }

            if (rightVector <= 0.0 && rightVector > theta) {

                deltaTheta = Math.PI / 252;
                theta += deltaTheta;
                pivotFI.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
                pivotFO.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
                pivotSW.rotate(BABYLON.Axis.X, deltaTheta + sw, BABYLON.Space.LOCAL);
                if (Math.abs(theta) > 0.00000001) {
                    NR = A / 2 + L / Math.tan(theta);
                } else {
                    theta = 0;
                    NR = 0;
                }
                pivot.translate(BABYLON.Axis.Z, NR - R, BABYLON.Space.LOCAL);
                carBody.translate(BABYLON.Axis.Z, R - NR, BABYLON.Space.LOCAL);
                R = NR;

            }

            if (rightVector > 0.0 && rightVector > theta) {

                deltaTheta = Math.PI / 252;
                theta += deltaTheta;
                pivotFI.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
                pivotFO.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
                pivotSW.rotate(BABYLON.Axis.X, deltaTheta + sw, BABYLON.Space.LOCAL);
                if (Math.abs(theta) > 0.00000001) {
                    NR = A / 2 + L / Math.tan(theta);
                } else {
                    theta = 0;
                    NR = 0;
                }
                pivot.translate(BABYLON.Axis.Z, NR - R, BABYLON.Space.LOCAL);
                carBody.translate(BABYLON.Axis.Z, R - NR, BABYLON.Space.LOCAL);
                R = NR;

            }

            if (rightVector >= 0.0 && rightVector < theta) {

                deltaTheta = -Math.PI / 252;
                theta += deltaTheta;
                pivotFI.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
                pivotFO.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
                pivotSW.rotate(BABYLON.Axis.X, deltaTheta - sw, BABYLON.Space.LOCAL);
                if (Math.abs(theta) > 0.00000001) {
                    NR = A / 2 + L / Math.tan(theta);
                } else {
                    theta = 0;
                    NR = 0;
                }
                pivot.translate(BABYLON.Axis.Z, NR - R, BABYLON.Space.LOCAL);
                carBody.translate(BABYLON.Axis.Z, R - NR, BABYLON.Space.LOCAL);
                R = NR;

            }

            // if((map["a"] || map["A"]) && -Math.PI/6 < theta) {
            //
            //     deltaTheta = -Math.PI/252;
            //     theta += deltaTheta;
            //     pivotFI.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
            //     pivotFO.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
            //     if(Math.abs(theta) > 0.00000001) {
            //         NR = A/2 +L/Math.tan(theta);
            //     }
            //     else {
            //         theta = 0;
            //         NR = 0;
            //     }
            //     pivot.translate(BABYLON.Axis.Z, NR - R, BABYLON.Space.LOCAL);
            //     carBody.translate(BABYLON.Axis.Z, R - NR, BABYLON.Space.LOCAL);
            //     R = NR;
            // }
            //
            // if((map["d"] || map["D"])  && theta < Math.PI/6) {
            //
            //     deltaTheta = Math.PI/252;
            //     theta += deltaTheta;
            //     pivotFI.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
            //     pivotFO.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
            //     if(Math.abs(theta) > 0.00000001) {
            //         NR = A/2 +L/Math.tan(theta);
            //     }
            //     else {
            //         theta = 0;
            //         NR = 0;
            //     }
            //     pivot.translate(BABYLON.Axis.Z, NR - R, BABYLON.Space.LOCAL);
            //     carBody.translate(BABYLON.Axis.Z, R - NR, BABYLON.Space.LOCAL);
            //     R = NR;
            // }

            // if(D > 0) {
            phi = D / (R * F);

            if (theta < 0) {
                pivot.rotate(BABYLON.Axis.Y, phi, BABYLON.Space.WORLD);
                psiRI = D / (r * F);
                psiRO = D * (R + A) / (r * F);
                psiFI = D * Math.sqrt(R * R + L * L) / (r * F);
                psiFO = D * Math.sqrt((R + A) * (R + A) + L * L) / (r * F);

                wheelFI.rotate(BABYLON.Axis.Y, psiFI, BABYLON.Space.LOCAL);
                wheelFO.rotate(BABYLON.Axis.Y, psiFO, BABYLON.Space.LOCAL);
                wheelRI.rotate(BABYLON.Axis.Y, psiRI, BABYLON.Space.LOCAL);
                wheelRO.rotate(BABYLON.Axis.Y, psiRO, BABYLON.Space.LOCAL);
            } else if (theta > 0) {
                pivot.rotate(BABYLON.Axis.Y, phi, BABYLON.Space.WORLD);
                psiRI = D / (r * F);
                psiRO = D * (R + A) / (r * F);
                psiFI = D * Math.sqrt(R * R + L * L) / (r * F);
                psiFO = D * Math.sqrt((R + A) * (R + A) + L * L) / (r * F);

                wheelFI.rotate(BABYLON.Axis.Y, psiFO, BABYLON.Space.LOCAL);
                wheelFO.rotate(BABYLON.Axis.Y, psiFI, BABYLON.Space.LOCAL);
                wheelRI.rotate(BABYLON.Axis.Y, psiRO, BABYLON.Space.LOCAL);
                wheelRO.rotate(BABYLON.Axis.Y, psiRI, BABYLON.Space.LOCAL);
            } else {

                pivot.translate(BABYLON.Axis.X, -distance, BABYLON.Space.LOCAL);
                wheelFI.rotate(BABYLON.Axis.Y, psi, BABYLON.Space.LOCAL);
                wheelFO.rotate(BABYLON.Axis.Y, psi, BABYLON.Space.LOCAL);
                wheelRI.rotate(BABYLON.Axis.Y, psi, BABYLON.Space.LOCAL);
                wheelRO.rotate(BABYLON.Axis.Y, psi, BABYLON.Space.LOCAL);
            }
            // }
            // console.log('Theta -> '+theta+'\nRightVector -> '+rightVector);
        });
    }
    /****************************End Animation************************************************/

    return scene;
};
/******* End of the create scene function ******/

var scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});