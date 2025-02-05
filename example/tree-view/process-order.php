<?php
// process-order.php

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $quantity = $_GET['quantity'];
    $name = $_GET['name'];
    $email = $_GET['email'];
    
    // Process the order (in a real scenario, you'd save to database, send emails, etc.)
    // echo $quantity . $name . $email;
    $response = [
        "status" => "success",
        "message" => "Thank you, $name! Your order for $quantity chocolate bar(s) has been received. We'll send a confirmation to $email shortly."
    ];
    
    echo json_encode($response);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}