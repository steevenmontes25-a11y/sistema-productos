<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grupo_id')
                  ->nullable()
                  ->constrained('grupos_familias')
                  ->nullOnDelete();
            $table->string('codigo')->unique();
            $table->string('nombre');
            $table->string('unidad')->default('unidad');
            $table->decimal('pvp', 10, 2)->default(0);
            $table->decimal('pvd', 10, 2)->default(0);
            $table->decimal('descuento', 5, 2)->default(0);
            $table->integer('iva')->default(12);
            $table->string('marca')->nullable();
            $table->text('descripcion')->nullable();
            $table->decimal('costo', 10, 2)->default(0);
            $table->string('ref_importacion')->nullable();
            $table->decimal('inv_bodega', 10, 2)->default(0);
            $table->decimal('inv_muestra', 10, 2)->default(0);
            $table->integer('ultima_etiqueta')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
