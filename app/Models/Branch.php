<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $guarded = [];
    public function equipment() { 
        return $this->hasMany(Equipment::class); 
    }
}
