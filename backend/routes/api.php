<?php

use App\Http\Controllers\GrupoFamiliaController;
use App\Http\Controllers\ProductoController;
use Illuminate\Support\Facades\Route;

// ── Módulo Productos (Antony) ─────────────────────────────
// La ruta estática debe ir ANTES del apiResource para evitar
// que Laravel confunda "siguiente-codigo" con un {id} de show
Route::get('productos/siguiente-codigo/{grupoId}', [ProductoController::class, 'siguienteCodigo']);
Route::patch('productos/{id}/estado',              [ProductoController::class, 'toggleEstado']);
Route::post('productos/{id}/etiquetas',             [ProductoController::class, 'generarEtiquetas']);
Route::apiResource('productos', ProductoController::class)->only(['index', 'store', 'show', 'update']);

Route::apiResource('grupos-familias', GrupoFamiliaController::class)
     ->only(['index', 'store', 'update', 'destroy']);

// ── Módulo Clientes (Darío) — pendiente de merge ──────────
