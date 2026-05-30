<?php

use App\Http\Controllers\GrupoFamiliaController;
use App\Http\Controllers\ProductoController;
use Illuminate\Support\Facades\Route;

// Grupos / Familias
Route::apiResource('grupos', GrupoFamiliaController::class)->only(['index', 'store', 'update', 'destroy']);

// Productos
Route::get('productos/siguiente-codigo/{grupoId}', [ProductoController::class, 'siguienteCodigo']);
Route::patch('productos/{id}/estado', [ProductoController::class, 'toggleEstado']);
Route::post('productos/{id}/etiquetas', [ProductoController::class, 'generarEtiquetas']);
Route::apiResource('productos', ProductoController::class)->only(['index', 'store', 'show', 'update']);
