<?php

use App\Models\User;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$user = User::where('role', 'admin')->first();
auth()->login($user);
$response = $kernel->handle(Request::create('/admin/scanner'));
echo strlen(json_encode($response->headers->all()));
