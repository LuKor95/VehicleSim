<?php
include "config.php";
?>
<!DOCTYPE html>
<html lang="<?= $lang['lang']?>">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="Lukas Korciciak">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $lang['model']?> | Simulation of Vehicle</title>

    <link rel="stylesheet" type="text/css" href="vendor/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/model.css">
    <link rel="icon" type="image/png" href="favicon.png">

    <script src="babylon/babylon.js"></script>
    <script src="babylon/babylonjs.loaders.min.js"></script>
    <script src="babylon/babylon.gui.min.js"></script>
    <script src="graph/plotly-latest.min.js"></script>
</head>
<body>
<canvas id="renderCanvas" touch-action="none"></canvas>
<div id="graph">
    <div class="menu-section">
        <a href="index.php" class="btn btn-dark"><?= $lang['home']?></a>
        <a href="record.php" class="btn btn-dark"><?= $lang['record']?></a>
        <a href="javascript:void(0)" id="stopModel" class="btn btn-dark"><?= $lang['stop']?></a>
        <a href="javascript:void(0)" id="restartModel" class="btn btn-dark d-none"><?= $lang['restart']?></a>
    </div>
    <?= $lang['graph1'] ?>
    <div id="carPosition" class="graph-section"></div>
    <?= $lang['graph2'] ?>
    <div id="carSpeed" class="graph-section"></div>
    <?= $lang['graph3'] ?>
    <div id="botPosition" class="graph-section"></div>
    <div class="lang-section">
        <a href="model.php?lang=en"><img src="img/en.png" class="img-fluid pr-3" alt="EN"></a>
        <a href="model.php?lang=sk"><img src="img/sk.png" class="img-fluid" alt="SK"></a>
    </div>
</div>

<script src="script.js"></script>
<script src="gamepad.js"></script>
<script src="scene.js"></script>

</body>
</html>