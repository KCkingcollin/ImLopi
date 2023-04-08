<?php

session_start([
    'cookie_samesite' => 'Lax', // or 'Strict', or 'None' with secure connection
]);

// Define constants
define('FILE_PATH', 'count.txt');
define('MAX_COUNT', 25);

// Initialize global count value in memory
if (isset($_SESSION['globalCount'])) {
    // Session variable is set and not empty
    $globalCount = $_SESSION['globalCount'];
} else {
    // Session variable is either not set or empty
    $_SESSION['globalCount'] = intval(file_get_contents(FILE_PATH));
    $globalCount = $_SESSION['globalCount'];
}

// Initialize session call count value in memory
if (isset($_SESSION['sessionCalls'])) {
    // Session variable is set and not empty
    $sessionCalls = $_SESSION['sessionCalls'];
} else {
    // Session variable is either not set or empty
    $_SESSION['sessionCalls'] = 0;
    $sessionCalls = $_SESSION['sessionCalls'];
}

// Initialize session count value in memory
if (isset($_SESSION['sessionCount'])) {
    // Session variable is set and not empty
    $sessionCount = $_SESSION['sessionCount'];
} else {
    // Session variable is either not set or empty
    $_SESSION['sessionCount'] = 0;
    $sessionCount = $_SESSION['sessionCount'];
}
if (isset($_POST['user_leaving'])) {
    // User leaving event detected, handle the event here.
    // For example, update a database or log the event.
    $userOnPage = false;
} else {
    $userOnPage = true;
}

if (isset($_POST['count']) && $_POST['count'] > 0 && $_POST['count'] <= MAX_COUNT) {
    $count = intval($_POST['count']);
    $globalCount += $count;
    $sessionCount += $count;
}

// Update file if global count has changed
$fileCount = intval(file_get_contents(FILE_PATH));
if ($globalCount !== $fileCount && !$userOnPage) {
    file_put_contents(FILE_PATH, $fileCount + $sessionCount);
    $globalCount = intval(file_get_contents(FILE_PATH));
} elseif ($globalCount !== $fileCount && $userOnPage && $sessionCalls >= 5) {
    file_put_contents(FILE_PATH, $fileCount + $sessionCount);
    $globalCount = intval(file_get_contents(FILE_PATH));
}

echo $globalCount;

$_SESSION['sessionCount'] = $sessionCount;
$_SESSION['sessionCalls'] += 1;
$_SESSION['globalCount'] = $globalCount;

?>
