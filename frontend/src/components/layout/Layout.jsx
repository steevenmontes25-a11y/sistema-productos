import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

const META = {
  'producto-terminado': { name: 'Producto Terminado', breadcrumb: ['Productos', 'Producto Terminado'] },
  'grupo-familia':      { name: 'Grupo / Familia',    breadcrumb: ['Productos', 'Grupo / Familia']    },
}

export default function Layout({ activeModule, onNavigate, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const meta = META[activeModule] || { name: '', breadcrumb: [] }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        activeModule={activeModule}
        onNavigate={onNavigate}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* ── Área principal ─────────────────────────────────────── */}
      <div className={[
        'flex flex-col min-h-screen transition-all duration-300',
        // Móvil: sin margen (sidebar oculto)
        'ml-0',
        // Tablet: deja espacio para los íconos (w-16 = 64px)
        'md:ml-16',
        // Desktop: deja espacio para el sidebar completo (w-60 = 240px)
        'lg:ml-60',
        // Móvil y tablet: padding-top para el header fijo (h-14 = 56px)
        'pt-14 lg:pt-0',
      ].join(' ')}>

        {/* ── Header fijo — solo móvil y tablet ──────────────── */}
        <header className={[
          'fixed top-0 right-0 h-14 z-10 flex items-center px-4 gap-3',
          'bg-slate-800 shadow-lg',
          // Móvil: empieza en left-0
          'left-0',
          // Tablet: empieza después del sidebar colapsado
          'md:left-16',
          // Desktop: oculto (breadcrumb en su lugar)
          'lg:hidden',
        ].join(' ')}>
          {/* Hamburguesa — solo en móvil */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>

          {/* Nombre del módulo actual */}
          <span className="flex-1 text-white font-semibold text-sm truncate text-center md:text-left">
            {meta.name}
          </span>
        </header>

        {/* ── Breadcrumb — solo desktop ───────────────────────── */}
        <div className="hidden lg:flex items-center gap-2 bg-white border-b border-slate-200 px-6 py-3">
          {meta.breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-300 text-sm">/</span>}
              <span className={`text-sm ${
                i === meta.breadcrumb.length - 1
                  ? 'text-slate-700 font-medium'
                  : 'text-slate-400'
              }`}>
                {crumb}
              </span>
            </span>
          ))}
        </div>

        {/* ── Contenido ────────────────────────────────────────── */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
