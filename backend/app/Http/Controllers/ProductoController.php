<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductoController extends Controller
{
    public function index(): JsonResponse
    {
        $productos = Producto::orderBy('nombre')->get();
        return response()->json($productos);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'codigo'        => 'required|string|unique:productos,codigo',
            'nombre'        => 'required|string',
            'grupo'         => 'nullable|string',
            'familia'       => 'nullable|string',
            'tipo'          => 'nullable|string',
            'proveedor'     => 'nullable|string',
            'precio_costo'  => 'nullable|numeric|min:0',
            'precio_venta'  => 'required|numeric|min:0',
            'stock'         => 'nullable|integer|min:0',
        ]);

        $producto = Producto::create($validated);
        return response()->json($producto, 201);
    }

    public function show($id): JsonResponse
    {
        $producto = Producto::findOrFail($id);
        return response()->json($producto);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $producto = Producto::findOrFail($id);

        $validated = $request->validate([
            'codigo'        => 'required|string|unique:productos,codigo,' . $id,
            'nombre'        => 'required|string',
            'grupo'         => 'nullable|string',
            'familia'       => 'nullable|string',
            'tipo'          => 'nullable|string',
            'proveedor'     => 'nullable|string',
            'precio_costo'  => 'nullable|numeric|min:0',
            'precio_venta'  => 'required|numeric|min:0',
            'stock'         => 'nullable|integer|min:0',
        ]);

        $producto->update($validated);
        return response()->json($producto);
    }

    public function destroy($id): JsonResponse
    {
        $producto = Producto::findOrFail($id);
        $producto->update(['activo' => false]);
        return response()->json(['message' => 'Producto inactivado correctamente.']);
    }

    public function toggleEstado($id): JsonResponse
    {
        $producto = Producto::findOrFail($id);
        $producto->update(['activo' => !$producto->activo]);
        return response()->json($producto);
    }
}
