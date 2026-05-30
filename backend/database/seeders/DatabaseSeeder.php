<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            GrupoFamiliaSeeder::class,   // 1. sin FK
            TipoClienteSeeder::class,    // 2. sin FK
            ProductoSeeder::class,       // 3. FK → grupos_familias
            ClienteSeeder::class,        // 4. FK → tipo_clientes
            FacturaSeeder::class,        // 5. FK → clientes + productos
        ]);
    }
}
