<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Producto extends Model
{
    protected $fillable = [
        'grupo_id', 'codigo', 'nombre', 'unidad',
        'pvp', 'pvd', 'descuento', 'iva',
        'marca', 'descripcion', 'costo', 'ref_importacion',
        'inv_bodega', 'inv_muestra', 'ultima_etiqueta', 'activo',
    ];

    protected $casts = [
        'pvp'             => 'float',
        'pvd'             => 'float',
        'descuento'       => 'float',
        'iva'             => 'integer',
        'costo'           => 'float',
        'inv_bodega'      => 'float',
        'inv_muestra'     => 'float',
        'ultima_etiqueta' => 'integer',
        'activo'          => 'boolean',
    ];

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(GrupoFamilia::class, 'grupo_id');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleFactura::class, 'producto_id');
    }
}
