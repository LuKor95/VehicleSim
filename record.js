var records = document.getElementById("records");

var carPlotLayout = {
    xaxis: {
        range: [-15, 15]
    },
    yaxis: {
        range: [-5, 5]
    },
    margin: {t: 25}
};

var carSpeedPlotLayout = {
    margin: {t: 25}
};

function reformatTime(dateTime) {
    var dt = dateTime.split('_');
    var date = dt[0].split('-');
    var d = date.reverse().join(".");
    var t = dt[1].replace(/-/g, ':');

    return d + ' ' + t;
}

function getRecords(setTable) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (this.responseText) {
                var jsonData = JSON.parse(this.responseText);
                setTable(jsonData);
            }
        }
    };
    xmlhttp.open("GET", "data.php", true);
    xmlhttp.send();
}

getRecords(function (data) {
    data.reverse();
    data.forEach(function (rec) {
        var tbl = "<div class='row text-center'>";
        tbl += "<div class='col-12 h4'>" + reformatTime(rec.time) + "</div>";
        tbl += "<div class='col-md-6 h5 order-md-1'>1</div>";
        tbl += "<div id=" + rec.time + " class='col-md-6 h-25 order-md-3'></div>";
        tbl += "<div class='col-md-6 h5 order-md-2'>2</div>";
        tbl += "<div id=" + rec.time + '2' + " class='col-md-6 order-md-4'></div>";
        tbl += "</div>";
        records.innerHTML += tbl;

        Plotly.newPlot(rec.time, [rec.car], carPlotLayout, {responsive: true});
        Plotly.newPlot(rec.time + '2', [rec.speed], carSpeedPlotLayout, {responsive: true});
    });
});