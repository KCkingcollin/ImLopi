<?php
// Define constants
define('FILE_PATH', 'count.txt');
define('MAX_COUNT', 10);

// Read the "global count" value from the file and store it in memory
$globalCount = (int) file_get_contents(FILE_PATH);

// Check if the "count" parameter was passed
if (isset($_POST['count'])) {
    $count = (int) $_POST['count'];
    
    // If the "count" value is within the maximum limit, update the "global count" value in memory
    if ($count <= MAX_COUNT) {
        $globalCount += $count;
    }
}

// Update the file and "global count" value every 5 seconds
$lastModifiedTime = filemtime(FILE_PATH);
while (true) {
    if ($globalCount != (int) file_get_contents(FILE_PATH)) {
        $difference = $globalCount - (int) file_get_contents(FILE_PATH);
        file_put_contents(FILE_PATH, $globalCount);
        flock($file, LOCK_UN);
    }
    sleep(5);
    clearstatcache();
    if (filemtime(FILE_PATH) > $lastModifiedTime) {
        $globalCount = (int) file_get_contents(FILE_PATH);
        $lastModifiedTime = filemtime(FILE_PATH);
    }
}
