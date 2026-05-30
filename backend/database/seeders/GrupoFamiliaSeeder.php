<?php

namespace Database\Seeders;

use App\Models\GrupoFamilia;
use Illuminate\Database\Seeder;

class GrupoFamiliaSeeder extends Seeder
{
    public function run(): void
    {
        $grupos = [
            ['nombre' => 'ILUMINACION',  'siglas' => 'ILM', 'relacion' => 'tipo', 'para_venta' => true,  'para_consumo' => false, 'para_otros' => false, 'observacion' => 'Equipos de iluminación profesional para escenario y eventos'],
            ['nombre' => 'SONIDO',       'siglas' => 'SON', 'relacion' => 'tipo', 'para_venta' => true,  'para_consumo' => false, 'para_otros' => false, 'observacion' => 'Equipos de audio y sonido profesional'],
            ['nombre' => 'CABLES',       'siglas' => 'CBL', 'relacion' => 'tipo', 'para_venta' => true,  'para_consumo' => true,  'para_otros' => false, 'observacion' => 'Cables y conectores de audio y datos'],
            ['nombre' => 'ACCESORIOS',   'siglas' => 'ACC', 'relacion' => 'tipo', 'para_venta' => true,  'para_consumo' => true,  'para_otros' => false, 'observacion' => 'Accesorios y complementos varios'],
            ['nombre' => 'DJS',          'siglas' => 'DJS', 'relacion' => 'tipo', 'para_venta' => true,  'para_consumo' => false, 'para_otros' => false, 'observacion' => 'Equipos y controladores para DJs'],
            ['nombre' => 'COMPUTADORAS', 'siglas' => 'CMP', 'relacion' => 'tipo', 'para_venta' => true,  'para_consumo' => false, 'para_otros' => false, 'observacion' => 'Equipos de cómputo y periféricos'],
            ['nombre' => 'PISOS LED',    'siglas' => 'PLD', 'relacion' => 'tipo', 'para_venta' => true,  'para_consumo' => false, 'para_otros' => false, 'observacion' => 'Paneles y pisos de LEDs para espectáculos'],
            ['nombre' => 'REPUESTOS',    'siglas' => 'REP', 'relacion' => 'familia_proveedor', 'para_venta' => false, 'para_consumo' => true, 'para_otros' => true, 'observacion' => 'Repuestos y partes para mantenimiento de equipos'],
        ];

        foreach ($grupos as $g) {
            GrupoFamilia::create(array_merge(['activo' => true], $g));
        }
    }
}
