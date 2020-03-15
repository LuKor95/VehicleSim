/*********************************Support************************************************/
const supportedGamepad = [
    {
        id: 0,
        name: 'T.Flight Stick X',
        type: 'joystick'
    },
    {
        id: 1,
        name: 'G920 Driving Force',
        type: 'racing-wheel'
    }
];

const supportedPlatform = [
    {
        id: 0,
        name: 'Win32',
        type: []
    },
    {
        id: 1,
        name: 'Linux x86_64',
        type: []
    }
];

function detectUserPlatform() {
    for (let i = 0; i < supportedPlatform.length; i++){
        if (window.navigator.platform === supportedPlatform[i].name){
            return supportedPlatform[i].id;
        }
    }
    return null;

    // let userPlatform = supportedPlatform.indexOf(window.navigator.platform);
    // if (userPlatform !== -1){
    //     return supportedPlatform[userPlatform];
    // }
    // return null;
}

function detectUserGamepad(gamepad) {
    for (let i = 0; i < supportedGamepad.length; i++){
        if (gamepad.id.includes(supportedGamepad[i].name)){
            return supportedGamepad[i].id;
        }
    }
    return null;
}



/*****************************Detect Devices*********************************************/

var gamepadApi = {
    connected: false,
    axes: [],
    buttons: [],
};

var forwardVector;
var rightVector;

function setGamepadApi(gamepad) {
    let gamepadId = detectUserGamepad(gamepad);
    let platform = detectUserPlatform();

    if (gamepadId === 0 && platform === 0){
        // gamepadApi.axes[0] = gamepad.axes[0];
        // gamepadApi.axes[1] = gamepad.axes[1];
        // gamepadApi.axes[2] = gamepad.axes[5];
        // gamepadApi.axes[3] = gamepad.axes[6];
        //
        // gamepadApi.axes[4] = gamepad.axes[9];
    }else if ((gamepadId === 0 && platform === 1) || (gamepadId === 1 && platform === 1)){
        // gamepadApi.axes = gamepad.axes;
    }else if (gamepadId === 1 && platform === 0){
        // gamepadApi.axes[0] = gamepad.axes[0];
        // gamepadApi.axes[1] = gamepad.axes[1];
        // gamepadApi.axes[2] = gamepad.axes[2];
        // gamepadApi.axes[3] = gamepad.axes[5];
        //
        // gamepadApi.axes[4] = gamepad.axes[9];
    }else {
        console.log("Ziadna podpora OS alebo Gamepadu");
    }
}

window.addEventListener("gamepadconnected", function (e) {
    console.log("Connected");
    var gp = navigator.getGamepads()[e.gamepad.index];
    gamepadApi.connected = gp.connected;
    gamepadApi.axes = gp.axes;
    gamepadApi.buttons = gp.buttons;


    console.log(gamepadApi);
});
window.addEventListener("gamepaddisconnected", function (e) {
    console.log("Disconnected");
    var gp = navigator.getGamepads()[e.gamepad.index];
    gamepadApi.connected = false;
    gamepadApi.axes = [];
    gamepadApi.buttons = [];
    console.log(gamepadApi);
});

/*****************************Detect Devices*********************************************/