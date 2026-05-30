<?php

namespace Database\Seeders;

use App\Models\TipoCliente;
use Illuminate\Database\Seeder;

class TipoClienteSeeder extends Seeder
{
    public function run(): void
    {
        $tipos = [
            ['nombre' => 'DISTRIBUIDOR',    'descripcion' => 'Empresa o persona que revende los productos con descuento especial', 'activo' => true],
            ['nombre' => 'CONSUMIDOR FINAL','descripcion' => 'Persona natural que adquiere para uso personal al precio público',   'activo' => true],
            ['nombre' => 'PROVEEDOR',       'descripcion' => 'Empresa proveedora de insumos y equipos para reposición de stock',   'activo' => true],
        ];

        foreach ($tipos as $t) {
            TipoCliente::create($t);
        }
    }
}
