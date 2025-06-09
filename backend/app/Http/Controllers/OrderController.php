<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $v = $request->validate([
            'items'             => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity'  => 'required|integer|min:1',
            'items.*.price'     => 'required|numeric|min:0',
            'original_total'    => 'required|numeric|min:0',
            'discount_type'     => 'nullable|string',
            'discount_amount'   => 'required|numeric|min:0',
            'final_amount'      => 'required|numeric|min:0',
            'amount_paid'       => 'required|numeric|min:0',
            'change_due'        => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $order = Order::create([
                'original_total'  => $v['original_total'],
                'discount_type'   => $v['discount_type'],
                'discount_amount' => $v['discount_amount'],
                'final_amount'    => $v['final_amount'],
                'amount_paid'     => $v['amount_paid'],
                'change_due'      => $v['change_due'],
            ]);

            foreach ($v['items'] as $it) {
                $prod = Product::find($it['product_id']);

                if ($prod->quantity < $it['quantity']) {
                    throw new \Exception("Not enough stock for product: {$prod->name}");
                }
                $prod->quantity -= $it['quantity'];
                $prod->save();

                OrderItem::create([
                    'order_id'     => $order->id,
                    'product_id'   => $prod->id,
                    'product_name' => $prod->name,
                    'quantity'     => $it['quantity'],
                    'price'        => $it['price'],
                ]);
            }

            DB::commit();
            $order->load('items');
            return response()->json([
                'message' => 'Order created successfully',
                'order'   => $order
            ], 201);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json([
                'error' => 'Creation failed',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
