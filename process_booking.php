<?php
// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors directly, use JSON instead

// Set JSON header
header('Content-Type: application/json');

// 1. Database Connection Parameters
$host = "localhost";
$username = "root"; 
$password = ""; // Your database password
$dbname = "yy_coaches";

$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["status" => "error", "message" => "Database Connection Failed: " . $conn->connect_error]));
}

$conn->set_charset("utf8mb4");

// 2. Check if Form data was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Validate required fields
    $required_fields = ['full_name', 'phone', 'email', 'departure', 'destination', 'travel_date', 'passengers'];
    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            http_response_code(400);
            die(json_encode(["status" => "error", "message" => "Missing required field: $field"]));
        }
    }
    
    // Generate a unique 5-character booking_id matching your VARCHAR(5) constraint
    $booking_id = substr(str_shuffle("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 5);
    
    // Sanitize user inputs to protect your database
    $full_name  = mysqli_real_escape_string($conn, trim($_POST['full_name']));
    $phone      = mysqli_real_escape_string($conn, trim($_POST['phone']));
    $email      = mysqli_real_escape_string($conn, trim($_POST['email']));
    $departure  = mysqli_real_escape_string($conn, trim($_POST['departure']));
    $destination = mysqli_real_escape_string($conn, trim($_POST['destination']));
    $travel_date = mysqli_real_escape_string($conn, trim($_POST['travel_date']));
    $passengers  = intval($_POST['passengers']);
    $departure_time = mysqli_real_escape_string($conn, trim($_POST['departure_time'] ?? ''));
    $payment_method = mysqli_real_escape_string($conn, trim($_POST['payment_method'] ?? ''));

    // Validate phone number length
    if (strlen($phone) < 9 || strlen($phone) > 15) {
        http_response_code(400);
        die(json_encode(["status" => "error", "message" => "Phone number must be between 9 and 15 characters"]));
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        die(json_encode(["status" => "error", "message" => "Invalid email address"]));
    }

    // 3. Prepare SQL Statement
    $sql = "INSERT INTO bookings (booking_id, full_name, phone, email, departure, destination, time, travel_date, passengers, payment_method) 
            VALUES ('$booking_id', '$full_name', '$phone', '$email', '$departure', '$destination', '$departure_time', '$travel_date', $passengers, '$payment_method')";

    // 4. Execute and return JSON with receipt data
    if ($conn->query($sql) === TRUE) {
        $submission_date = date("Y-m-d H:i:s");
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Booking submitted successfully!",
            "booking_id" => $booking_id,
            "full_name" => $full_name,
            "phone" => $phone,
            "email" => $email,
            "departure" => $departure,
            "destination" => $destination,
            "travel_date" => $travel_date,
            "passengers" => $passengers,
            "departure_time" => $departure_time,
            "payment_method" => $payment_method,
            "submission_date" => $submission_date
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Database error: " . $conn->error
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}

$conn->close();
?>
