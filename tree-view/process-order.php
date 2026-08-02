<?php
// process-order.php
try {
    $quantity = $_GET['quantity'];
    $name = $_GET['name'];
    $email = $_GET['email'];
    
    // Process the order (in a real scenario, you'd save to database, send emails, etc.)
    //echo $quantity . $name . $email;
    echo json_encode(["status" => "success", "message" => "Thank you, $name! Your order for $quantity chocolate bar(s) has been received. We'll send a confirmation to $email shortly."]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "$e->getMessage()"]);
}
?>