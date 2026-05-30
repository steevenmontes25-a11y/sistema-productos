<?php

namespace Database\Seeders;

use App\Models\GrupoFamilia;
use Illuminate\Database\Seeder;

class GrupoFamiliaSeeder extends Seeder
{
    public function run(): void
    {
        $grupos = [
            ['nombre' => 'ILUMINACION',  'siglas' => 'ILM', 'relacion' => 'tipo',             'tipo_venta' => true,  'tipo_consumo' => false, 'tipo_otros' => false, 'observacion' => 'Equipos de iluminación profesional'],
            ['nombre' => 'SONIDO',       'siglas' => 'SON', 'relacion' => 'tipo',             'tipo_venta' => true,  'tipo_consumo' => false, 'tipo_otros' => false, 'observacion' => 'Equipos de audio y sonido'],
            ['nombre' => 'CABLES',       'siglas' => 'CBL', 'relacion' => 'tipo',             'tipo_venta' => true,  'tipo_consumo' => true,  'tipo_otros' => false, 'observacion' => 'Cables y conectores'],
            ['nombre' => 'DJS',          'siglas' => 'DJS', 'relacion' => 'tipo',             'tipo_venta' => true,  'tipo_consumo' => false, 'tipo_otros' => false, 'observacion' => 'Equipos para DJs'],
            ['nombre' => 'ACCESORIOS',   'siglas' => 'ACC', 'relacion' => 'tipo',             'tipo_venta' => true,  'tipo_consumo' => true,  'tipo_otros' => false, 'observacion' => 'Accesorios varios'],
            ['nombre' => 'COMPUTADORAS', 'siglas' => 'CMP', 'relacion' => 'tipo',             'tipo_venta' => true,  'tipo_consumo' => false, 'tipo_otros' => false, 'observacion' => 'Equipos de cómputo'],
            ['nombre' => 'PISOS LED',    'siglas' => 'PLD', 'relacion' => 'tipo',             'tipo_venta' => true,  'tipo_consumo' => false, 'tipo_otros' => false, 'observacion' => 'Pisos y paneles LED'],
            ['nombre' => 'REPUESTOS',    'siglas' => 'REP', 'relacion' => 'familia_proveedor','tipo_venta' => false, 'tipo_consumo' => true,  'tipo_otros' => true,  'observacion' => 'Repuestos y partes'],
        ];

        foreach ($grupos as $g) {
            GrupoFamilia::create($g);
        }
    }
}
