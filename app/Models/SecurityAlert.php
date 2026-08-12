<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SecurityAlert extends Model
{
    protected $fillable = [
        'type',
        'description',
        'device_id',
        'image_path',
        'resolved_at',
    ];
}
