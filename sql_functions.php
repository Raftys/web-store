<?php
if (session_status() == PHP_SESSION_NONE)
    session_start();
function connect()
{
    $host = 'localhost';
    $db = 'saltses';
    $user = 'root'; // or your MySQL username
    $pass = 'root'; // your MySQL password

    $conn = new mysqli($host, $user, $pass, $db);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

function select_all($conn, $table) {
    $sql = "SELECT * FROM $table";
    return $conn->query($sql);
}

function select_all_from_id($conn, $id, $table) {
    $sql = "SELECT * FROM $table WHERE id = '$id'";
    return $conn->query($sql);
}

function select_value_from_id($conn, $id, $id_value, $table, $value) {
    $sql = "SELECT * FROM $table WHERE $id = $id_value";
    return $conn->query($sql)->fetch_assoc()[$value];
}



function load_products($conn) {
    $result = select_all($conn, 'products');

    $items = [];

    if ($result->num_rows > 0) {
        // Output data of each row
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
    }
    $conn->close();
    return $items;
}


function guest_user($full_name,$email, $phone, $address, $city, $zip_code, $country) {
    $full_name = 'Guest_'.$full_name;
    $conn = connect();
    $sql = "INSERT INTO users (full_name, email, phone, address, city, zip_code, country) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssssss', $full_name, $email, $phone, $address, $city, $zip_code, $country);
    $stmt->execute();
    return $conn->insert_id;
}

function update_table($table,$id,$new_full_name, $new_email, $new_phone, $new_address, $new_city, $new_zip_code, $new_country) {
    $conn = connect();

    $sql = "UPDATE $table SET full_name = '$new_full_name', email = '$new_email', phone = '$new_phone', address = '$new_address', city = '$new_city', zip_code = '$new_zip_code',  country = '$new_country', root = '1' WHERE id = $id";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $stmt->close();
    $conn->close();
}
