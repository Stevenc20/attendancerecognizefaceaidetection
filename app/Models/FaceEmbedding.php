<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FaceEmbedding extends Model
{
    protected $fillable = [
        'user_id',
        'embedding_data'
    ];

    protected $casts = [
        'embedding_data' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
