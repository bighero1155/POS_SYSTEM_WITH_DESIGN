<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SurveyController;


Route::get('/survey', [SurveyController::class, 'index']);
Route::post('/survey', [SurveyController::class, 'store']);
Route::controller(EmailController::class)->group(function () {
    Route::post('/email', 'store');
});

Route::post('/login', [AuthController::class, 'login']);
Route::prefix('reports')->group(function () {
    Route::get('/product-stock', [ReportController::class, 'getProductStockData']);
});

Route::middleware('auth:sanctum')->group(function () {


    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/user-role', function () {
        return response()->json(['role' => auth()->user->role]);
    });

    Route::post('/transactions', [TransactionController::class, 'storeTransaction']);

    Route::prefix('orders')->group(function () {
        Route::post('/store', [OrderController::class, 'store']);
        Route::get('/all', [OrderController::class, 'index']);
    });

    Route::prefix('products')->group(function () {
        Route::post('store', [ProductController::class, 'StoreProduct']);
        Route::put('update/{id}', [ProductController::class, 'UpdateProduct']);
        Route::delete('delete/{id}', [ProductController::class, 'DeleteProduct']);
        Route::get('low-stock', [ProductController::class, 'getLowStockProducts']);
        Route::get('all', [ProductController::class, 'GetAllProducts']);
    });

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user_id}', [UserController::class, 'update']);
    Route::delete('/users/{user_id}', [UserController::class, 'destroy']);
});
