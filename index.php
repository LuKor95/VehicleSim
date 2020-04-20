<?php
    include "config.php";
?>
<!DOCTYPE html>
<html lang="<?= $lang['lang']?>">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="Lukas Korciciak">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $lang['title']?></title>

    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link rel="icon" type="image/png" href="favicon.png">

</head>
<body>
<div class="layout">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h1 class="text-red"><?= $lang['title']?></h1>
            </div>
            <div class="col-12">
                <h2><?= $lang['subtitle']?></h2>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h2>Ovládanie</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <h3>Klávesnica</h3>
                <table class="table-centered">
                    <tbody>
                    <tr>
                        <td>W</td>
                        <td>Dopredu</td>
                    </tr>
                    <tr>
                        <td>A</td>
                        <td>Doľava</td>
                    </tr>
                    <tr>
                        <td>S</td>
                        <td>Dozadu</td>
                    </tr>
                    <tr>
                        <td>D</td>
                        <td>Doprava</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-md-4">
                <h3>Joystick</h3>
                <table class="table-centered">
                    <tbody>
                    <tr>
                        <td>Os X</td>
                        <td>Doľava / Doprava</td>
                    </tr>
                    <tr>
                        <td>Os Y</td>
                        <td>Dopredu / Dozadu / Brzda</td>
                    </tr>
                    <tr>
                        <td>Slider</td>
                        <td>Prevod dopredu / dozadu</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-md-4">
                <h3>Volant s pedálmi</h3>
                <table class="table-centered">
                    <tbody>
                    <tr>
                        <td>Volant</td>
                        <td>Doľava / Doprava</td>
                    </tr>
                    <tr>
                        <td>Plynový pedál</td>
                        <td>Dopredu / Dozadu</td>
                    </tr>
                    <tr>
                        <td>Brzdový pedál</td>
                        <td>Brzda</td>
                    </tr>
                    <tr>
                        <td>Ľavé pádlo</td>
                        <td>Prevod dozadu</td>
                    </tr>
                    <tr>
                        <td>Pravé pádlo</td>
                        <td>Prevod dopredu</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row pb-5">
            <div class="col-12">
                <h3>Ďalšie prvky</h3>
                <table class="table-centered">
                    <tbody>
                    <tr>
                        <td>V</td>
                        <td>Zmena kamery</td>
                    </tr>
                    <tr>
                        <td>U</td>
                        <td>Uloženie dát</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <a href="/model.php" id="startButton" class="btn">Spustiť 3D model</a>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <div class="col-md-5">
                <p>Autor:<br>Bc. Lukáš Korčičiak</p>
            </div>
            <div class="col-md-2">
                <p>2020</p>
            </div>
            <div class="col-md-5">
                <p>Vedúca práce:<br>doc. Ing. Katarína Žáková, PhD.</p>
            </div>
        </div>
    </div>
</div>

</body>
</html>