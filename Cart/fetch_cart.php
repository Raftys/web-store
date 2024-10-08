<?php

if (session_status() == PHP_SESSION_NONE)
    session_start();
echo json_encode($_SESSION['cart']);
exit();
