<?php

use App\Http\Controllers\ProductoController;
use Illuminate\Support\Facades\Route;

Route::apiResource('productos', ProductoController::class);
Route::patch('productos/{id}/estado', [ProductoController::class, 'toggleEstado']);
