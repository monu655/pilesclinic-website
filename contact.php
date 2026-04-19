<?php

// ✅ IMPORTANT: use statements always TOP pe honge
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// ── Only POST allowed ──
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

// ── Input Sanitization ──
function clean($val) {
    return htmlspecialchars(trim($val ?? ''), ENT_QUOTES, 'UTF-8');
}

$name    = clean($_POST['name'] ?? '');
$phone   = clean($_POST['phone'] ?? '');
$email   = clean($_POST['email'] ?? '');
$problem = clean($_POST['problem'] ?? 'Not specified');
$date    = clean($_POST['date'] ?? 'Not specified');
$message = clean($_POST['message'] ?? '');

// ── Validation ──
if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Name required']);
    exit;
}

$phonedigits = preg_replace('/\D/', '', $phone);
if (strlen($phonedigits) < 10) {
    echo json_encode(['success' => false, 'message' => 'Valid phone required']);
    exit;
}

// ── CONFIG ──
// Hardcoded email and password
$fromEmail  = 'navimumbaipileshospital@gmail.com'; // Hardcoded email
$gmailAppPw = 'Piles@#25$'; // Hardcoded password

// Check if the email and password are set
if (!$fromEmail || !$gmailAppPw) {
    echo json_encode(['success' => false, 'message' => 'Email or password not set']);
    exit;
}

$toEmail    = 'navimumbaipileshospital@gmail.com';
$fromName   = 'NavimumabiHospital';

// ── EMAIL BODY ──
$body = "
<h2>New Appointment</h2>
<p><b>Name:</b> $name</p>
<p><b>Phone:</b> $phone</p>
<p><b>Email:</b> $email</p>
<p><b>Problem:</b> $problem</p>
<p><b>Date:</b> $date</p>
<p><b>Message:</b> $message</p>
";

// ── PHPMailer ──
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $fromEmail;
    $mail->Password   = $gmailAppPw;  // Use the hardcoded password
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($toEmail);

    $mail->isHTML(true);
    $mail->Subject = "New Appointment - $name";
    $mail->Body    = $body;

    $mail->send();

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    error_log("Mail Error: " . $mail->ErrorInfo);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>