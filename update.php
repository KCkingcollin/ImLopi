<?php
$file = "count.txt";
if (file_exists($file)) {
    echo file_get_contents($file);
} else {
    echo "0";
}
?>
