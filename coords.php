<?php
date_default_timezone_set('Europe/Bratislava');

$requestData = file_get_contents("php://input");

if ($requestData) {
    $objectData = json_decode($requestData, true);
    $car = $objectData["car"];
    $carSpeed = $objectData["carSpeed"];

    $time = date('YmdHis');

    $fileName = "CAR_" . $time . ".json";
    file_put_contents('coordinates/output_coords/' . $fileName, json_encode($car));

    $fileName = "CAR_SPEED_" . $time . ".json";
    file_put_contents('coordinates/output_coords/' . $fileName, json_encode($carSpeed));
}