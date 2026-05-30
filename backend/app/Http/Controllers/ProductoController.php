<?php

namespace App\Http\Controllers;

use App\Models\GrupoFamilia;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    // ── GET /api/productos ─────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        $query = Producto::with('grupo');

        if ($buscar = $request->query('buscar')) {
            $query->where(function ($q) use ($buscar) {
                $q->where('codigo',      'ilike', "%{$buscar}%")
                  ->orWhere('nombre',    'ilike', "%{$buscar}%")
                  ->orWhere('marca',     'ilike', "%{$buscar}%")
                  ->orWhere('descripcion','ilike', "%{$buscar}%");
            });
        }

        match ($request->query('estado', 'todos')) {
            'activo'   => $query->where('activo', true),
            'inactivo' => $query->where('activo', false),
            default    => null,
        };

        $productos = $query->orderBy('codigo')->get()->map(fn($p) => $this->formato($p));

        return response()->json($productos);
    }

    // ── POST /api/productos ────────────────────────────────
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'grupo_id'        => 'required|exists:grupos_familias,id',
            'nombre'          => 'required|string|max:255',
            'unidad'          => 'required|string|max:20',
            'pvp'             => 'required|numeric|min:0',
            'pvd'             => 'required|numeric|min:0',
            'descuento'       => 'nullable|numeric|min:0|max:100',
            'iva'             => 'nullable|integer|min:0|max:100',
            'marca'           => 'nullable|string|max:100',
            'descripcion'     => 'nullable|string',
            'costo'           => 'nullable|numeric|min:0',
            'ref_importacion' => 'nullable|string|max:100',
        ]);

        $grupo   = GrupoFamilia::findOrFail($validated['grupo_id']);
        $codigo  = $this->generarCodigo($grupo);

        $producto = Producto::create(array_merge($validated, ['codigo' => $codigo]));
        $producto->load('grupo');

        return response()->json($this->formato($producto), 201);
    }

    // ── GET /api/productos/{id} ────────────────────────────
    public function show($id): JsonResponse
    {
        $producto = Producto::with('grupo')->findOrFail($id);
        return response()->json($this->formato($producto));
    }

    // ── PUT /api/productos/{id} ────────────────────────────
    public function update(Request $request, $id): JsonResponse
    {
        $producto = Producto::findOrFail($id);

        $validated = $request->validate([
            'grupo_id'        => 'required|exists:grupos_familias,id',
            'nombre'          => 'required|string|max:255',
            'unidad'          => 'required|string|max:20',
            'pvp'             => 'required|numeric|min:0',
            'pvd'             => 'required|numeric|min:0',
            'descuento'       => 'nullable|numeric|min:0|max:100',
            'iva'             => 'nullable|integer|min:0|max:100',
            'marca'           => 'nullable|string|max:100',
            'descripcion'     => 'nullable|string',
            'costo'           => 'nullable|numeric|min:0',
            'ref_importacion' => 'nullable|string|max:100',
        ]);

        // El código nunca cambia al actualizar
        $producto->update($validated);
        $producto->load('grupo');

        return response()->json($this->formato($producto));
    }

    // ── PATCH /api/productos/{id}/estado ──────────────────
    public function toggleEstado($id): JsonResponse
    {
        $producto = Producto::findOrFail($id);
        $producto->update(['activo' => !$producto->activo]);

        return response()->json([
            'id'      => $producto->id,
            'activo'  => $producto->activo,
            'message' => $producto->activo ? 'Producto activado.' : 'Producto inactivado.',
        ]);
    }

    // ── POST /api/productos/{id}/etiquetas ─────────────────
    public function generarEtiquetas(Request $request, $id): JsonResponse
    {
        $request->validate([
            'cantidad'   => 'required|integer|min:1|max:9999',
            'reimprimir' => 'boolean',
        ]);

        $producto   = Producto::findOrFail($id);
        $cantidad   = (int) $request->cantidad;
        $reimprimir = (bool) ($request->reimprimir ?? false);
        $actual     = $producto->ultima_etiqueta;

        if ($reimprimir) {
            $desde = max(1, $actual - $cantidad + 1);
            $hasta = $actual;
        } else {
            $desde = $actual + 1;
            $hasta = $actual + $cantidad;
            $producto->update(['ultima_etiqueta' => $hasta]);
        }

        return response()->json([
            'producto_id'     => $producto->id,
            'codigo'          => $producto->codigo,
            'ultima_etiqueta' => $producto->ultima_etiqueta,
            'cantidad'        => $cantidad,
            'desde'           => $desde,
            'hasta'           => $hasta,
            'reimprimir'      => $reimprimir,
        ]);
    }

    // ── GET /api/productos/siguiente-codigo/{grupoId} ─────
    public function siguienteCodigo($grupoId): JsonResponse
    {
        $grupo  = GrupoFamilia::findOrFail($grupoId);
        $codigo = $this->generarCodigo($grupo);
        return response()->json(['codigo' => $codigo]);
    }

    // ── Helpers ───────────────────────────────────────────
    private function generarCodigo(GrupoFamilia $grupo): string
    {
        $siglas  = strtoupper($grupo->siglas);
        $ultimo  = Producto::where('grupo_id', $grupo->id)
                           ->orderByDesc('id')
                           ->value('codigo');

        $secuencial = $ultimo
            ? (int) explode('.', $ultimo)[1] + 1
            : 1;

        return $siglas . '.' . str_pad($secuencial, 6, '0', STR_PAD_LEFT);
    }

    private function formato(Producto $p): array
    {
        return array_merge($p->toArray(), [
            'inv_total' => round($p->inv_bodega + $p->inv_muestra, 2),
            'pvp_iva'   => round($p->pvp * (1 + $p->iva / 100), 2),
        ]);
    }
}
