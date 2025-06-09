<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function storeTransaction(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'discount_type' => 'required|in:none,senior,student,pwd',
            'amount_paid' => 'required|numeric|min:0',
        ]);

        $order = Order::find($request->order_id);
        $discountType = $request->discount_type;
        $discountRate = $this->getDiscountRate($discountType);
        $discountAmount = $order->total_amount * $discountRate;
        $totalAmount = $order->total_amount - $discountAmount;
        $amountPaid = $request->amount_paid;
        $changeDue = $amountPaid - $totalAmount;

        $transaction = Transaction::create([
            'order_id' => $order->id,
            'discount_type' => $discountType,
            'discount_amount' => $discountAmount,
            'total_amount' => $totalAmount,
            'amount_paid' => $amountPaid,
            'change_due' => $changeDue,
        ]);

        return response()->json([
            'message' => 'Transaction successful',
            'transaction' => $transaction,
        ]);
    }

    private function getDiscountRate(string $discountType): float
    {
        return match ($discountType) {
            'senior' => 0.20,
            'student' => 0.15,
            'pwd' => 0.25,
            default => 0.0,
        };
    }
}
