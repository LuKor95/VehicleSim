var supportedPlatform = [
    {
        id: 0,
        name: 'Win32',
        type: 'windows'
    },
    {
        id: 1,
        name: 'Linux x86_64',
        type: 'linux'
    }
];

var supportedGamepad = [
    {
        id: 0,
        name: 'T.Flight Stick X',
        type: 'joystick'
    },
    {
        id: 1,
        name: 'G920 Driving Force',
        type: 'wheel'
    }
];

var axesSync = {
    joystick_windows: [0, 1, 6],
    joystick_linux: [0, 1, 3],
    wheel_windows: [0, 1, 2],
    wheel_linux: [0, 1, 2]
};

var gamepadApi = {
    connected: false,
    type: '',
    platform: '',
    buttons: [],
    axes: [],
    gear: 1
};

function detectUserPlatform() {
    for (var i = 0; i < supportedPlatform.length; i++) {
        if (window.navigator.platform === supportedPlatform[i].name) {
            return supportedPlatform[i].type;
        }
    }
    return null;
}

function detectUserGamepad(gamepad) {
    for (var i = 0; i < supportedGamepad.length; i++) {
        if (gamepad.id.includes(supportedGamepad[i].name)) {
            return supportedGamepad[i].type;
        }
    }
    return null;
}

function registerGamepad(gamepad) {
    gamepadApi.connected = gamepad.connected;
    gamepadApi.type = detectUserGamepad(gamepad);
    gamepadApi.platform = detectUserPlatform();
}

function updateGamepad(gamepad, distance) {
    if (gamepad && gamepadApi.connected && gamepadApi.type && gamepadApi.platform) {
        var axesGamepad = axesSync[gamepadApi.type + '_' + gamepadApi.platform];
        gamepadApi.buttons = gamepad.buttons;

        if (gamepadApi.type === 'joystick') {
            gamepadApi.axes[0] = parseFloat(gamepad.axes[axesGamepad[0]].toFixed(2));

            if (parseFloat(gamepad.axes[axesGamepad[1]].toFixed(2)) < 0) {
                gamepadApi.axes[1] = Math.abs(gamepad.axes[axesGamepad[1]]);
                gamepadApi.axes[2] = 0;
            } else if (parseFloat(gamepad.axes[axesGamepad[1]].toFixed(2)) > 0) {
                gamepadApi.axes[1] = 0;
                gamepadApi.axes[2] = Math.abs(gamepad.axes[axesGamepad[1]]);
            } else {
                gamepadApi.axes[1] = 0;
                gamepadApi.axes[2] = 0;
            }

            if (distance === 0) {
                if (parseFloat(gamepad.axes[axesGamepad[2]].toFixed(2)) === -1) {
                    gamepadApi.gear = 1;
                } else if (parseFloat(gamepad.axes[axesGamepad[2]].toFixed(2)) === 1) {
                    gamepadApi.gear = -1;
                } else {
                    gamepadApi.gear = 0;
                }
            }
        } else if (gamepadApi.type === 'wheel') {

            gamepadApi.axes[0] = gamepad.axes[axesGamepad[0]];
            gamepadApi.axes[1] = (1 - gamepad.axes[axesGamepad[1]]) / 2;
            gamepadApi.axes[2] = (1 - gamepad.axes[axesGamepad[2]]) / 2;

            if (distance === 0) {
                if (gamepadApi.buttons[4].pressed && gamepadApi.gear !== 1) {
                    gamepadApi.gear = 1;
                }
                if (gamepadApi.buttons[5].pressed && gamepadApi.gear !== -1) {
                    gamepadApi.gear = -1;
                }
            }
        }
    }
}

function resetGamepad() {
    gamepadApi.connected = false;
    gamepadApi.type = '';
    gamepadApi.axes = [];
    gamepadApi.buttons = [];

}

window.addEventListener("gamepadconnected", function () {
    var gamepad = navigator.getGamepads()[0];
    registerGamepad(gamepad);
    updateGamepad(gamepad);
    console.log("Connected! Type: " + gamepadApi.type);
});

window.addEventListener("gamepaddisconnected", function () {
    resetGamepad();
    console.log("Disconnected!");
});