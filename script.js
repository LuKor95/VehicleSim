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

    var isVehicleReady = false;
    var isRoadReady = false;
    var isBotReady = false;
    var switchCam = true;

    // cameras
    var camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 20, new BABYLON.Vector3(-2.5, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(18.5, 5.5, 0));
    camera.upperBetaLimit = (Math.PI / 2);
    camera.lowerBetaLimit = (Math.PI / 4);
    camera.lowerRadiusLimit = 15;
    camera.upperRadiusLimit = 60;
    camera.attachControl(canvas, true);

    var camera2 = new BABYLON.UniversalCamera("camera2", new BABYLON.Vector3(-4, 3.2, -1.3), scene);
    camera2.setTarget(new BABYLON.Vector3(-5, 3.2, -1.3));
    scene.activeCamera = camera;

    // lights
    var light1 = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(1, 2, 0), scene);
    var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 1, 0), scene);
    light2.intensity = 0.75;

    // skybox
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size: 5000.0}, scene);
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
    var roadTask = assetsManager.addMeshTask("", "", "meshes/road/", "road.babylon");
    var botTask = assetsManager.addMeshTask("", "", "meshes/bus/", "bus.babylon");
    var meshTask = assetsManager.addMeshTask("", "", "meshes/car/", "dong-feng.babylon");

    roadTask.onSuccess = function (task) {
        task.loadedMeshes.forEach(function (mesh) {
            meshes[mesh.id] = mesh;
        });
        isRoadReady = true;
        isAllMeshReady();
    };

    botTask.onSuccess = function (task) {
        task.loadedMeshes.forEach(function (mesh) {
            meshes[mesh.id] = mesh;
        });
        isBotReady = true;
        isAllMeshReady();
    };

    meshTask.onSuccess = function (task) {
        task.loadedMeshes.forEach(function (mesh) {
            meshes[mesh.id] = mesh;
        });
        isVehicleReady = true;
        isAllMeshReady();
    };

    assetsManager.load();


    function isAllMeshReady(){
        if (isRoadReady && isBotReady && isVehicleReady){
            renderScene();
        }
    }

    function renderScene() {

        /*****************************Ground********************************************/

        var groundSizeWidth = 3000;
        var groundSizeHeight = 1000;

        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: groundSizeWidth, height: groundSizeHeight}, scene);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.698, 0.624, 0.529);
        ground.material = groundMaterial;
        ground.position = new BABYLON.Vector3(0, -1.4, 0);

        /*****************************Add Ground********************************************/

        /*****************************Path Road********************************************/

        // var points = [];
        // var n = 50; // number of points - more points the slower the car
        // var ra = 300; //radius
        // var offsetX = 1000;
        //
        // points.push(new BABYLON.Vector3(0, 0.2, ra));
        // for (let i = 0; i < n + 1; i++) {
        //     points.push(new BABYLON.Vector3((ra * Math.sin(Math.PI * (1 / n) * i) + offsetX), 0.2, ra * Math.cos(Math.PI * (1 / n) * i)));
        // }
        // // points.push(new BABYLON.Vector3(points[points.length-1]-offsetX, 0, -r));
        // for (let i = 0; i < n + 1; i++) {
        //     points.push(new BABYLON.Vector3((ra * -Math.sin(Math.PI * (1 / n) * i) - offsetX), 0.2, ra * -Math.cos(Math.PI * (1 / n) * i)));
        // }
        // points.push(new BABYLON.Vector3(0, 0.2, ra));
        //
        // var track = BABYLON.MeshBuilder.CreateLines('track', {points: points}, scene);
        // track.color = new BABYLON.Color3(1, 0, 0);

        /*****************************End Path Road********************************************/

        /*****************************Landscape********************************************/

        var planeMaterial = new BABYLON.StandardMaterial("bg_wall", scene);
        planeMaterial.diffuseTexture = new BABYLON.Texture("textures/mountain/mountain.png", scene);
        planeMaterial.emissiveTexture = new BABYLON.Texture("textures/mountain/mountain.png", scene);

        planeMaterial.diffuseTexture.hasAlpha = true;
        planeMaterial.emissiveTexture.hasAlpha = true;
        planeMaterial.diffuseTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        planeMaterial.diffuseTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
        planeMaterial.emissiveTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        planeMaterial.emissiveTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

        var planeMaterialInverse = new BABYLON.StandardMaterial("bg_wall", scene);
        planeMaterialInverse.diffuseTexture = new BABYLON.Texture("textures/mountain/mountain-inverse.png", scene);
        planeMaterialInverse.emissiveTexture = new BABYLON.Texture("textures/mountain/mountain-inverse.png", scene);

        planeMaterialInverse.diffuseTexture.hasAlpha = true;
        planeMaterialInverse.emissiveTexture.hasAlpha = true;
        planeMaterialInverse.diffuseTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        planeMaterialInverse.diffuseTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
        planeMaterialInverse.emissiveTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        planeMaterialInverse.emissiveTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

        var backgroundMeshes = [];

        function createBackGroundView(name, material, width, height, rotation, position) {
            var backgroundPlane = BABYLON.MeshBuilder.CreatePlane(name, {width: width, height: height}, scene);
            backgroundPlane.material = material;
            if (rotation !== 0) {
                backgroundPlane.rotation = rotation;
            }
            backgroundPlane.position = position;
            backgroundMeshes.push(backgroundPlane);
        }

        createBackGroundView("bg_front", planeMaterialInverse, 1000, 100, new BABYLON.Vector3(0, -Math.PI / 2, 0), new BABYLON.Vector3(-groundSizeWidth / 2, 0, 0));
        createBackGroundView("bg_back", planeMaterial, 1000, 100, new BABYLON.Vector3(0, Math.PI / 2, 0), new BABYLON.Vector3(groundSizeWidth / 2, 0, 0));
        createBackGroundView("bg_right_a", planeMaterialInverse, 1500, 100, 0, new BABYLON.Vector3(groundSizeWidth/4, 0, groundSizeHeight/2));
        createBackGroundView("bg_right_b", planeMaterial, 1500, 100, 0, new BABYLON.Vector3(-groundSizeWidth/4, 0, groundSizeHeight/2));
        createBackGroundView("bg_left_a", planeMaterialInverse, 1500, 100, new BABYLON.Vector3(0, Math.PI, 0), new BABYLON.Vector3(groundSizeWidth/4, 0, -groundSizeHeight/2));
        createBackGroundView("bg_left_b", planeMaterial, 1500, 100, new BABYLON.Vector3(0, Math.PI, 0), new BABYLON.Vector3(-groundSizeWidth/4, 0, -groundSizeHeight/2));

        var landscape = BABYLON.Mesh.MergeMeshes(backgroundMeshes, true, true, undefined, false, true);
        landscape.position.y = 48;

        /*****************************End Landscape********************************************/

        /*****************************Road********************************************/

        var roadWidth = 1000;   // width of road
        var roadHeight = 300;   // height of road
        var roadHigh = -1.3;

        var straightRoadRight = meshes["straight_road"];
        var straightRoadLeft = straightRoadRight.createInstance();

        straightRoadRight.position = new BABYLON.Vector3(0, roadHigh, 285);
        straightRoadLeft.position = new BABYLON.Vector3(0, roadHigh, -285);
        // straightRoadRight.scaling.z = 0.8;

        var roundRoadUp = meshes["round_road"];
        var roundRoadDown = roundRoadUp.createInstance();

        roundRoadUp.position = new BABYLON.Vector3(-1285, roadHigh, 0);
        roundRoadDown.rotation.y = Math.PI;
        roundRoadDown.position = new BABYLON.Vector3(1285, roadHigh, 0);


        /*****************************End Road********************************************/

        /*****************************Car Station********************************************/

        var carStationMat = new BABYLON.StandardMaterial("car_station", scene);
        carStationMat.diffuseTexture = new BABYLON.Texture("textures/road/car-station.jpg", scene);

        var carStation = BABYLON.MeshBuilder.CreateGround("car_station", {width: 45, height: 15}, scene);
        carStation.position = new BABYLON.Vector3(-10, roadHigh, 322.5);
        carStation.material = carStationMat;

        /*****************************End Car Station********************************************/

        /*****************************Trees********************************************/

        var spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "textures/tree/tree.png", 500, {width: 1024, height: 914}, scene);

        //We create 2000 trees at random positions
        for (let i = 0; i < 300; i++) {
            var tree = new BABYLON.Sprite("tree", spriteManagerTrees);
            tree.position.x = Math.random() * 2001 - 1000;
            tree.position.z = Math.random() * 501 - 250;
            tree.position.y = 7.5;
            tree.size = 20;
        }
        for (let i = 0; i < 100; i++) {
            var tree = new BABYLON.Sprite("tree", spriteManagerTrees);
            tree.position.x = Math.random() * 2001 - 1000;
            tree.position.z = Math.random() * 151 + 340;
            tree.position.y = 7.5;
            tree.size = 20;
        }
        for (let i = 0; i < 100; i++) {
            var tree = new BABYLON.Sprite("tree", spriteManagerTrees);
            tree.position.x = Math.random() * 2001 - 1000;
            tree.position.z = Math.random() * -151 - 320;
            tree.position.y = 7.5;
            tree.size = 20;
        }
        /*****************************End Trees********************************************/

        /**************************** Bot ************************************************/

        var turnAngle = Math.PI / 589; // Math.PI / 235.49;   // radius of turning bot
        var speedCar = 0.8;     // speed of bot

        var botVehicles = [];
        var botVehiclesCorrection = [];
        var sumAngle = [];
        var turnInterval = [];

        function createBots(mesh, distance, count){
            for (let i = 0; i < count; i++) {
                var cloneBot = mesh.clone();
                cloneBot.position.x = i * distance;
                botVehicles[i] = cloneBot;
                botVehiclesCorrection[i] = false;
                sumAngle[i] = 0;
                turnInterval[i] = 0;
            }
            mesh.setEnabled(false);
        }

        function startBotMoving(botIndex) {

            if (botVehicles[botIndex].position.x > -roadWidth && botVehicles[botIndex].position.x < roadWidth && botVehicles[botIndex].position.z > 0) {
                if (botVehiclesCorrection[botIndex] === true){
                    botVehicles[botIndex].rotate(BABYLON.Axis.Y, -(sumAngle[botIndex]+Math.PI), BABYLON.Space.LOCAL);
                    botVehicles[botIndex].position.x = roadWidth;
                    botVehicles[botIndex].position.z = roadHeight;

                    sumAngle[botIndex] = 0;
                    botVehiclesCorrection[botIndex] = false;
                }

                botVehicles[botIndex].translate(BABYLON.Axis.X, -speedCar, BABYLON.Space.LOCAL);
                botVehicles[botIndex].position.x = Math.round(botVehicles[botIndex].position.x * 100) / 100;
                botVehicles[botIndex].position.z = Math.round(botVehicles[botIndex].position.z * 100) / 100;

                turnInterval[botIndex] = 0;

            }else if (botVehicles[botIndex].position.x <= -roadWidth || botVehicles[botIndex].position.x >= roadWidth){
                botVehiclesCorrection[botIndex] = true;

                if (turnInterval[botIndex] % 2 === 0){
                    botVehicles[botIndex].rotate(BABYLON.Axis.Y, -turnAngle, BABYLON.Space.LOCAL);
                    sumAngle[botIndex] += -turnAngle;
                }
                botVehicles[botIndex].translate(BABYLON.Axis.X, -speedCar, BABYLON.Space.LOCAL);

                turnInterval[botIndex] += 1;

            }else if (botVehicles[botIndex].position.x > -roadWidth && botVehicles[botIndex].position.x < roadWidth && botVehicles[botIndex].position.z < 0) {
                if (botVehiclesCorrection[botIndex] === true){
                    botVehicles[botIndex].rotate(BABYLON.Axis.Y, -(sumAngle[botIndex]+Math.PI), BABYLON.Space.LOCAL);
                    botVehicles[botIndex].position.x = -roadWidth;
                    botVehicles[botIndex].position.z = -roadHeight;

                    sumAngle[botIndex] = 0;
                    botVehiclesCorrection[botIndex] = false;
                }

                botVehicles[botIndex].translate(BABYLON.Axis.X, -speedCar, BABYLON.Space.LOCAL);
                botVehicles[botIndex].position.x = Math.round(botVehicles[botIndex].position.x * 100) / 100;
                botVehicles[botIndex].position.z = Math.round(botVehicles[botIndex].position.z * 100) / 100;

                turnInterval[botIndex] = 0;
            }

            var botWheels = botVehicles[botIndex].getChildMeshes();
            for (let i = 0; i < botWheels.length; i++){
                botWheels[i].rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.LOCAL);
            }
        }

        var botBody = meshes["bus"];
        var botRightFrontWheel = meshes["wheelA"];
        botRightFrontWheel.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD);
        var botRightRareWheel = botRightFrontWheel.createInstance();

        botRightFrontWheel.parent = botBody;
        botRightRareWheel.parent = botBody;

        botRightFrontWheel.position = new BABYLON.Vector3(-12.2, 0, 4);
        botRightRareWheel.position = new BABYLON.Vector3(12.2, 0, 4);

        var botLeftFrontWheel = meshes["wheelB"];
        botLeftFrontWheel.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD);

        var botLeftRareWheel = botLeftFrontWheel.createInstance();

        botLeftFrontWheel.parent = botBody;
        botLeftRareWheel.parent = botBody;

        botLeftFrontWheel.position = new BABYLON.Vector3(-12.2, 0, -5);
        botLeftRareWheel.position = new BABYLON.Vector3(12.2, 0, -5);

        botBody.position = new BABYLON.Vector3(-100, 0.5, 300);

        createBots(botBody, 100, 3);


        /**************************** End Bot ************************************************/

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
        pivot.position.z = 372.5;
        carBody.parent = pivot;
        carBody.position = new BABYLON.Vector3(0, 0, -50);

        /*---------------------End Create Car Centre of Rotation-------------------------*/

        /*************************** End Car*********************************************/

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
            if (botVehicles) {
                for (let i = 0; i < botVehicles.length; i++) {
                    startBotMoving(i);
                }
            }

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
            // else {
            //     forwardVector = 0;
            // }

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
        });
    }
    /****************************End Animation************************************************/

    return scene;
};
/******* End of the create scene function ******/

var scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});