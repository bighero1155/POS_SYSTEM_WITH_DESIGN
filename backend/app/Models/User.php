<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $primaryKey = 'user_id';
    protected $hidden = [
        'password',
    ];

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'age',
        'address',
        'contact_number',
        'email',
        'password',
        'role',
        'last_login_at',
    ];

    protected $dates = ['deleted_at'];

    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id', 'user_id');
    }
}
