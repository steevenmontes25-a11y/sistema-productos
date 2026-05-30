<?php

namespace App\Http\Controllers;

use App\Models\GrupoFamilia;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Producto::with('grupo');

        if ($buscar = $request->query('buscar')) {
            $query->where(function ($q) use ($buscar) {
                $q->where('codigo', 'ilike', "%{$buscar}%")
                  ->orWhere('nombre', 'ilike', "%{$buscar}%")
                  ->orWhere('descripcion', 'ilike', "%{$buscar}%")
                  ->orWhere('marca', 'ilike', "%{$buscar}%");
            });
        }

        $estado = $request->query('estado', 'todos');
        if ($estado === 'activo') {
            $query->where('activo', true);
        } elseif ($estado === 'inactivo') {
            $query->where('activo', false);
        }

        $productos = $query->orderBy('codigo')->get()->map(function ($p) {
            return array_merge($p->toArray(), [
                'inv_total' => $p->inv_total,
                'pvp_iva'   => $p->pvp_iva,
            ]);
        });

        return response()->json($productos);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'grupo_id'       => 'required|exists:grupos_familias,id',
            'nombre'         => 'required|string|max:255',
            'unidad'         => 'required|string|max:20',
            'pvp'            => 'required|numeric|min:0',
            'pvd'            => 'required|numeric|min:0',
            'descuento'      => 'required|numeric|min:0|max:100',
            'iva'            => 'required|numeric|min:0|max:100',
            'marca'          => 'required|string|max:100',
            'descripcion'    => 'required|string',
            'costo'          => 'required|numeric|min:0',
            'ref_importacion'=> 'required|string|max:100',
        ]);

        $grupo  = GrupoFamilia::findOrFail($validated['grupo_id']);
        $codigo = $this->generarCodigo($grupo);

        $producto = Producto::create(array_merge($validated, ['codigo' => $codigo]));
        $producto->load('grupo');

        return response()->json(array_merge($producto->toArray(), [
            'inv_total' => $producto->inv_total,
            'pvp_iva'   => $producto->pvp_iva,
        ]), 201);
    }

    public function show($id): JsonResponse
    {
        $producto = Producto::with('grupo')->findOrFail($id);
        return response()->json(array_merge($producto->toArray(), [
            'inv_total' => $producto->inv_total,
            'pvp_iva'   => $producto->pvp_iva,
        ]));
    }

    public function update(Request $request, $id): JsonResponse
    {
        $producto = Producto::findOrFail($id);

        $validated = $request->validate([
            'grupo_id'       => 'required|exists:grupos_familias,id',
            'nombre'         => 'required|string|max:255',
            'unidad'         => 'required|string|max:20',
            'pvp'            => 'required|numeric|min:0',
            'pvd'            => 'required|numeric|min:0',
            'descuento'      => 'required|numeric|min:0|max:100',
            'iva'            => 'required|numeric|min:0|max:100',
            'marca'          => 'required|string|max:100',
            'descripcion'    => 'required|string',
            'costo'          => 'required|numeric|min:0',
            'ref_importacion'=> 'required|string|max:100',
        ]);

        $producto->update($validated);
        $producto->load('grupo');

        return response()->json(array_merge($producto->toArray(), [
            'inv_total' => $producto->inv_total,
            'pvp_iva'   => $producto->pvp_iva,
        ]));
    }

    public function toggleEstado($id): JsonResponse
    {
        $producto = Producto::findOrFail($id);
        $producto->update(['activo' => !$producto->activo]);

        return response()->json([
            'id'     => $producto->id,
            'activo' => $producto->activo,
            'message' => $producto->activo ? 'Producto activado.' : 'Producto inactivado.',
        ]);
    }

    public function generarEtiquetas(Request $request, $id): JsonResponse
    {
        $request->validate([
            'cantidad'    => 'required|integer|min:1|max:9999',
            'reimprimir'  => 'boolean',
        ]);

        $producto   = Producto::findOrFail($id);
        $cantidad   = (int) $request->cantidad;
        $reimprimir = (bool) ($request->reimprimir ?? false);

        $desde = $producto->ultima_etiqueta + 1;
        $hasta = $producto->ultima_etiqueta + $cantidad;

        if (!$reimprimir) {
            $producto->update(['ultima_etiqueta' => $hasta]);
        } else {
            $desde = max(1, $producto->ultima_etiqueta - $cantidad + 1);
            $hasta = $producto->ultima_etiqueta;
        }

        return response()->json([
            'producto_id'      => $producto->id,
            'codigo'           => $producto->codigo,
            'ultima_etiqueta'  => $producto->ultima_etiqueta,
            'desde'            => $desde,
            'hasta'            => $hasta,
            'cantidad'         => $cantidad,
            'reimprimir'       => $reimprimir,
        ]);
    }

    public function siguienteCodigo($grupoId): JsonResponse
    {
        $grupo  = GrupoFamilia::findOrFail($grupoId);
        $codigo = $this->generarCodigo($grupo);
        return response()->json(['codigo' => $codigo]);
    }

    private function generarCodigo(GrupoFamilia $grupo): string
    {
        $siglas  = strtoupper($grupo->siglas);
        $ultimo  = Producto::where('grupo_id', $grupo->id)
                            ->orderByDesc('id')
                            ->value('codigo');

        if ($ultimo) {
            $partes  = explode('.', $ultimo);
            $secuencial = (int) end($partes) + 1;
        } else {
            $secuencial = 1;
        }

        return $siglas . '.' . str_pad($secuencial, 6, '0', STR_PAD_LEFT);
    }
}
