<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Nota: este archivo fue reutilizado para grupos_familias (timestamp más antiguo, sin FK)
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grupos_familias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('siglas')->unique();
            $table->enum('relacion', ['tipo', 'familia_proveedor'])->default('tipo');
            $table->boolean('para_venta')->default(false);
            $table->boolean('para_consumo')->default(false);
            $table->boolean('para_otros')->default(false);
            $table->text('observacion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grupos_familias');
    }
};
