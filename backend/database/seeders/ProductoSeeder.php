<?php

namespace Database\Seeders;

use App\Models\GrupoFamilia;
use App\Models\Producto;
use Illuminate\Database\Seeder;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        $grupos = GrupoFamilia::all()->keyBy('siglas');

        $productos = [
            // ILUMINACION
            ['siglas' => 'ILM', 'nombre' => 'PAR LED 54x3W RGBWA', 'unidad' => 'unidad', 'pvp' => 85.00,  'pvd' => 72.00,  'descuento' => 5,  'iva' => 12, 'marca' => 'CHAUVET',    'descripcion' => 'Par LED de 54 leds 3W con mezcla de colores RGBWA, control DMX',          'costo' => 45.00,  'ref_importacion' => 'CHV-SLIM-PAR-54'],
            ['siglas' => 'ILM', 'nombre' => 'CABEZA MOVIL BEAM 230W', 'unidad' => 'unidad', 'pvp' => 420.00, 'pvd' => 380.00, 'descuento' => 3,  'iva' => 12, 'marca' => 'ROBE',       'descripcion' => 'Moving head beam 230W con gobos intercambiables y prisma',              'costo' => 210.00, 'ref_importacion' => 'ROBE-BEAM-230'],
            ['siglas' => 'ILM', 'nombre' => 'BARRA LED WASH 7x12W', 'unidad' => 'unidad', 'pvp' => 155.00, 'pvd' => 130.00, 'descuento' => 5,  'iva' => 12, 'marca' => 'AMERICAN DJ', 'descripcion' => 'Barra LED wash con 7 leds de 12W RGBWA+UV para iluminación de escenario', 'costo' => 78.00,  'ref_importacion' => 'ADJ-MEGA-BAR-7'],

            // SONIDO
            ['siglas' => 'SON', 'nombre' => 'BAFLE ACTIVO 15" 1000W', 'unidad' => 'unidad', 'pvp' => 380.00, 'pvd' => 330.00, 'descuento' => 4,  'iva' => 12, 'marca' => 'QSC',        'descripcion' => 'Bafle activo de 15 pulgadas 1000W RMS con procesador DSP integrado',   'costo' => 195.00, 'ref_importacion' => 'QSC-K15-1000'],
            ['siglas' => 'SON', 'nombre' => 'SUBWOOFER ACTIVO 18" 2000W', 'unidad' => 'unidad', 'pvp' => 590.00, 'pvd' => 520.00, 'descuento' => 3,  'iva' => 12, 'marca' => 'JBL',        'descripcion' => 'Subwoofer activo de 18 pulgadas 2000W con crossover electrónico',       'costo' => 320.00, 'ref_importacion' => 'JBL-SRX818SP'],
            ['siglas' => 'SON', 'nombre' => 'MEZCLADORA 16 CANALES', 'unidad' => 'unidad', 'pvp' => 245.00, 'pvd' => 210.00, 'descuento' => 5,  'iva' => 12, 'marca' => 'YAMAHA',     'descripcion' => 'Mezcladora de audio 16 canales con efectos digitales integrados',      'costo' => 130.00, 'ref_importacion' => 'YMH-MG16XU'],

            // CABLES
            ['siglas' => 'CBL', 'nombre' => 'CABLE XLR-XLR 5M', 'unidad' => 'unidad', 'pvp' => 12.50,  'pvd' => 10.00,  'descuento' => 0,  'iva' => 12, 'marca' => 'NEUTRIK',    'descripcion' => 'Cable balanceado XLR macho a XLR hembra de 5 metros, núcleo de cobre OFC', 'costo' => 5.20,   'ref_importacion' => 'NTK-XLR-5M'],
            ['siglas' => 'CBL', 'nombre' => 'CABLE SPEAKON 10M', 'unidad' => 'unidad', 'pvp' => 18.00,  'pvd' => 14.50,  'descuento' => 0,  'iva' => 12, 'marca' => 'NEUTRIK',    'descripcion' => 'Cable speakon NL4 a NL4 de 10 metros para bafles activos y pasivos',   'costo' => 8.00,   'ref_importacion' => 'NTK-SPK-10M'],

            // DJS
            ['siglas' => 'DJS', 'nombre' => 'CONTROLADOR DJ 4 DECKS', 'unidad' => 'unidad', 'pvp' => 680.00, 'pvd' => 610.00, 'descuento' => 3,  'iva' => 12, 'marca' => 'PIONEER',    'descripcion' => 'Controlador DJ profesional de 4 decks con jog wheels y mixer integrado', 'costo' => 380.00, 'ref_importacion' => 'PIO-DDJ-SX3'],
            ['siglas' => 'DJS', 'nombre' => 'TORNAMESA DIRECT DRIVE', 'unidad' => 'unidad', 'pvp' => 490.00, 'pvd' => 440.00, 'descuento' => 2,  'iva' => 12, 'marca' => 'TECHNICS',   'descripcion' => 'Tornamesa de tracción directa para uso profesional en discotecas',     'costo' => 280.00, 'ref_importacion' => 'TCN-SL1200MK7'],

            // ACCESORIOS
            ['siglas' => 'ACC', 'nombre' => 'SOPORTE BAFLE TRIPODE', 'unidad' => 'par', 'pvp' => 45.00,  'pvd' => 38.00,  'descuento' => 5,  'iva' => 12, 'marca' => 'ON STAGE',   'descripcion' => 'Par de soportes trípode para bafles hasta 80kg, altura regulable',     'costo' => 22.00,  'ref_importacion' => 'ONS-SS7761B'],
            ['siglas' => 'ACC', 'nombre' => 'RACK RACK 4U SHALLOW', 'unidad' => 'unidad', 'pvp' => 95.00,  'pvd' => 82.00,  'descuento' => 3,  'iva' => 12, 'marca' => 'GATOR',      'descripcion' => 'Rack de aluminio 4U profundidad reducida para equipos de audio',       'costo' => 48.00,  'ref_importacion' => 'GTR-RACK-4U'],

            // PISOS LED
            ['siglas' => 'PLD', 'nombre' => 'PANEL PISO LED 50x50CM', 'unidad' => 'unidad', 'pvp' => 280.00, 'pvd' => 245.00, 'descuento' => 4,  'iva' => 12, 'marca' => 'CAMEO',      'descripcion' => 'Panel de piso LED 50x50cm RGB full color, resistente al tráfico',     'costo' => 145.00, 'ref_importacion' => 'CMO-PIXBAR-500'],

            // REPUESTOS
            ['siglas' => 'REP', 'nombre' => 'LAMPARA MSD 200W', 'unidad' => 'unidad', 'pvp' => 38.00,  'pvd' => 32.00,  'descuento' => 0,  'iva' => 12, 'marca' => 'OSRAM',      'descripcion' => 'Lámpara MSD 200W para cabezas móviles y scanners profesionales',      'costo' => 18.50,  'ref_importacion' => 'OSR-MSD200'],
            ['siglas' => 'REP', 'nombre' => 'FUENTE PODER 12V 5A', 'unidad' => 'unidad', 'pvp' => 22.00,  'pvd' => 18.00,  'descuento' => 0,  'iva' => 12, 'marca' => 'MEANWELL',   'descripcion' => 'Fuente de poder switching 12V 5A para equipos LED y accesorios',      'costo' => 10.00,  'ref_importacion' => 'MW-LRS-60-12'],
        ];

        foreach ($productos as $p) {
            $siglas = $p['siglas'];
            $grupo  = $grupos[$siglas];
            unset($p['siglas']);

            $count  = Producto::where('grupo_id', $grupo->id)->count();
            $codigo = strtoupper($siglas) . '.' . str_pad($count + 1, 6, '0', STR_PAD_LEFT);

            Producto::create(array_merge($p, [
                'grupo_id'   => $grupo->id,
                'codigo'     => $codigo,
                'inv_bodega' => rand(0, 25),
                'inv_muestra'=> rand(0, 5),
            ]));
        }
    }
}
