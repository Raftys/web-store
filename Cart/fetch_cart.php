<?php

if (session_status() == PHP_SESSION_NONE)
    session_start();
if(isset($_SESSION['cart']))
    echo json_encode($_SESSION['cart']);
else
    echo json_encode("Error");
exit();
