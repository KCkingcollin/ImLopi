<?php

// Define constants
define('FILE_PATH', 'count.txt');
define('MAX_COUNT', 50);

// Initialize global count value in memory
$globalCount = intval(file_get_contents(FILE_PATH));

// Check if count parameter was passed
if (isset($_POST['count'])) {
    $count = intval($_POST['count']);
    // Check if count is within max count and not 0
    if ($count > 0 && $count <= MAX_COUNT) {
        // Add count value to global count in memory
        $globalCount += $count;
    }
}

// Echo global count
echo $globalCount;

// Update file if global count has changed
if ($globalCount !== intval(file_get_contents(FILE_PATH))) {
    $difference = $globalCount - intval(file_get_contents(FILE_PATH));
    file_put_contents(FILE_PATH, $globalCount);
    $globalCount = intval(file_get_contents(FILE_PATH));
}

// test push

?>
