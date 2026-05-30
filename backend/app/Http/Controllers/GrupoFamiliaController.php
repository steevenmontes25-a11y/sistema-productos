<?php

namespace App\Http\Controllers;

use App\Models\GrupoFamilia;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GrupoFamiliaController extends Controller
{
    // ── GET /api/grupos-familias ───────────────────────────
    public function index(Request $request): JsonResponse
    {
        $query = GrupoFamilia::withCount('productos');

        if ($buscar = $request->query('buscar')) {
            $query->where(function ($q) use ($buscar) {
                $q->where('nombre', 'ilike', "%{$buscar}%")
                  ->orWhere('siglas', 'ilike', "%{$buscar}%");
            });
        }

        return response()->json(
            $query->orderBy('nombre')->get()
        );
    }

    // ── POST /api/grupos-familias ──────────────────────────
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre'       => 'required|string|max:100',
            'siglas'       => 'required|string|max:5|unique:grupos_familias,siglas',
            'relacion'     => 'required|in:tipo,familia_proveedor',
            'para_venta'   => 'boolean',
            'para_consumo' => 'boolean',
            'para_otros'   => 'boolean',
            'observacion'  => 'nullable|string',
            'activo'       => 'boolean',
        ]);

        // Siglas siempre en mayúsculas
        $validated['siglas'] = strtoupper($validated['siglas']);

        $grupo = GrupoFamilia::create($validated);
        $grupo->loadCount('productos');

        return response()->json($grupo, 201);
    }

    // ── PUT /api/grupos-familias/{id} ─────────────────────
    public function update(Request $request, $id): JsonResponse
    {
        $grupo = GrupoFamilia::findOrFail($id);

        $validated = $request->validate([
            'nombre'       => 'required|string|max:100',
            'siglas'       => "required|string|max:5|unique:grupos_familias,siglas,{$id}",
            'relacion'     => 'required|in:tipo,familia_proveedor',
            'para_venta'   => 'boolean',
            'para_consumo' => 'boolean',
            'para_otros'   => 'boolean',
            'observacion'  => 'nullable|string',
            'activo'       => 'boolean',
        ]);

        $validated['siglas'] = strtoupper($validated['siglas']);

        $grupo->update($validated);
        $grupo->loadCount('productos');

        return response()->json($grupo);
    }

    // ── DELETE /api/grupos-familias/{id} ──────────────────
    public function destroy($id): JsonResponse
    {
        $grupo = GrupoFamilia::withCount('productos')->findOrFail($id);

        if ($grupo->productos_count > 0) {
            return response()->json([
                'message' => 'No se puede eliminar porque tiene productos asociados.',
            ], 422);
        }

        $grupo->delete();
        return response()->json(['message' => 'Grupo eliminado correctamente.']);
    }
}
