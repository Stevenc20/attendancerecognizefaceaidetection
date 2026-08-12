<?php
$json = file_get_contents("storage/app/imports/latest_import.xlsx.json");
$data = json_decode($json, true);
var_dump(count((array)$data));
var_dump(!$data);
echo json_last_error_msg();
