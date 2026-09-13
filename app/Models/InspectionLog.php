<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InspectionLog extends Model
{
    protected $guarded = [];

    public function equipment() { return $this->belongsTo(Equipment::class); }
    public function user() { return $this->belongsTo(User::class); }
}