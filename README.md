# Sistema de Gestión — Módulo Productos

## Integrantes
- **Antony** → Módulo de Productos (rama: `modulo-productos`)
- **Darío** → Módulo de Clientes (rama: `modulo-clientes`)

## Stack tecnológico
- **Backend:** Laravel 12 (API REST)
- **Frontend:** React + Vite + Tailwind CSS v4
- **Base de datos:** PostgreSQL 16 (Neon.tech)
- **Íconos:** Lucide React

## Módulo de Productos (Antony)

### Funcionalidades
- CRUD de **Grupos/Familia** con validaciones (siglas únicas, max 5 chars)
- CRUD de **Productos** con código auto-generado (`ILM.000001`, `SON.000002`, …)
- Búsqueda con **skeleton loading** mientras espera la API
- **Toggle activo/inactivo** — sin eliminación física nunca
- **Generación de etiquetas** con secuencial y opción de reimprimir
- Protección: no se elimina un grupo que tenga productos asociados
- Diseño **responsivo** (móvil cards / tablet scroll / desktop tabla completa)

### Endpoints API
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/productos` | Listar con filtros `?buscar=&estado=` |
| POST | `/api/productos` | Crear producto |
| GET | `/api/productos/{id}` | Ver producto |
| PUT | `/api/productos/{id}` | Editar producto |
| PATCH | `/api/productos/{id}/estado` | Toggle activo/inactivo |
| POST | `/api/productos/{id}/etiquetas` | Generar etiquetas |
| GET | `/api/productos/siguiente-codigo/{grupoId}` | Próximo código |
| GET | `/api/grupos-familias` | Listar grupos |
| POST | `/api/grupos-familias` | Crear grupo |
| PUT | `/api/grupos-familias/{id}` | Editar grupo |
| DELETE | `/api/grupos-familias/{id}` | Eliminar grupo |

### Cómo ejecutar

**Backend:**
```bash
cd backend
cp .env.example .env
# Configurar DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD en .env
php artisan migrate --seed
php artisan serve
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`

## Base de datos
6 tablas en Neon PostgreSQL:

| Tabla | Descripción |
|-------|-------------|
| `grupos_familias` | Categorías/tipos de productos |
| `productos` | Catálogo de productos con inventario |
| `tipo_clientes` | Tipos de cliente (Distribuidor, Consumidor Final…) |
| `clientes` | Registro de clientes |
| `facturas` | Cabecera de facturas |
| `detalle_facturas` | Líneas de detalle por factura |

## Estructura del proyecto
```
proyecto/
├── backend/          Laravel 12 API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── GrupoFamiliaController.php
│   │   │   └── ProductoController.php
│   │   └── Models/
│   │       ├── GrupoFamilia.php
│   │       └── Producto.php
│   └── routes/api.php
└── frontend/         React + Vite + Tailwind CSS
    └── src/
        ├── components/
        │   ├── layout/   Sidebar + Layout
        │   ├── productos/ ProductoList + ProductoForm + EtiquetaModal
        │   └── grupos/   GrupoList + GrupoForm
        └── services/api.js
```
