<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\DetalleFactura;
use App\Models\Factura;
use App\Models\Producto;
use Illuminate\Database\Seeder;

class FacturaSeeder extends Seeder
{
    public function run(): void
    {
        $clientes  = Cliente::all()->keyBy('codigo');
        $productos = Producto::all()->keyBy('codigo');

        // ─── Definición de facturas ────────────────────────────────
        // Cada línea de detalle: [codigo_producto, cantidad, precio_unitario, descuento%]
        $facturas = [
            [
                'numero'      => 'FAC-000001',
                'fecha'       => '2026-05-10',
                'cliente'     => 'CLI-0002',   // Consumidor final
                'estado'      => 'pagada',
                'observacion' => 'Pago en efectivo. Entrega inmediata.',
                'detalles'    => [
                    ['ILM.000001', 2,  85.00, 0.00],   // 2 PAR LED
                    ['CBL.000001', 4,  12.50, 0.00],   // 4 cables XLR
                    ['ACC.000001', 1,  45.00, 0.00],   // 1 par soportes
                ],
            ],
            [
                'numero'      => 'FAC-000002',
                'fecha'       => '2026-05-18',
                'cliente'     => 'CLI-0001',   // Distribuidor (10% dto)
                'estado'      => 'pendiente',
                'observacion' => 'Crédito 30 días. Despacho a bodega cliente.',
                'detalles'    => [
                    ['SON.000001', 2, 380.00, 10.00],   // 2 bafles con 10% dto
                    ['SON.000002', 1, 590.00, 10.00],   // 1 subwoofer con 10% dto
                    ['CBL.000002', 4,  18.00,  0.00],   // 4 cables speakon
                ],
            ],
            [
                'numero'      => 'FAC-000003',
                'fecha'       => '2026-05-25',
                'cliente'     => 'CLI-0004',   // Consumidor final DJ
                'estado'      => 'pendiente',
                'observacion' => 'Reserva con 50% de anticipo.',
                'detalles'    => [
                    ['DJS.000001', 1, 680.00, 3.00],   // Controlador DJ con 3% dto
                    ['CBL.000001', 2,  12.50, 0.00],   // 2 cables XLR
                    ['ACC.000001', 1,  45.00, 0.00],   // 1 par soportes
                ],
            ],
        ];

        foreach ($facturas as $fData) {
            $detallesCalc = [];
            $subtotalFactura = 0.0;
            $ivaFactura      = 0.0;

            foreach ($fData['detalles'] as [$codProd, $cantidad, $precioUnit, $descuento]) {
                $producto  = $productos[$codProd];
                // subtotal_linea = cantidad × precio_unitario × (1 - descuento/100)
                $subtLinea = round($cantidad * $precioUnit * (1 - $descuento / 100), 2);
                // iva_linea = subtotal_linea × iva% / 100
                $ivaLinea  = round($subtLinea * $producto->iva / 100, 2);

                $subtotalFactura += $subtLinea;
                $ivaFactura      += $ivaLinea;

                $detallesCalc[] = [
                    'producto_id'    => $producto->id,
                    'cantidad'       => $cantidad,
                    'precio_unitario'=> $precioUnit,
                    'descuento'      => $descuento,
                    'subtotal'       => $subtLinea,
                ];
            }

            $subtotalFactura = round($subtotalFactura, 2);
            $ivaFactura      = round($ivaFactura, 2);
            $totalFactura    = round($subtotalFactura + $ivaFactura, 2);

            $factura = Factura::create([
                'cliente_id'  => $clientes[$fData['cliente']]->id,
                'numero'      => $fData['numero'],
                'fecha'       => $fData['fecha'],
                'subtotal'    => $subtotalFactura,
                'iva_total'   => $ivaFactura,
                'total'       => $totalFactura,
                'estado'      => $fData['estado'],
                'observacion' => $fData['observacion'],
            ]);

            foreach ($detallesCalc as $detalle) {
                DetalleFactura::create(array_merge(
                    ['factura_id' => $factura->id],
                    $detalle
                ));
            }
        }
    }
}
