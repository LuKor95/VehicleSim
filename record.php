<?php
include "config.php";
?>
<!DOCTYPE html>
<html lang="<?= $lang['lang'] ?>">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="Lukas Korciciak">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $lang['record'] ?> | Simulation of Vehicle</title>

    <link rel="stylesheet" type="text/css" href="lib/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link rel="icon" type="image/png" href="favicon.png">

    <script src="lib/graph/plotly-latest.min.js"></script>

</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-transparent-9 fixed-top">
    <div class="container">
        <a class="navbar-brand" href="index.php">Simulation of Vehicle</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive"
                aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link" href="index.php"><?= $lang['home'] ?></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="record.php"><?= $lang['record'] ?></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-danger font-weight-bold" href="model.php"><?= $lang['start'] ?></a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<header class="bg-custom py-5 mb-5">
    <div class="container h-100">
        <div class="row h-100 align-items-center">
            <div class="col-lg-12">
                <h1 class="display-4 font-weight-bold mt-5 mb-3"><?= $lang['record'] ?></h1>
                <p class="h5 font-weight-normal mb-4"><?= $lang['recordsub'] ?></p>
            </div>
        </div>
    </div>
</header>

<div id="records" class="container">
    <div class="row text-center pb-5">
        <div class="col-md-6 h3">1 - <?= $lang['graph1'] ?></div>
        <div class="col-md-6 h3">2 - <?= $lang['graph2'] ?></div>
    </div>
</div>

<footer class="py-4 bg-dark">
    <div class="container">
        <div class="row align-items-center text-center text-white">
            <div class="col-md-4">
                <p><?= $lang['author'] ?><br>Bc. Lukáš Korčičiak</p>
                <p><?= $lang['supervisor'] ?><br>doc. Ing. Katarína Žáková, PhD.</p>
            </div>
            <div class="col-md-4">
                <img src="img/stu-fei.png" class="img-fluid" alt="STU FEI">
                <p class="mb-0"><?= $lang['stu'] ?></p>
                <p><?= $lang['fei'] ?></p>
            </div>
            <div class="col-md-4">
                <div class="pb-3">
                    <a href="record.php?lang=en"><img src="img/en.png" class="img-fluid pr-3" alt="EN"></a>
                    <a href="record.php?lang=sk"><img src="img/sk.png" class="img-fluid" alt="SK"></a>
                </div>
                <p>Copyright &copy; Simulation of Vehicle 2020</p>
            </div>
        </div>
    </div>
</footer>

<script src="lib/jquery/jquery.min.js"></script>
<script src="lib/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="record.js"></script>

</body>
</html>
