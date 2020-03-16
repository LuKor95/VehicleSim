const supportedPlatform = [
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

const supportedGamepad = [
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

const axesSync = {
    joystick_windows: [0, 1, 6],
    joystick_linux: [0, 1, 3],
    wheel_windows: [0, 1, 2],
    wheel_linux: [0, 1, 2]
};

function detectUserPlatform() {
    for (let i = 0; i < supportedPlatform.length; i++){
        if (window.navigator.platform === supportedPlatform[i].name){
            return supportedPlatform[i].type;
        }
    }
    return null;
}

function detectUserGamepad(gamepad) {
    for (let i = 0; i < supportedGamepad.length; i++){
        if (gamepad.id.includes(supportedGamepad[i].name)){
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

function updateGamepad(gamepad, distance){
    if (gamepadApi.connected && gamepadApi.type && gamepadApi.platform){
        let axesGamepad = axesSync[gamepadApi.type+'_'+gamepadApi.platform];
        gamepadApi.buttons = gamepad.buttons;

        if (gamepadApi.type === 'joystick'){

        }else if (gamepadApi.type === 'wheel'){

            gamepadApi.axes[0] = gamepad.axes[axesGamepad[0]];
            gamepadApi.axes[1] = (1 - gamepad.axes[axesGamepad[1]]) / 2;
            gamepadApi.axes[2] = (1 - gamepad.axes[axesGamepad[2]]) / 2;

            if (gamepadApi.buttons[4].pressed && gamepadApi.gear < 1 && distance === 0){
                gamepadApi.gear += 1;
            }
            if (gamepadApi.buttons[5].pressed && gamepadApi.gear > -1  && distance === 0){
                gamepadApi.gear -= 1;
            }

        }
    }
}

function resetGamepad(){
    gamepadApi.connected = false;
    gamepadApi.type = '';
    gamepadApi.axes = [];
    gamepadApi.buttons = [];

}

window.addEventListener("gamepadconnected", function (e) {
    console.log("Connected");
    var gamepad = navigator.getGamepads()[e.gamepad.index];
    registerGamepad(gamepad);
    updateGamepad(gamepad);
    console.log(gamepadApi);
});

window.addEventListener("gamepaddisconnected", function (e) {
    console.log("Disconnected");
    resetGamepad();
});

/*****************************Detect Devices*********************************************/