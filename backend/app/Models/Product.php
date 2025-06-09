<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'sku',
        'description',
        'price',
        'quantity',
        'reorder_level',
        'category_id',
        'image'
    ];

    public function scopeLowStock($query, $threshold = 5)
    {
        return $query->where('quantity', '<=', $threshold);
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
