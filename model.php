<?php
include "config.php";
?>
<!DOCTYPE html>
<html lang="<?= $lang['title']?>">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="Lukas Korciciak">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D model</title>

    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
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
        <a href="/" class="btn btn-dark"><?= $lang['home']?></a>
        <a href="/reference.php" class="btn btn-dark"><?= $lang['reference']?></a>
        <a href="javascript:void(0)" id="stopModel" class="btn btn-dark"><?= $lang['stop']?></a>
    </div>
    <?= $lang['graph1'] ?>
    <div id="carPosition" class="graph-section"></div>
    <?= $lang['graph2'] ?>
    <div id="carSpeed" class="graph-section"></div>
    <?= $lang['graph3'] ?>
    <div id="botPosition" class="graph-section"></div>
    <div class="lang-section">
        <a href="/model.php?lang=en"><?= $lang['lang_en']?></a> | <a href="/model.php?lang=sk"><?= $lang['lang_sk']?></a>
    </div>
</div>

<script src="script.js"></script>
<script src="gamepad.js"></script>
<script src="scene.js"></script>

</body>
</html>