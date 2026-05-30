<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Factura extends Model
{
    protected $fillable = [
        'cliente_id', 'numero', 'fecha',
        'subtotal', 'iva_total', 'total',
        'estado', 'observacion',
    ];

    protected $casts = [
        'fecha'     => 'date',
        'subtotal'  => 'float',
        'iva_total' => 'float',
        'total'     => 'float',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleFactura::class, 'factura_id');
    }
}
