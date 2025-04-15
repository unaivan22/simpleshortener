<?php

header("Access-Control-Allow-Origin: *"); // Atau bisa diganti dengan 'http://localhost:5173' biar lebih aman
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No content untuk preflight
    exit;
}

$host = 'localhost';
$user = 'una';
$pass = 'unaivan';
$dbname = 'shortener';

$conn = new mysqli($host, $user, $pass, $dbname);
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $url = $conn->real_escape_string($input['url']);
    $short = substr(md5(uniqid()), 0, 6);

    $sql = "INSERT INTO urls (original_url, short_code) VALUES ('$url', '$short')";
    $conn->query($sql);

    // Ganti ini:
    // echo json_encode(['short' => $short]);

    // Dengan ini:
    echo json_encode([
        'short' => "http://localhost:5173/$short" // <-- arahkan ke frontend
    ]);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['code'])) {
    $code = $conn->real_escape_string($_GET['code']);
    $result = $conn->query("SELECT original_url FROM urls WHERE short_code = '$code'");
    if ($row = $result->fetch_assoc()) {
        header("Location: " . $row['original_url']);
        exit;
    } else {
        echo "URL not found.";
    }
}
