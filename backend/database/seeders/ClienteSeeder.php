<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\TipoCliente;
use Illuminate\Database\Seeder;

class ClienteSeeder extends Seeder
{
    public function run(): void
    {
        $tipos = TipoCliente::all()->keyBy('nombre');

        $dist = $tipos['DISTRIBUIDOR']->id;
        $cons = $tipos['CONSUMIDOR FINAL']->id;
        $prov = $tipos['PROVEEDOR']->id;

        $clientes = [
            [
                'tipo_cliente_id' => $dist,
                'codigo'          => 'CLI-0001',
                'nombres'         => 'Roberto',
                'apellidos'       => 'Jiménez Castillo',
                'razon_social'    => 'AUDIOVISUAL NORTE S.A.',
                'ruc_cedula'      => '1790123456001',
                'email'           => 'ventas@audiovisualnorte.com',
                'telefono'        => '022987654',
                'celular'         => '0995678901',
                'direccion'       => 'Sector La Ofelia, Av. La Prensa N60-45',
                'ciudad'          => 'Quito',
                'descuento'       => 10.00,
                'limite_credito'  => 5000.00,
            ],
            [
                'tipo_cliente_id' => $cons,
                'codigo'          => 'CLI-0002',
                'nombres'         => 'Carlos Alberto',
                'apellidos'       => 'Mendoza Torres',
                'razon_social'    => null,
                'ruc_cedula'      => '1712345678',
                'email'           => 'carlos.mendoza@gmail.com',
                'telefono'        => '022456789',
                'celular'         => '0991234567',
                'direccion'       => 'Av. República E7-45 y Diego de Almagro',
                'ciudad'          => 'Quito',
                'descuento'       => 0.00,
                'limite_credito'  => 0.00,
            ],
            [
                'tipo_cliente_id' => $dist,
                'codigo'          => 'CLI-0003',
                'nombres'         => 'Ana Lucía',
                'apellidos'       => 'Peña Salazar',
                'razon_social'    => 'SOUND & LIGHT CIA. LTDA.',
                'ruc_cedula'      => '0990234567001',
                'email'           => 'ana.pena@soundlight.ec',
                'telefono'        => '042334455',
                'celular'         => '0968901234',
                'direccion'       => 'Urdesa Central, Bálsamos 327',
                'ciudad'          => 'Guayaquil',
                'descuento'       => 8.00,
                'limite_credito'  => 3000.00,
            ],
            [
                'tipo_cliente_id' => $cons,
                'codigo'          => 'CLI-0004',
                'nombres'         => 'Diego Sebastián',
                'apellidos'       => 'Flores Narváez',
                'razon_social'    => null,
                'ruc_cedula'      => '1756789012',
                'email'           => 'dflores.dj@gmail.com',
                'telefono'        => null,
                'celular'         => '0985678901',
                'direccion'       => 'Barrio San Juan, Pasaje B OE3-45',
                'ciudad'          => 'Quito',
                'descuento'       => 3.00,
                'limite_credito'  => 1000.00,
            ],
            [
                'tipo_cliente_id' => $prov,
                'codigo'          => 'CLI-0005',
                'nombres'         => 'Verónica',
                'apellidos'       => 'Cabrera Lema',
                'razon_social'    => 'IMPORTADORA TECNO AUDIO S.R.L.',
                'ruc_cedula'      => '0102345678001',
                'email'           => 'vcabrera@tecnoacuenca.com',
                'telefono'        => '072456789',
                'celular'         => '0978901234',
                'direccion'       => 'Av. Fray Vicente Solano 14-45',
                'ciudad'          => 'Cuenca',
                'descuento'       => 0.00,
                'limite_credito'  => 0.00,
            ],
        ];

        foreach ($clientes as $c) {
            Cliente::create($c);
        }
    }
}
