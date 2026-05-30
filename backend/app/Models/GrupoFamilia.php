<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GrupoFamilia extends Model
{
    protected $table = 'grupos_familias';

    protected $fillable = [
        'nombre', 'siglas', 'relacion',
        'para_venta', 'para_consumo', 'para_otros',
        'observacion', 'activo',
    ];

    protected $casts = [
        'para_venta'   => 'boolean',
        'para_consumo' => 'boolean',
        'para_otros'   => 'boolean',
        'activo'       => 'boolean',
    ];

    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class, 'grupo_id');
    }
}
