<?php

// Define constants for the file path and the maximum count value
define("COUNTER_FILE_PATH", "count.txt");
define("MAX_COUNT_VALUE", 5);

// Check if the count parameter was passed
if (isset($_GET["count"])) {
  
  // Get the count value from the GET parameter
  $count = intval($_GET["count"]);
  
  // Make sure the count is within the valid range
  if ($count > 0 && $count <= MAX_COUNT_VALUE) {
    
    // Open the counter file and lock it for writing
    $file = fopen(COUNTER_FILE_PATH, "c+");
    if (flock($file, LOCK_EX)) {
      
      // Read the current count from the file
      $currentCount = intval(fgets($file));
      
      // Increment the count by the specified amount
      $newCount = $currentCount + $count;
      
      // Write the new count back to the file
      rewind($file);
      fwrite($file, $newCount . "\n");
      fflush($file);
      
      // Release the file lock and close the file
      flock($file, LOCK_UN);
      fclose($file);
      
      // Print the new count as the response
      echo $newCount;
      
    } else {
      
      // Failed to lock the file, return an error
      header("HTTP/1.1 500 Internal Server Error");
      echo "Failed to acquire lock on counter file.";
      
    }
    
  } else {
    
    // Count value is not within the valid range, return an error
    header("HTTP/1.1 400 Bad Request");
    echo "Invalid count value.";
    
  }
  
} else {
  
  // Count parameter was not passed, return an error
  header("HTTP/1.1 400 Bad Request");
  echo "Count parameter not provided.";
  
}

?>
