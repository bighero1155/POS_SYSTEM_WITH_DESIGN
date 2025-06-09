<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'discount_type',
        'discount_amount',
        'total_amount',
        'amount_paid',
        'change_due',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
