<?php

session_start([
    'cookie_samesite' => 'Lax', // or 'Strict', or 'None' with secure connection
]);

// Define constants
define('FILE_PATH', 'count.txt');
define('MAX_COUNT', 25);

// Session variable is either not set or empty
if (! isset($_SESSION['globalCount'])) {
    $_SESSION['globalCount'] = intval(file_get_contents(FILE_PATH));
}
// Initialize global count value in memory
$globalCount = intval($_SESSION['globalCount']);


// Session variable is either not set or empty
if (! isset($_SESSION['sessionCalls'])) {
    $_SESSION['sessionCalls'] = 0;
}
// Initialize session call count value in memory
$sessionCalls = intval($_SESSION['sessionCalls']);


// Session variable is either not set or empty
if (! isset($_SESSION['sessionCount'])) {
    $_SESSION['sessionCount'] = 0;
}
// Initialize session count value in memory
$sessionCount = intval($_SESSION['sessionCount']);


if (isset($_POST['user_leaving'])) {
    $user_leaving = $_POST['user_leaving'];
    if (is_bool($user_leaving) && $user_leaving == true)
    $userOnPage = false;
} else {
    $userOnPage = true;
}

if (isset($_POST['count'])) {
    $count = intval($_POST['count']);
    if ($count > 0 && $count <= MAX_COUNT) {
        $count = intval($_POST['count']);
        $globalCount += $count;
        $sessionCount += $count;
        $sessionCalls++;
    }     
}

// Update file if global count has changed
$fileCount = intval(file_get_contents(FILE_PATH));
if ($globalCount !== $fileCount && !$userOnPage) {
    file_put_contents(FILE_PATH, $fileCount + $sessionCount);
    $globalCount = intval(file_get_contents(FILE_PATH));
    $sessionCount = 0;
    $sessionCalls = 0;
} elseif ($globalCount !== $fileCount && $userOnPage && $sessionCalls >= 5) {
    file_put_contents(FILE_PATH, $fileCount + $sessionCount);
    $globalCount = intval(file_get_contents(FILE_PATH));
    $sessionCount = 0;
    $sessionCalls = 0;
}

echo $globalCount;

$_SESSION['sessionCount'] = $sessionCount;
$_SESSION['sessionCalls'] = $sessionCalls;
$_SESSION['globalCount'] = $globalCount;

?>
