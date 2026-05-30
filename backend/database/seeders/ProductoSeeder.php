<?php

namespace Database\Seeders;

use App\Models\GrupoFamilia;
use App\Models\Producto;
use Illuminate\Database\Seeder;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        $g = GrupoFamilia::all()->keyBy('siglas');

        $productos = [
            // Código        Grupo  Nombre                          Unidad   PVP     PVD     Dto  IVA  Marca          Descripción                                         Costo   Ref               BodEga  Muestra
            ['ILM.000001', 'ILM', 'PAR LED 54×3W RGBWA',          'unidad',  85.00,  72.00, 5.00, 12, 'CHAUVET',    'Par LED 54 leds 3W mezcla RGBWA, control DMX-512',   45.00, 'CHV-SLIM-PAR-54',  12.00,  2.00],
            ['ILM.000002', 'ILM', 'CABEZA MOVIL BEAM 230W',        'unidad', 420.00, 380.00, 3.00, 12, 'ROBE',       'Moving head beam 230W, gobos intercambiables, prisma', 210.00,'ROBE-BEAM-230',     4.00,  1.00],
            ['SON.000001', 'SON', 'BAFLE ACTIVO 15" 1000W',        'unidad', 380.00, 330.00, 4.00, 12, 'QSC',        'Bafle activo 15" 1000W RMS, procesador DSP integrado',195.00,'QSC-K15-1000',       6.00,  1.00],
            ['SON.000002', 'SON', 'SUBWOOFER ACTIVO 18" 2000W',    'unidad', 590.00, 520.00, 3.00, 12, 'JBL',        'Subwoofer activo 18" 2000W, crossover electrónico',   320.00,'JBL-SRX818SP',       3.00,  1.00],
            ['CBL.000001', 'CBL', 'CABLE XLR MACHO-HEMBRA 5M',    'unidad',  12.50,  10.00, 0.00, 12, 'NEUTRIK',    'Cable balanceado XLR 5m, núcleo OFC 0.22mm²',           5.20,'NTK-XLR-5M',        30.00,  3.00],
            ['CBL.000002', 'CBL', 'CABLE SPEAKON NL4 10M',        'unidad',  18.00,  14.50, 0.00, 12, 'NEUTRIK',    'Cable Speakon NL4 macho-macho 10m para bafles',          8.00,'NTK-SPK-10M',       20.00,  2.00],
            ['ACC.000001', 'ACC', 'SOPORTE BAFLE TRIPODE ALU.',    'par',     45.00,  38.00, 5.00, 12, 'ON STAGE',   'Par de soportes tripode aluminio, altura 90-200cm',     22.00,'ONS-SS7761B',        8.00,  1.00],
            ['DJS.000001', 'DJS', 'CONTROLADOR DJ 4 DECKS USB',   'unidad', 680.00, 610.00, 3.00, 12, 'PIONEER',    'Controlador DJ 4 decks, jog wheels, mixer integrado',   380.00,'PIO-DDJ-SX3',        2.00,  1.00],
            ['PLD.000001', 'PLD', 'PANEL PISO LED 50×50CM RGB',   'unidad', 280.00, 245.00, 4.00, 12, 'CAMEO',      'Panel piso LED 50x50cm RGB full color, resistente',     145.00,'CMO-PIXBAR-500',      6.00,  1.00],
            ['REP.000001', 'REP', 'LAMPARA MSD PLATINUM 200W',    'unidad',  38.00,  32.00, 0.00, 12, 'OSRAM',      'Lámpara MSD Platinum 200W para cabezas móviles',         18.50,'OSR-MSD200',         20.00,  0.00],
        ];

        foreach ($productos as [$codigo, $sigla, $nombre, $unidad, $pvp, $pvd, $dto, $iva, $marca, $desc, $costo, $ref, $bodega, $muestra]) {
            Producto::create([
                'grupo_id'        => $g[$sigla]->id,
                'codigo'          => $codigo,
                'nombre'          => $nombre,
                'unidad'          => $unidad,
                'pvp'             => $pvp,
                'pvd'             => $pvd,
                'descuento'       => $dto,
                'iva'             => $iva,
                'marca'           => $marca,
                'descripcion'     => $desc,
                'costo'           => $costo,
                'ref_importacion' => $ref,
                'inv_bodega'      => $bodega,
                'inv_muestra'     => $muestra,
                'activo'          => true,
            ]);
        }
    }
}
