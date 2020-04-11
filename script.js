// var canvas = document.getElementById("renderCanvas");
// var startButton = document.getElementById("startButton");
// var mainContent = document.getElementById("mainContent");
//
// var engine = new BABYLON.Engine(canvas, true);
//
// startButton.onclick = function () {
//     mainContent.classList.add("d-none");
//
//     var scene = createScene();
//
//     engine.runRenderLoop(function () {
//         scene.render();
//     });
//
//     window.addEventListener("resize", function () {
//         engine.resize();
//     });
// };

carPlot = document.getElementById('carPosition');
botPlot = document.getElementById('botPosition');
speedPlot = document.getElementById('carSpeed');

var carStartPosition = {x: 0, z: 322.5, r: 0};

var botsStartPosition = [
    {x: 0, z: 300, r: 0}
];

var carCoords = [];
var speedCoords = [];


/******* Plot Settings ******/

var carTrace = {
    x: [],
    y: [],
    mode: 'lines'
};

var carSpeed = {
    x: [],
    y: [],
    mode: 'lines'
};

var carPlotLayout = {
    title: "Pohyb auta po mape",
    xaxis: {
        range: [-15, 15]
    },
    yaxis: {
        range: [-4, 4]
    },
    margin: {t: 25, l: 20, r: 10}
};

var carSpeedPlotLayout = {
    title: "Závislosť rýchloti od času",
    margin: {t: 25, l: 20, r: 10}
};

var botPlotLayout = {
    title: "Pohyb autobusov po mape",
    xaxis: {
        range: [-15, 15]
    },
    yaxis: {
        range: [-4, 4]
    },
    margin: {t: 25, l: 20, r: 10}
};


/******* Get input coordinates from json ******/

function getStartCoord(setCoords) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var jsonData = JSON.parse(this.responseText);
            setCoords(jsonData);
        }
    };
    xmlhttp.open("GET", "coordinates/input_coords/inputCoords.json", true);
    xmlhttp.send();
}

getStartCoord(function (data) {
    if (data["car"]) {
        var jsonCar = data["car"];
        carStartPosition = jsonCar[0];
    }
    if (data["bots"]) {
        botsStartPosition = data["bots"];
    }
});


/******* Save position and speed of car in time to json ******/

function saveCoord() {
    var car = carCoords;
    var carSpeed = speedCoords;
    var data = JSON.stringify({car, carSpeed});

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            alert("Dáta sa úspešne uložili na server!");
        }
    };
    xmlhttp.open("POST", "coords.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(data);
}


/******* Set variables and draw all plots ******/

function traceCarPosition(posX, posZ) {
    var pX = posX / 100;
    var pZ = posZ / 100;

    if (!(carTrace.x[carTrace.x.length - 1] === pX && carTrace.y[carTrace.y.length - 1] === pZ)) {
        carTrace.x.push(pX);
        carTrace.y.push(pZ);

        var coord = {x: pX * 100, z: pZ * 100};
        carCoords.push(coord);

        Plotly.newPlot(carPlot, [carTrace], carPlotLayout);
    }
}

function traceBotsPosition(bots) {
    var botsTrace = [];

    for (var i = 0; i < bots.length; i++) {

        var botTrace = {
            x: [bots[i].position.x / 100],
            y: [bots[i].position.z / 100],
            mode: 'markers'
        };
        botsTrace.push(botTrace);

    }

    Plotly.newPlot(botPlot, botsTrace, botPlotLayout);

}

function traceCarSpeed(speed, time) {

    carSpeed.x.push(time / 1000);
    carSpeed.y.push(speed);

    var coord = {speed: speed, time: time};
    speedCoords.push(coord);

    Plotly.newPlot(speedPlot, [carSpeed], carSpeedPlotLayout);
}