<?php

namespace App\Http\Controllers;

use App\Models\GrupoFamilia;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GrupoFamiliaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = GrupoFamilia::withCount('productos');

        if ($buscar = $request->query('buscar')) {
            $query->where(function ($q) use ($buscar) {
                $q->where('nombre', 'ilike', "%{$buscar}%")
                  ->orWhere('siglas', 'ilike', "%{$buscar}%");
            });
        }

        return response()->json($query->orderBy('nombre')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre'        => 'required|string|max:100',
            'siglas'        => 'required|string|max:10|unique:grupos_familias,siglas',
            'relacion'      => 'required|in:tipo,familia_proveedor',
            'tipo_consumo'  => 'boolean',
            'tipo_venta'    => 'boolean',
            'tipo_otros'    => 'boolean',
            'observacion'   => 'nullable|string',
        ]);

        $grupo = GrupoFamilia::create($validated);
        $grupo->loadCount('productos');

        return response()->json($grupo, 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $grupo = GrupoFamilia::findOrFail($id);

        $validated = $request->validate([
            'nombre'       => 'required|string|max:100',
            'siglas'       => 'required|string|max:10|unique:grupos_familias,siglas,' . $id,
            'relacion'     => 'required|in:tipo,familia_proveedor',
            'tipo_consumo' => 'boolean',
            'tipo_venta'   => 'boolean',
            'tipo_otros'   => 'boolean',
            'observacion'  => 'nullable|string',
        ]);

        $grupo->update($validated);
        $grupo->loadCount('productos');

        return response()->json($grupo);
    }

    public function destroy($id): JsonResponse
    {
        $grupo = GrupoFamilia::withCount('productos')->findOrFail($id);

        if ($grupo->productos_count > 0) {
            return response()->json([
                'message' => 'No se puede eliminar porque tiene productos asociados. Primero reasigne o elimine los productos.',
            ], 422);
        }

        $grupo->delete();
        return response()->json(['message' => 'Grupo eliminado correctamente.']);
    }
}
