import { useState } from 'react'
import {
  Package, Layers, ChevronDown, ChevronRight,
  Box, Tag, X,
} from 'lucide-react'

const NAV = [
  {
    id: 'productos',
    label: 'Productos',
    icon: Package,
    children: [
      { id: 'producto-terminado', label: 'Producto Terminado', icon: Box },
      { id: 'grupo-familia',      label: 'Grupo / Familia',    icon: Tag },
    ],
  },
  // ── Módulo Clientes (Darío) — pendiente de merge ──────
  // { id: 'clientes', label: 'Clientes', icon: Users, children: [] },
]

export default function Sidebar({ activeModule, onNavigate, open, onClose }) {
  const [openMenus, setOpenMenus] = useState({ productos: true })

  function toggle(id) {
    setOpenMenus(p => ({ ...p, [id]: !p[id] }))
  }

  function nav(id) {
    onNavigate(id)
    onClose()
  }

  return (
    <>
      {/* Overlay — solo móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel sidebar */}
      <aside
        className={[
          'fixed top-0 left-0 h-screen flex flex-col z-30 bg-slate-800 shadow-xl',
          'transition-all duration-300 ease-in-out overflow-hidden',
          'w-70',
          open ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0 md:w-16 md:hover:w-60 group/sb',
          'lg:w-60',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Layers size={17} className="text-white" />
            </div>
            <div
              className={[
                'overflow-hidden whitespace-nowrap transition-all duration-200',
                'opacity-100 max-w-40',
                'md:opacity-0 md:max-w-0',
                'md:group-hover/sb:opacity-100 md:group-hover/sb:max-w-40',
                'lg:opacity-100 lg:max-w-40',
              ].join(' ')}
            >
              <p className="text-white font-bold text-sm leading-tight">Sistema Gestión</p>
              <p className="text-slate-400 text-xs">Equipos de Sonido</p>
            </div>
          </div>

          {/* Botón cerrar — solo móvil */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
          {NAV.map(item => {
            const Icon = item.icon
            const isOpen = openMenus[item.id]

            return (
              <div key={item.id}>
                {/* Ítem padre */}
                <button
                  onClick={() => toggle(item.id)}
                  title={item.label}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors group/btn"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      size={18}
                      className="text-slate-400 group-hover/btn:text-blue-400 shrink-0 transition-colors"
                    />
                    <span
                      className={[
                        'text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-200',
                        'opacity-100 max-w-35',
                        'md:opacity-0 md:max-w-0',
                        'md:group-hover/sb:opacity-100 md:group-hover/sb:max-w-35',
                        'lg:opacity-100 lg:max-w-35',
                      ].join(' ')}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span
                    className={[
                      'shrink-0 overflow-hidden transition-all duration-200',
                      'opacity-100 w-auto',
                      'md:opacity-0 md:w-0',
                      'md:group-hover/sb:opacity-100 md:group-hover/sb:w-auto',
                      'lg:opacity-100 lg:w-auto',
                    ].join(' ')}
                  >
                    {isOpen
                      ? <ChevronDown size={13} className="text-slate-500" />
                      : <ChevronRight size={13} className="text-slate-500" />}
                  </span>
                </button>

                {/* Submenú */}
                {isOpen && item.children?.length > 0 && (
                  <div
                    className={[
                      'mt-0.5 mb-1 space-y-0.5 transition-all duration-200',
                      'ml-3 pl-3 border-l border-slate-700',
                      'opacity-100',
                      'md:opacity-0 md:h-0 md:overflow-hidden md:border-l-0 md:ml-0 md:pl-0',
                      'md:group-hover/sb:opacity-100 md:group-hover/sb:h-auto md:group-hover/sb:border-l md:group-hover/sb:ml-3 md:group-hover/sb:pl-3',
                      'lg:opacity-100 lg:h-auto lg:border-l lg:ml-3 lg:pl-3',
                    ].join(' ')}
                  >
                    {item.children.map(child => {
                      const CIcon = child.icon
                      const active = activeModule === child.id

                      return (
                        <button
                          key={child.id}
                          onClick={() => nav(child.id)}
                          title={child.label}
                          className={[
                            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                            active
                              ? 'bg-blue-600 text-white font-medium border-l-2 border-blue-400'
                              : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200',
                          ].join(' ')}
                        >
                          <CIcon
                            size={14}
                            className={active ? 'text-white shrink-0' : 'text-slate-500 shrink-0'}
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

        {/* Footer */}
        <div
          className={[
            'border-t border-slate-700 px-5 py-3 shrink-0 overflow-hidden transition-all duration-200',
            'opacity-100',
            'md:opacity-0',
            'md:group-hover/sb:opacity-100',
            'lg:opacity-100',
          ].join(' ')}
        >
          <p className="text-slate-500 text-xs whitespace-nowrap">Módulo: Antony · v1.0</p>
        </div>
      </aside>
    </>
  )
}
