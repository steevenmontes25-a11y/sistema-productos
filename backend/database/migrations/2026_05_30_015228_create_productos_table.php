<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grupos_familias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('siglas', 10)->unique();
            $table->enum('relacion', ['tipo', 'familia_proveedor'])->default('tipo');
            $table->boolean('tipo_consumo')->default(false);
            $table->boolean('tipo_venta')->default(false);
            $table->boolean('tipo_otros')->default(false);
            $table->text('observacion')->nullable();
            $table->timestamps();
        });

        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grupo_id')->constrained('grupos_familias')->restrictOnDelete();
            $table->string('codigo', 20)->unique();
            $table->string('nombre');
            $table->string('unidad', 20)->default('unidad');
            $table->decimal('pvp', 10, 2)->default(0);
            $table->decimal('pvd', 10, 2)->default(0);
            $table->decimal('descuento', 5, 2)->default(0);
            $table->decimal('iva', 5, 2)->default(12);
            $table->string('marca')->nullable();
            $table->text('descripcion')->nullable();
            $table->decimal('costo', 10, 2)->default(0);
            $table->string('ref_importacion')->nullable();
            $table->integer('inv_bodega')->default(0);
            $table->integer('inv_muestra')->default(0);
            $table->integer('ultima_etiqueta')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
        Schema::dropIfExists('grupos_familias');
    }
};
