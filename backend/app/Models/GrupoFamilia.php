<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GrupoFamilia extends Model
{
    protected $table = 'grupos_familias';

    protected $fillable = [
        'nombre', 'siglas', 'relacion',
        'tipo_consumo', 'tipo_venta', 'tipo_otros', 'observacion',
    ];

    protected $casts = [
        'tipo_consumo' => 'boolean',
        'tipo_venta'   => 'boolean',
        'tipo_otros'   => 'boolean',
    ];

    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class, 'grupo_id');
    }
}
