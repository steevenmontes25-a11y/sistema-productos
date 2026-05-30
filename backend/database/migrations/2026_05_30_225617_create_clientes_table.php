<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tipo_cliente_id')
                  ->nullable()
                  ->constrained('tipo_clientes')
                  ->nullOnDelete();
            $table->string('codigo')->unique();
            $table->string('nombres');
            $table->string('apellidos')->nullable();
            $table->string('razon_social')->nullable();
            $table->string('ruc_cedula')->unique()->nullable();
            $table->string('email')->nullable();
            $table->string('telefono')->nullable();
            $table->string('celular')->nullable();
            $table->text('direccion')->nullable();
            $table->string('ciudad')->nullable();
            $table->decimal('descuento', 5, 2)->default(0);
            $table->decimal('limite_credito', 10, 2)->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
