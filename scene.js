var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var forwardVector;
var rightVector;
var brake;
var gear;


/******* Create scene ******/

var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    var meshes = {};

    var isCarReady = false;
    var isRoadReady = false;
    var isBotReady = false;
    var switchCam = true;

    /******* Cameras ******/

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


    /******* Lights ******/

    var light1 = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(1, 2, 0), scene);
    var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 1, 0), scene);
    light2.intensity = 0.75;


    /******* Skybox ******/

    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size: 5000.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/bluecloud", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;


    /******* Loading assets ******/

    var assetsManager = new BABYLON.AssetsManager(scene);
    var roadTask = assetsManager.addMeshTask("", "", "meshes/road/", "road.babylon");
    var botTask = assetsManager.addMeshTask("", "", "meshes/bus/", "bus.babylon");
    var carTask = assetsManager.addMeshTask("", "", "meshes/car/", "dong-feng.babylon");

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

    carTask.onSuccess = function (task) {
        task.loadedMeshes.forEach(function (mesh) {
            meshes[mesh.id] = mesh;
        });
        isCarReady = true;
        isAllMeshReady();
    };

    assetsManager.load();


    function isAllMeshReady() {
        if (isRoadReady && isBotReady && isCarReady) {
            renderScene();
        }
    }

    function renderScene() {


        /******* Ground ******/

        var groundSizeWidth = 3000;
        var groundSizeHeight = 1000;

        var ground = BABYLON.MeshBuilder.CreateGround("ground", {
            width: groundSizeWidth,
            height: groundSizeHeight
        }, scene);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.698, 0.624, 0.529);
        ground.material = groundMaterial;
        ground.position = new BABYLON.Vector3(0, -1.4, 0);


        /******* Landscape ******/

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

        function createBackgroundView(name, material, width, height, rotation, position) {
            var backgroundPlane = BABYLON.MeshBuilder.CreatePlane(name, {width: width, height: height}, scene);
            backgroundPlane.material = material;
            if (rotation !== 0) {
                backgroundPlane.rotation = rotation;
            }
            backgroundPlane.position = position;
            backgroundMeshes.push(backgroundPlane);
        }

        createBackgroundView("bg_front", planeMaterialInverse, 1000, 200, new BABYLON.Vector3(0, -Math.PI / 2, 0), new BABYLON.Vector3(-groundSizeWidth / 2, 0, 0));
        createBackgroundView("bg_back", planeMaterial, 1000, 200, new BABYLON.Vector3(0, Math.PI / 2, 0), new BABYLON.Vector3(groundSizeWidth / 2, 0, 0));
        createBackgroundView("bg_right_a", planeMaterialInverse, 1500, 200, 0, new BABYLON.Vector3(groundSizeWidth / 4, 0, groundSizeHeight / 2));
        createBackgroundView("bg_right_b", planeMaterial, 1500, 200, 0, new BABYLON.Vector3(-groundSizeWidth / 4, 0, groundSizeHeight / 2));
        createBackgroundView("bg_left_a", planeMaterialInverse, 1500, 200, new BABYLON.Vector3(0, Math.PI, 0), new BABYLON.Vector3(groundSizeWidth / 4, 0, -groundSizeHeight / 2));
        createBackgroundView("bg_left_b", planeMaterial, 1500, 200, new BABYLON.Vector3(0, Math.PI, 0), new BABYLON.Vector3(-groundSizeWidth / 4, 0, -groundSizeHeight / 2));

        var landscape = BABYLON.Mesh.MergeMeshes(backgroundMeshes, true, true, undefined, false, true);
        landscape.position.y = 98;


        /******* Road ******/

        var roadWidth = 1000;   // width of road
        var roadHeight = 300;   // height of road
        var roadHigh = -1.3;

        var straightRoadRight = meshes["straight_road"];
        var straightRoadLeft = straightRoadRight.createInstance();

        straightRoadRight.position = new BABYLON.Vector3(0, roadHigh, 285);
        straightRoadLeft.position = new BABYLON.Vector3(0, roadHigh, -285);

        var roundRoadUp = meshes["round_road"];
        var roundRoadDown = roundRoadUp.createInstance();

        roundRoadUp.position = new BABYLON.Vector3(-1285, roadHigh, 0);
        roundRoadDown.rotation.y = Math.PI;
        roundRoadDown.position = new BABYLON.Vector3(1285, roadHigh, 0);


        /******* Car Station ******/

        var carStationMat = new BABYLON.StandardMaterial("car_station", scene);
        carStationMat.diffuseTexture = new BABYLON.Texture("textures/road/car-station.jpg", scene);

        var carStation = BABYLON.MeshBuilder.CreateGround("car_station", {width: 45, height: 15}, scene);
        carStation.position = new BABYLON.Vector3(-10, roadHigh, 322.5);
        carStation.material = carStationMat;


        /******* Trees ******/
        var spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "textures/tree/tree.png", 300, {
            width: 1024,
            height: 914
        }, scene);

        for (var i = 0; i < 200; i++) {
            var tree = new BABYLON.Sprite("tree", spriteManagerTrees);
            tree.position.x = Math.random() * 2001 - 1000;
            tree.position.z = Math.random() * 501 - 250;
            tree.position.y = 7.5;
            tree.size = 20;
        }
        for (var i = 0; i < 50; i++) {
            var tree = new BABYLON.Sprite("tree", spriteManagerTrees);
            tree.position.x = Math.random() * 2001 - 1000;
            tree.position.z = Math.random() * 151 + 340;
            tree.position.y = 7.5;
            tree.size = 20;
        }
        for (var i = 0; i < 50; i++) {
            var tree = new BABYLON.Sprite("tree", spriteManagerTrees);
            tree.position.x = Math.random() * 2001 - 1000;
            tree.position.z = Math.random() * -151 - 320;
            tree.position.y = 7.5;
            tree.size = 20;
        }


        /******* Bot - mesh ******/

        var turnAngle = Math.PI / 589;  // radius of turning bot
        var speedCar = 0.8;             // speed of bot

        var botVehicles = [];
        var botVehiclesCorrection = [];
        var sumAngle = [];
        var turnInterval = [];

        // function createBots(mesh) {
        //     for (var i = 0; i < count; i++) {
        //         var cloneBot = mesh.clone();
        //         cloneBot.position.x = i * distance;
        //         botVehicles[i] = cloneBot;
        //         botVehiclesCorrection[i] = false;
        //         sumAngle[i] = 0;
        //         turnInterval[i] = 0;
        //     }
        //     mesh.setEnabled(false);
        // }

        function startBotMoving(botIndex) {
            if (botVehicles[botIndex].position.x > -roadWidth && botVehicles[botIndex].position.x < roadWidth && botVehicles[botIndex].position.z > 0) {
                if (botVehiclesCorrection[botIndex] === true) {
                    botVehicles[botIndex].rotate(BABYLON.Axis.Y, -(sumAngle[botIndex] + Math.PI), BABYLON.Space.LOCAL);
                    botVehicles[botIndex].position.x = roadWidth;
                    botVehicles[botIndex].position.z = roadHeight;

                    sumAngle[botIndex] = 0;
                    botVehiclesCorrection[botIndex] = false;
                }

                botVehicles[botIndex].translate(BABYLON.Axis.X, -speedCar, BABYLON.Space.LOCAL);
                botVehicles[botIndex].position.x = Math.round(botVehicles[botIndex].position.x * 100) / 100;
                botVehicles[botIndex].position.z = Math.round(botVehicles[botIndex].position.z * 100) / 100;

                turnInterval[botIndex] = 0;

            } else if (botVehicles[botIndex].position.x <= -roadWidth || botVehicles[botIndex].position.x >= roadWidth) {
                botVehiclesCorrection[botIndex] = true;

                if (turnInterval[botIndex] % 2 === 0) {
                    botVehicles[botIndex].rotate(BABYLON.Axis.Y, -turnAngle, BABYLON.Space.LOCAL);
                    sumAngle[botIndex] += -turnAngle;
                }
                botVehicles[botIndex].translate(BABYLON.Axis.X, -speedCar, BABYLON.Space.LOCAL);

                turnInterval[botIndex] += 1;

            } else if (botVehicles[botIndex].position.x > -roadWidth && botVehicles[botIndex].position.x < roadWidth && botVehicles[botIndex].position.z < 0) {
                if (botVehiclesCorrection[botIndex] === true) {
                    botVehicles[botIndex].rotate(BABYLON.Axis.Y, -(sumAngle[botIndex] + Math.PI), BABYLON.Space.LOCAL);
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
            for (var i = 0; i < botWheels.length; i++) {
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

        botBody.position = new BABYLON.Vector3(0, 0.5, 300);

        // createBots(botBody);
        for (var i = 0; i < botsStartPosition.length; i++) {
            var cloneBot = botBody.clone();
            cloneBot.position.x = botsStartPosition[i].x;
            cloneBot.position.z = botsStartPosition[i].z;
            cloneBot.rotation.y = botsStartPosition[i].r;

            botVehicles[i] = cloneBot;
            botVehiclesCorrection[i] = Math.abs(botsStartPosition[i].z) !== 300;
            sumAngle[i] = Math.abs(botsStartPosition[i].z) !== 300 ? botsStartPosition[i].r : 0;
            turnInterval[i] = 0;

            // console.log(botVehicles[i]);
            // console.log(botVehiclesCorrection[i]);
            // console.log(sumAngle[i]);
            // console.log(turnInterval[i]);
        }
        botBody.setEnabled(false);


        /******* Car ******/

            // Car Body
        var carBody = meshes["car"];

        camera.parent = carBody;
        camera2.parent = carBody;

        // Steering Wheel
        var pivotSW = new BABYLON.Mesh("pivotSW", scene);
        pivotSW.parent = carBody;
        pivotSW.rotate(BABYLON.Axis.Z, Math.PI / 12, BABYLON.Space.LOCAL);
        pivotSW.position = new BABYLON.Vector3(-6, 2.3, -1.5);

        var steering_wheel = meshes["steering_wheel"];
        steering_wheel.parent = pivotSW;

        // Wheels
        var wheelFI = meshes["pneu_left"];
        var wheelFO = meshes["pneu_right"];

        wheelFI.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD);
        wheelFO.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD);

        var pivotFI = new BABYLON.Mesh("pivotFI", scene);
        pivotFI.parent = carBody;
        pivotFI.position = new BABYLON.Vector3(-9.4, 0, -2.8);

        var pivotFO = new BABYLON.Mesh("pivotFO", scene);
        pivotFO.parent = carBody;
        pivotFO.position = new BABYLON.Vector3(-9.4, 0, 2.8);

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

        // Car centre of rotation
        var pivot = new BABYLON.Mesh("pivot", scene); //current centre of rotation
        // pivot.position.z = 372.5;
        pivot.position = new BABYLON.Vector3(carStartPosition.x, 0, carStartPosition.z + 50);
        pivot.rotate(BABYLON.Axis.Y, carStartPosition.r, BABYLON.Space.WORLD);
        carBody.parent = pivot;
        carBody.position = new BABYLON.Vector3(0, 0, -50);


        /******* Keyboard control ******/

        var map = {};
        scene.actionManager = new BABYLON.ActionManager(scene);

        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
        }));

        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";

            if (evt.sourceEvent.key === "v" || evt.sourceEvent.key === "V") {
                if (switchCam) {
                    scene.activeCamera = camera2;
                } else {
                    scene.activeCamera = camera;
                }
                switchCam = !switchCam;
            }
            if (evt.sourceEvent.key === "u" || evt.sourceEvent.key === "U") {
                saveCoord();
            }
        }));


        /******* Text at the top of screen ******/
        // ubuntu zle reagovalo na toto
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var stackPanel = new BABYLON.GUI.StackPanel();
        stackPanel.background = new BABYLON.Color3(0, 0, 0);
        stackPanel.width = "100%";
        stackPanel.height = "50px";
        stackPanel.isVertical = false;
        stackPanel.alpha = 0.8;
        stackPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        advancedTexture.addControl(stackPanel);

        var fpsText = new BABYLON.GUI.TextBlock();
        fpsText.width = "200px";
        fpsText.color = "white";
        fpsText.text = "Hello";
        fpsText.fontSize = 20;
        stackPanel.addControl(fpsText);

        var speedCarText = new BABYLON.GUI.TextBlock();
        speedCarText.width = "200px";
        speedCarText.color = "white";
        speedCarText.fontSize = 20;
        speedCarText.horizontalAlignment = 1;
        stackPanel.addControl(speedCarText);


        /******* Variables and function for animation ******/

        var theta = 0;
        var deltaTheta = Math.PI / 252;
        var swTheta = Math.PI / 19;
        var D = 0; //distance translated per second
        var R = 50; //turning radius, initial set at pivot z value
        var NR; //Next turning radius on wheel turn
        var A = 2; // axel length
        var L = 10; //distance between wheel pivots
        var r = 1.5; // wheel radius
        var psi, psiRI, psiRO, psiFI, psiFO; //wheel rotations
        var phi; //rotation of car when turning

        var F; // frames per second

        var maxForwardSpeed = 100;
        var maxBrakeSpeed = maxForwardSpeed / 50;

        var turnBorder = Math.PI / 6;


        function turnCar(deltaTheta, swTheta) {
            theta += deltaTheta;
            pivotFI.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
            pivotFO.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
            pivotSW.rotate(BABYLON.Axis.X, deltaTheta + swTheta, BABYLON.Space.LOCAL);
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


        /******* Animation ******/

        scene.registerBeforeRender(function () {
            F = engine.getFps();

            // rotate skybox
            skybox.rotate(BABYLON.Axis.Y, 0.0001, BABYLON.Space.LOCAL);

            // start moving bots on scene
            if (botVehicles) {
                for (var i = 0; i < botVehicles.length; i++) {
                    startBotMoving(i);
                }
            }

            // check if car is in scene
            for (var i = 0; i < backgroundMeshes.length; i++) {
                if (carBody.intersectsMesh(backgroundMeshes[i], false)) {
                    D = -D;
                    break;
                }
            }

            // checking gamepad event
            updateGamepad(navigator.getGamepads()[0], D);

            if (gamepadApi.type === "joystick" || gamepadApi.type === "wheel") {
                if (gamepadApi.type === "joystick") {
                    rightVector = gamepadApi.axes[0] * turnBorder;
                    forwardVector = gamepadApi.axes[1] * maxForwardSpeed;
                    brake = gamepadApi.axes[2] * maxBrakeSpeed;
                    gear = gamepadApi.gear;

                } else if (gamepadApi.type === "wheel") {
                    rightVector = (parseFloat(gamepadApi.axes[0].toFixed(2))) * turnBorder;
                    forwardVector = (parseFloat(gamepadApi.axes[1].toFixed(2))) * maxForwardSpeed;
                    brake = (parseFloat(gamepadApi.axes[2].toFixed(2))) * maxBrakeSpeed;
                    gear = gamepadApi.gear;
                }

                if (gear === -1) {
                    forwardVector /= 4;
                }

                if (forwardVector > 0 && D * gear < forwardVector) {
                    D += gear;
                }

                if (brake > 0 && (Math.abs(D) - brake) >= 0) {
                    if (D >= 0) {
                        D -= brake;
                    } else {
                        D += brake;
                    }
                }

                if (rightVector < 0.0 && rightVector < theta) {
                    turnCar(-deltaTheta, -swTheta);
                }

                if (rightVector <= 0.0 && rightVector > theta) {
                    turnCar(deltaTheta, swTheta);
                }

                if (rightVector > 0.0 && rightVector > theta) {
                    turnCar(deltaTheta, swTheta);
                }

                if (rightVector >= 0.0 && rightVector < theta) {
                    turnCar(-deltaTheta, -swTheta);
                }

            } else {
                if ((map["w"] || map["W"]) && D < maxForwardSpeed) {
                    D += 1;
                }

                if ((map["s"] || map["S"]) && D > -maxForwardSpeed / 4) {
                    D -= 1;
                }

                if ((map["a"] || map["A"]) && -Math.PI / 6 < theta) {
                    turnCar(-deltaTheta, -swTheta);
                }

                if ((map["d"] || map["D"]) && theta < Math.PI / 6) {
                    turnCar(deltaTheta, swTheta);
                }

                if (!(map["a"] || map["A"]) && !(map["d"] || map["D"]) && theta !== 0) {
                    if (theta > 0) {
                        turnCar(-deltaTheta, -swTheta);
                    } else if (theta < 0) {
                        turnCar(deltaTheta, swTheta);
                    }
                }
            }

            if (!(map["w"] || map["W"]) && !(map["s"] || map["S"]) && D !== 0) {
                if (D > 0.05)
                    D -= 0.05;
                else if (D < -0.05)
                    D += 0.05;
                else
                    D = 0;
            }

            var distance = D / F;
            psi = D / (r * F);
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

            // Update text info every frame
            fpsText.text = "FPS: " + F.toFixed(0);
            speedCarText.text = "Rýchlosť: " + Math.abs(D).toFixed(0) + " km/h";
        });

        // Set values to graphs
        var time = 0;

        setInterval(function () {

            var carPosition = wheelRI.getAbsolutePosition();
            var carPositionX = Math.round(carPosition.x * 100) / 100;
            var carPositionZ = (Math.round(carPosition.z * 100) / 100) + 2.8;

            traceCarPosition(carPositionX, carPositionZ);
            traceCarSpeed(D, time);
            traceBotsPosition(botVehicles);
            time += 200;

        }, 200);

    }

    return scene;
};

var scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});