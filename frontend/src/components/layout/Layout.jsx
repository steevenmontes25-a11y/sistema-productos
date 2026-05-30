import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

const META = {
  'producto-terminado': { name: 'Producto Terminado', crumbs: ['Productos', 'Producto Terminado'] },
  'grupo-familia':      { name: 'Grupo / Familia',    crumbs: ['Productos', 'Grupo / Familia']    },
}

export default function Layout({ activeModule, onNavigate, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const meta = META[activeModule] ?? { name: '', crumbs: [] }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        activeModule={activeModule}
        onNavigate={onNavigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Área principal ─────────────────────────────────── */}
      <div className="ml-0 md:ml-16 lg:ml-60 flex flex-col min-h-screen pt-14 lg:pt-0 transition-all duration-300">

        {/* Header fijo — móvil y tablet ────────────────────── */}
        <header className="fixed top-0 left-0 right-0 md:left-16 lg:hidden
          h-14 bg-slate-800 shadow flex items-center px-4 gap-3 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center
              rounded-lg text-slate-300 hover:text-white hover:bg-slate-700"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          <span className="flex-1 text-white font-semibold text-sm truncate text-center md:text-left">
            {meta.name}
          </span>
        </header>

        {/* Breadcrumb — solo desktop ───────────────────────── */}
        <div className="hidden lg:flex items-center gap-2 bg-white border-b border-slate-200 px-6 py-3">
          {meta.crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-300 text-sm">/</span>}
              <span className={`text-sm ${i === meta.crumbs.length - 1 ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                {c}
              </span>
            </span>
          ))}
        </div>

        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
