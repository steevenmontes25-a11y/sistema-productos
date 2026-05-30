<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cliente extends Model
{
    protected $fillable = [
        'tipo_cliente_id', 'codigo', 'nombres', 'apellidos',
        'razon_social', 'ruc_cedula', 'email',
        'telefono', 'celular', 'direccion', 'ciudad',
        'descuento', 'limite_credito', 'activo',
    ];

    protected $casts = [
        'descuento'      => 'float',
        'limite_credito' => 'float',
        'activo'         => 'boolean',
    ];

    public function tipoCliente(): BelongsTo
    {
        return $this->belongsTo(TipoCliente::class, 'tipo_cliente_id');
    }

    public function facturas(): HasMany
    {
        return $this->hasMany(Factura::class, 'cliente_id');
    }

    public function getNombreCompletoAttribute(): string
    {
        return trim("{$this->nombres} {$this->apellidos}");
    }
}
