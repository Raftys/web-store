<?php

if (session_status() == PHP_SESSION_NONE)
    session_start();
connect();

// Connects to the MySQL database and stores the connection in $client_db.
// Stops the script if the connection fails.
function connect() {
    // Set global variable for database connection
    global $client_db;

    // Database connection settings
    $host = getenv('DB_HOST');
    $user = getenv('DB_USER');
    $pass = getenv('DB_PASS');
    $db = getenv('DB_NAME');

    $client_db = new mysqli($host, $user, $pass, $db);
    if ($client_db->connect_error) {
        die("Connection failed: " . $client_db->connect_error);
    }
}

// Executes a given SQL query using the global $client_db connection.
function doQuery($query, $types = null, ...$params) {
    global $client_db;

    // 1. If no types and no params given, run a simple query
    if ($types === null & empty($params) && (stripos(trim($query), 'INSERT') !== 0)) {
        return $client_db->query($query);
    }

    // 2. Otherwise, prepare the statement
    $stmt = $client_db->prepare($query);
    if ($stmt === false) {
        die("Prepare failed: " . $client_db->error);
    }

    // 3. Bind parameters if provided
    if ($types !== null && !empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    // 4. Execute statement
    $stmt->execute();

    // 5. If it's an INSERT query, return last insert ID
    if (stripos(trim($query), 'INSERT') === 0) {
        return $client_db->insert_id;
    }

    // 6. For other queries, return the result set object
    return $stmt->get_result();
}


// Builds and executes a SELECT query with dynamic filters and projections.
// Accepts table name, filter conditions, projection columns, and limit; returns the result as an array.
function get($table, $filter_keys, $filter_condition, $filter_values, $projection_keys, $many) {

    // Make sure everything is array for the sql query
    if (!is_array($filter_keys)) {
        $filter_keys = [$filter_keys];
        $filter_condition = [$filter_condition];
        $filter_values = [$filter_values];
    }
    if (!is_array($projection_keys)) {
        $projection_keys = [$projection_keys];
    }

    // Create Filter
    $filter_pairs = [];
    for ($i = 0; $i < count($filter_keys); $i++) {
        $filter_pairs[] = $filter_keys[$i] . $filter_condition[$i] . "'" . $filter_values[$i] . "'";
    }
    $filter = implode(' AND ', $filter_pairs);

    // Create Projection
    $projection = implode(',', $projection_keys);

    // Start creating query
    $sql = "SELECT $projection FROM `$table` WHERE $filter";
    // Add limit if needed
    if ($many === false) {
        $sql .= " LIMIT 1";
    }

    // Execute the query, build and return the results
    return buildResult(doQuery($sql));
}

function update($table, $filter_keys, $filter_condition, $filter_values, $update_keys, $update_values, $many) {
    // Make sure everything is array for the sql query
    if (!is_array($filter_keys)) {
        $filter_keys = [$filter_keys];
        $filter_condition = [$filter_condition];
        $filter_values = [$filter_values];
    }
    if (!is_array($update_keys)) {
        $update_keys = [$update_keys];
        $update_values = [$update_values];
    }

    // Create Filter
    $filter_pairs = [];
    for ($i = 0; $i < count($filter_keys); $i++) {
        $filter_pairs[] = $filter_keys[$i] . $filter_condition[$i] . "'" . $filter_values[$i] . "'";
    }
    $filter = implode(' AND ', $filter_pairs);

    // Create Update values
    $update_pairs = [];
    for ($i = 0; $i < count($update_keys); $i++) {
        $update_pairs[] = $update_keys[$i] . ' = ' .  "'" . $update_values[$i] . "'";
    }
    $update = implode(',', $update_pairs);

    $sql = "UPDATE `$table` SET $update WHERE $filter";
    // Add limit if needed
    if ($many === false) {
        $sql .= " LIMIT 1";
    }

    // Execute the query, build and return the results
    return doQuery($sql);
}

function insert($table, $insert_keys, $insert_values) {
    // Join column names
    $columns = implode(', ', $insert_keys);

    // Quote and join values
    $quoted_values = array_map(function($val) {
        if ($val === null) {
            return "NULL";
        } else {
            return "'" . addslashes($val) . "'";
        }
    }, $insert_values);
    $values = implode(', ', $quoted_values);

    // Build SQL
    $sql = "INSERT INTO `$table` ($columns) VALUES ($values)";

    return doQuery($sql);
}

function delete($table, $id, $value) {
    // Quote value properly
    $quoted_value = ($value === null) ? "NULL" : "'" . addslashes($value) . "'";

    // Build SQL
    $sql = "DELETE FROM `$table` WHERE `$id` = $quoted_value";

    return doQuery($sql);
}


// Converts a MySQLi result set into an array of associative arrays.
// Each array element represents a row from the result set.
function buildResult($result) {
    $rows = [];

    if ($result) {
        $num_rows = $result->num_rows;

        if ($num_rows === 1) {
            // Fetch single row as associative array
            return $result->fetch_assoc();
        } elseif ($num_rows > 1) {
            // Fetch all rows as an array of associative arrays
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row; // append each row directly
            }
        }
    }

    return $rows; // returns either [] (no rows) or array of rows
}












// Retrieves all records from the specified database table.
function select_all($table) {
    $sql = "SELECT * FROM $table";
    return buildResult(doQuery($sql));
}

function select_all_from_id($id, $table) {
    $sql = "SELECT * FROM $table WHERE id = '$id'";
    return buildResult(doQuery($sql));
}

function select_value_from_id($id, $id_value, $table) {
    $sql = "SELECT * FROM $table WHERE $id = $id_value";
    return buildResult(doQuery($sql));
}

function update_all_by_id($id,$id_value, $table) {
    $sql = "UPDATE $table SET  WHERE $id =  $id_value";
    return buildResult(doQuery($sql));
}

function load_products() {
    $sql = "SELECT * FROM products";
    return doQuery($sql);
}


function create_customer($full_name, $email, $phone, $address, $city, $zip_code, $country, $box_now) {
    $conn = connect();
    $sql = "INSERT INTO customers (full_name, email, phone, address, city, zip_code, country, box_now) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssssss', $full_name, $email, $phone, $address, $city, $zip_code, $country, $box_now);
    $stmt->execute();
    return $conn->insert_id;
}

