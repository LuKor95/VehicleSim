<?php
date_default_timezone_set('Europe/Bratislava');

$requestData = file_get_contents("php://input");

if ($requestData) {
    $objectData = json_decode($requestData, true);

    $time = date('Y-m-d_H-i-s');

    $coord = [
        "time" => $time,
        "car" => $objectData["car"],
        "speed" => $objectData["speed"]
    ];
    $graph = [
        "time" => $time,
        "car" => $objectData["graphCar"],
        "speed" => $objectData["graphSpeed"]
    ];

    $fileName = "COORD_" . $time . ".json";
    file_put_contents('coordinates/output_coords/' . $fileName, json_encode($coord));

    $fileName = "GRAPH_" . $time . ".json";
    file_put_contents('coordinates/output_coords/' . $fileName, json_encode($graph));
}