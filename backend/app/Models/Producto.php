<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'iva'             => 'float',
        'costo'           => 'float',
        'inv_bodega'      => 'integer',
        'inv_muestra'     => 'integer',
        'ultima_etiqueta' => 'integer',
        'activo'          => 'boolean',
    ];

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(GrupoFamilia::class, 'grupo_id');
    }

    public function getInvTotalAttribute(): int
    {
        return $this->inv_bodega + $this->inv_muestra;
    }

    public function getPvpIvaAttribute(): float
    {
        return round($this->pvp * (1 + $this->iva / 100), 2);
    }
}
