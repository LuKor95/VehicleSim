<?php

$dir = "coordinates/output_coords/";

if (is_dir($dir)){
    $dataInDirectory = false;
    $graphData = [];
    $files = scandir($dir);

    foreach ($files as $fileName){
        if (strpos($fileName, "GRAPH") !== false){
            $dataInDirectory = true;
            $f = file_get_contents($dir.$fileName);
            $temp_f = json_decode($f, true);
            array_push($graphData, $temp_f);
        }
    }
    if ($dataInDirectory) {
        echo json_encode($graphData);
    }
}