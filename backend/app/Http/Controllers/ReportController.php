<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function getProductStockData(): JsonResponse
    {
        try {
            $products = Product::select('id', 'name', 'quantity')
                ->withSum('orderItems as total_purchased', 'quantity')
                ->get();

            $labels = $products->pluck('name');
            $quantities = $products->pluck('quantity');
            $purchased = $products->pluck('total_purchased');

            return response()->json([
                'labels' => $labels,
                'quantities' => $quantities,
                'purchased' => $purchased,
                'products' => $products
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to fetch product data.'], 500);
        }
    }
}
