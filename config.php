<?php
session_start();

if (!isset($_SESSION['lang']))
    $_SESSION['lang'] = "sk";
else if (isset($_GET['lang']) && $_SESSION['lang'] != $_GET['lang'] && !empty($_GET['lang'])) {
    if ($_GET['lang'] == "en")
        $_SESSION['lang'] = "en";
    else if ($_GET['lang'] == "sk")
        $_SESSION['lang'] = "sk";
}
//echo "lang: ". $_SESSION['lang'];
require_once "languages/" . $_SESSION['lang'] . ".php";
?>