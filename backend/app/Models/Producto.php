<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $fillable = [
        'codigo',
        'nombre',
        'grupo',
        'familia',
        'tipo',
        'proveedor',
        'precio_costo',
        'precio_venta',
        'stock',
        'activo',
    ];

    protected $casts = [
        'precio_costo' => 'float',
        'precio_venta' => 'float',
        'stock'        => 'integer',
        'activo'       => 'boolean',
    ];
}
