<?php
include "config.php";
?>
<!DOCTYPE html>
<html lang="<?= $lang['lang'] ?>">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="Lukas Korciciak">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $lang['home'] ?> | Simulation of Vehicle</title>

    <link rel="stylesheet" type="text/css" href="vendor/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link rel="icon" type="image/png" href="favicon.png">

</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-transparent-9 fixed-top">
    <div class="container">
        <a class="navbar-brand" href="/">Simulation of Vehicle</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive"
                aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="/"><?= $lang['home'] ?></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/record.php"><?= $lang['record'] ?></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/model.php"><?= $lang['start'] ?></a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<header class="bg-custom py-5 mb-5">
    <div class="container h-100">
        <div class="row h-100 align-items-center">
            <div class="col-lg-12">
                <p class="h5 mt-5 mb-0"><?= $lang['type'] ?></p>
                <h1 class="display-4 font-weight-bold mb-3"><?= $lang['title'] ?></h1>
                <p class="h5 font-weight-normal mb-4"><?= $lang['subtitle'] ?></p>
            </div>
        </div>
    </div>
</header>

<div class="container">
    <div class="row">
        <div class="col-12 text-center">
            <h2 class="h1"><?= $lang['title2'] ?></h2>
        </div>
    </div>
    <div class="row align-items-center text-center">
        <div class="col-md-6">
            <div class="p-5">
                <h3 class="h1 pb-2"><?= $lang['title2a'] ?></h3>
                <table class="table">
                    <tbody>
                    <tr>
                        <td class="w-50">W</td>
                        <td class="w-50"><?= $lang['forward'] ?></td>
                    </tr>
                    <tr>
                        <td>A</td>
                        <td><?= $lang['left'] ?></td>
                    </tr>
                    <tr>
                        <td>S</td>
                        <td><?= $lang['backward'] ?></td>
                    </tr>
                    <tr>
                        <td>D</td>
                        <td><?= $lang['right'] ?></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="col-md-6">
            <div class="p-5 text-center">
                <img src="img/keyboard.jpg" class="img-fluid rounded-circle" alt="Keyboard">
            </div>
        </div>
    </div>
    <div class="row align-items-center text-center">
        <div class="col-md-6 order-md-last">
            <div class="p-5">
                <h3 class="h1 pb-2"><?= $lang['title2b'] ?></h3>
                <table class="table">
                    <tbody>
                    <tr>
                        <td class="w-50"><?= $lang['x'] ?></td>
                        <td class="w-50"><?= $lang['lr'] ?></td>
                    </tr>
                    <tr>
                        <td><?= $lang['y'] ?></td>
                        <td><?= $lang['fbb'] ?></td>
                    </tr>
                    <tr>
                        <td><?= $lang['slider'] ?></td>
                        <td><?= $lang['fbg'] ?></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="col-md-6">
            <div class="p-5">
                <img src="img/joystick.jpg" class="img-fluid rounded-circle" alt="Joystick">
            </div>
        </div>
    </div>
    <div class="row align-items-center text-center">
        <div class="col-md-6">
            <div class="p-5">
                <h3 class="h1 pb-2"><?= $lang['title2c'] ?></h3>
                <table class="table">
                    <tbody>
                    <tr>
                        <td class="w-50"><?= $lang['steeringwheel'] ?></td>
                        <td class="w-50"><?= $lang['lr'] ?></td>
                    </tr>
                    <tr>
                        <td><?= $lang['gas'] ?></td>
                        <td><?= $lang['fb'] ?></td>
                    </tr>
                    <tr>
                        <td><?= $lang['brake'] ?></td>
                        <td><?= $lang['b'] ?></td>
                    </tr>
                    <tr>
                        <td><?= $lang['lbumper'] ?></td>
                        <td><?= $lang['bg'] ?></td>
                    </tr>
                    <tr>
                        <td><?= $lang['rbumper'] ?></td>
                        <td><?= $lang['fg'] ?></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="col-md-6 text-center">
            <div class="p-5">
                <img src="img/wheel.jpg" class="img-fluid rounded-circle" alt="Racing wheel">
            </div>
        </div>
    </div>
    <div class="row py-4 align-items-center text-center">
        <div class="col-12 col-md-6 m-auto">
            <div class="p-5">
                <h3 class="h1 pb-2"><?= $lang['title2d'] ?></h3>
                <table class="table">
                    <tbody>
                    <tr>
                        <td class="w-50">V</td>
                        <td class="w-50"><?= $lang['camera'] ?></td>
                    </tr>
                    <tr>
                        <td>U</td>
                        <td><?= $lang['save'] ?></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<div class="container">
    <div class="row">
        <div class="col-12 text-center pb-5">
            <a href="/model.php" id="startButton" class="btn btn-danger"><span
                        class="h1"><?= $lang['start'] ?></span></a>
        </div>
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
                    <a href="/index.php?lang=en"><img src="img/en.png" class="img-fluid pr-3" alt="EN"></a>
                    <a href="/index.php?lang=sk"><img src="img/sk.png" class="img-fluid" alt="SK"></a>
                </div>
                <p>Copyright &copy; Simulation of Vehicle 2020</p>
            </div>
        </div>
    </div>
</footer>

<script src="vendor/jquery/jquery.min.js"></script>
<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

</body>
</html>