import { useState } from 'react'
import { Package, Layers, ChevronDown, ChevronRight, Box, Tag, X } from 'lucide-react'

const NAV = [
  {
    id: 'productos',
    label: 'Productos',
    icon: Package,
    children: [
      { id: 'producto-terminado', label: 'Producto Terminado', icon: Box },
      { id: 'grupo-familia',      label: 'Grupo / Familia',    icon: Tag  },
    ],
  },
]

export default function Sidebar({ activeModule, onNavigate, sidebarOpen, setSidebarOpen }) {
  const [openMenus, setOpenMenus] = useState({ productos: true })

  function toggleMenu(id) {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function handleNav(id) {
    onNavigate(id)
    setSidebarOpen(false) // cierra en móvil tras navegar
  }

  return (
    <>
      {/* ── Overlay móvil ──────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside
        className={[
          // Base y transición
          'fixed top-0 left-0 h-screen flex flex-col z-30 shadow-xl bg-slate-800',
          'transition-all duration-300 ease-in-out',
          // Móvil: ancho fijo, desliza con translateX
          'w-70',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          // Tablet: siempre visible, colapsado (w-16), expande con hover
          'md:translate-x-0 md:w-16 md:hover:w-60 md:overflow-hidden',
          // Desktop: siempre expandido
          'lg:w-60',
          // Grupo para efectos hover en hijos
          'group/sb',
        ].join(' ')}
      >
        {/* ── Logo ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-slate-700 shrink-0
          px-4 py-4 lg:px-5 lg:py-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Layers size={18} className="text-white" />
            </div>
            {/* Texto logo: oculto en tablet colapsado, visible en hover/desktop/móvil */}
            <div className={[
              'overflow-hidden whitespace-nowrap transition-all duration-200',
              'max-w-40 opacity-100',                      // móvil: siempre visible
              'md:max-w-0 md:opacity-0',                        // tablet: oculto
              'md:group-hover/sb:max-w-40 md:group-hover/sb:opacity-100', // tablet hover
              'lg:max-w-40 lg:opacity-100',                // desktop: siempre visible
            ].join(' ')}>
              <p className="text-white font-bold text-sm leading-tight">SoundStock</p>
              <p className="text-slate-400 text-xs">Gestión Empresarial</p>
            </div>
          </div>
          {/* X solo en móvil */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors shrink-0"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Nav ──────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2">
          {NAV.map(item => {
            const Icon = item.icon
            const isOpen = openMenus[item.id]

            return (
              <div key={item.id}>
                {/* Menú padre */}
                <button
                  onClick={() => toggleMenu(item.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                    text-slate-300 hover:bg-slate-700 hover:text-white transition-colors group/btn"
                  title={item.label}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      size={18}
                      className="text-slate-400 group-hover/btn:text-blue-400 transition-colors shrink-0"
                    />
                    <span className={[
                      'text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-200',
                      'max-w-35 opacity-100',
                      'md:max-w-0 md:opacity-0',
                      'md:group-hover/sb:max-w-35 md:group-hover/sb:opacity-100',
                      'lg:max-w-35 lg:opacity-100',
                    ].join(' ')}>
                      {item.label}
                    </span>
                  </div>
                  {/* Chevron: solo visible cuando el texto es visible */}
                  <span className={[
                    'shrink-0 overflow-hidden transition-all duration-200',
                    'opacity-100',
                    'md:opacity-0 md:w-0',
                    'md:group-hover/sb:opacity-100 md:group-hover/sb:w-auto',
                    'lg:opacity-100 lg:w-auto',
                  ].join(' ')}>
                    {isOpen
                      ? <ChevronDown size={14} className="text-slate-500" />
                      : <ChevronRight size={14} className="text-slate-500" />}
                  </span>
                </button>

                {/* Submenús */}
                {isOpen && item.children && (
                  <div className={[
                    'mt-1 mb-2 space-y-0.5 overflow-hidden transition-all duration-200',
                    // En tablet colapsado, los hijos también se ocultan salvo el ícono
                    'ml-3 pl-3 border-l border-slate-700',
                    'opacity-100',
                    'md:opacity-0 md:h-0 md:border-l-0 md:ml-0 md:pl-0',
                    'md:group-hover/sb:opacity-100 md:group-hover/sb:h-auto md:group-hover/sb:border-l md:group-hover/sb:ml-3 md:group-hover/sb:pl-3',
                    'lg:opacity-100 lg:h-auto lg:border-l lg:ml-3 lg:pl-3',
                  ].join(' ')}>
                    {item.children.map(child => {
                      const ChildIcon = child.icon
                      const isActive = activeModule === child.id
                      return (
                        <button
                          key={child.id}
                          onClick={() => handleNav(child.id)}
                          title={child.label}
                          className={[
                            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                            isActive
                              ? 'bg-blue-600 text-white font-medium'
                              : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200',
                          ].join(' ')}
                        >
                          <ChildIcon
                            size={15}
                            className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`}
                          />
                          <span className="whitespace-nowrap">{child.label}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* ── Footer ───────────────────────────────────────────── */}
        <div className={[
          'border-t border-slate-700 shrink-0 overflow-hidden transition-all duration-200',
          'px-5 py-4 opacity-100',
          'md:px-0 md:py-3 md:opacity-0',
          'md:group-hover/sb:px-5 md:group-hover/sb:py-4 md:group-hover/sb:opacity-100',
          'lg:px-5 lg:py-4 lg:opacity-100',
        ].join(' ')}>
          <p className="text-slate-500 text-xs whitespace-nowrap">v1.0.0 &copy; 2026</p>
        </div>
      </aside>
    </>
  )
}
