import { useState, useEffect } from 'react'
import { Search, Plus, Pencil, Power, Tag, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { getProductos, toggleProducto } from '../../services/api'
import ProductoForm from './ProductoForm'
import EtiquetaModal from './EtiquetaModal'

const fmt = (n) => Number(n ?? 0).toFixed(2)

// ── Columnas de la tabla ────────────────────────────────────
const COLS = [
  { label: 'No',           align: 'center',  tablet: true  },
  { label: 'Código',       align: 'left',    tablet: true  },
  { label: 'Producto',     align: 'left',    tablet: true  },
  { label: 'PVD',          align: 'right',   tablet: false },
  { label: 'PVP',          align: 'right',   tablet: true  },
  { label: 'PVP+IVA',     align: 'right',   tablet: true  },
  { label: 'Costo',        align: 'right',   tablet: false },
  { label: 'Marca',        align: 'left',    tablet: false },
  { label: 'Inv.Bodega',  align: 'right',   tablet: false },
  { label: 'Inv.Muestra', align: 'right',   tablet: false },
  { label: 'Inv.Total',   align: 'right',   tablet: true  },
  { label: 'Estado',       align: 'center',  tablet: true  },
  { label: 'Acciones',     align: 'center',  tablet: true  },
]

// ── Skeleton tabla ──────────────────────────────────────────
function SkeletonRow({ idx }) {
  return (
    <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
      {COLS.map((c, i) => (
        <td key={i} className={`px-3 py-3 ${!c.tablet ? 'hidden lg:table-cell' : ''}`}>
          <div className="h-4 bg-slate-200 rounded animate-pulse" style={{ width: i === 2 ? '80%' : '60%' }} />
        </td>
      ))}
    </tr>
  )
}

// ── Skeleton card móvil ─────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="flex gap-2"><div className="h-5 w-24 bg-slate-200 rounded-md" /><div className="h-5 w-14 bg-slate-200 rounded-full" /></div>
        <div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-10 h-10 bg-slate-200 rounded-lg"/>)}</div>
      </div>
      <div className="h-4 w-3/4 bg-slate-200 rounded" />
      <div className="h-3 w-1/2 bg-slate-200 rounded" />
    </div>
  )
}

// ── Tooltip ─────────────────────────────────────────────────
function Tip({ text, children }) {
  return (
    <div className="relative group/tip">
      {children}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white
        text-xs rounded whitespace-nowrap opacity-0 group-hover/tip:opacity-100 pointer-events-none z-50 transition-opacity">
        {text}
      </span>
    </div>
  )
}

// ── Card móvil ──────────────────────────────────────────────
function ProductoCard({ p, onEdit, onToggle, onEtiqueta }) {
  const [exp, setExp] = useState(false)
  const pvpIva = (p.pvp * (1 + p.iva / 100)).toFixed(2)
  const invTotal = (parseFloat(p.inv_bodega) + parseFloat(p.inv_muestra)).toFixed(2)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-semibold shrink-0">{p.codigo}</span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
            p.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${p.activo ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            {p.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onToggle(p)}
            className={`w-11 h-11 flex items-center justify-center rounded-lg transition-colors ${p.activo ? 'text-rose-500 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
            aria-label={p.activo ? 'Inactivar' : 'Activar'}>
            <Power size={17} />
          </button>
          <button onClick={() => onEdit(p)}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-amber-500 hover:bg-amber-50 transition-colors"
            aria-label="Editar">
            <Pencil size={17} />
          </button>
          <button onClick={() => onEtiqueta(p)}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Etiquetas">
            <Tag size={17} />
          </button>
        </div>
      </div>

      <p className="font-semibold text-slate-800 text-sm">{p.nombre}</p>
      <p className="text-xs text-slate-500">
        {p.marca && <><span className="font-medium text-slate-600">{p.marca}</span> · </>}
        PVP: <span className="font-semibold text-slate-700">${fmt(p.pvp)}</span>
        {' · '}PVP+IVA: <span className="font-semibold text-slate-700">${pvpIva}</span>
        {' · '}Stock: <span className="font-semibold text-slate-700">{invTotal}</span>
      </p>

      <button onClick={() => setExp(v => !v)}
        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
        {exp ? <><ChevronUp size={12}/>Ver menos</> : <><ChevronDown size={12}/>Ver más</>}
      </button>

      {exp && (
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div><span className="text-slate-400">PVD:</span> <span className="font-medium">${fmt(p.pvd)}</span></div>
          <div><span className="text-slate-400">Costo:</span> <span className="font-medium">${fmt(p.costo)}</span></div>
          <div><span className="text-slate-400">Inv.Bodega:</span> <span className="font-medium">{fmt(p.inv_bodega)}</span></div>
          <div><span className="text-slate-400">Inv.Muestra:</span> <span className="font-medium">{fmt(p.inv_muestra)}</span></div>
          {p.ref_importacion && (
            <div className="col-span-2"><span className="text-slate-400">Ref:</span> <span className="font-medium">{p.ref_importacion}</span></div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Componente principal ────────────────────────────────────
export default function ProductoList() {
  const [productos, setProductos]     = useState([])
  const [buscar, setBuscar]           = useState('')
  const [estado, setEstado]           = useState('todos')
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [showForm, setShowForm]       = useState(false)
  const [editItem, setEditItem]       = useState(null)
  const [etiquetaItem, setEtiqueta]   = useState(null)
  const [searched, setSearched]       = useState(false)

  useEffect(() => { buscar_api() }, []) // eslint-disable-line

  async function buscar_api() {
    setLoading(true); setError(null)
    try {
      const params = {}
      if (buscar) params.buscar = buscar
      if (estado !== 'todos') params.estado = estado
      setProductos(await getProductos(params))
      setSearched(true)
    } catch (e) {
      setError(e.message || 'Error al cargar productos.')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggle(p) {
    try { await toggleProducto(p.id); buscar_api() }
    catch (e) { alert(e.message) }
  }

  function handleSaved() { setShowForm(false); setEditItem(null); buscar_api() }

  return (
    <div className="space-y-4">

      {/* Encabezado ────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-800">Producto Terminado</h1>
          {!loading && searched && (
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              {productos.length} registro{productos.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button onClick={() => { setEditItem(null); setShowForm(true) }}
          className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
            px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shrink-0">
          <Plus size={16} /><span>Nuevo Producto</span>
        </button>
      </div>

      {/* Buscador ──────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 md:p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Código / Nombre / Marca..."
              value={buscar} onChange={e => setBuscar(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscar_api()}
              className="w-full pl-9 pr-3 py-2.5 md:py-2 text-sm border border-slate-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
            <select value={estado} onChange={e => setEstado(e.target.value)}
              className="text-sm border border-slate-300 rounded-lg px-3 py-2.5 md:py-2 bg-white
                focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="todos">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            <button onClick={buscar_api} disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
                disabled:bg-blue-400 text-white px-4 py-2.5 md:py-2 rounded-lg text-sm font-medium transition-colors">
              {loading ? <><Loader2 size={14} className="animate-spin"/>Buscando...</> : <><Search size={14}/>Buscar</>}
            </button>
            <button onClick={() => { setEditItem(null); setShowForm(true) }}
              className="md:hidden flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800
                text-white px-4 py-2.5 rounded-lg text-sm font-medium">
              <Plus size={14}/>Nuevo
            </button>
          </div>
        </div>
      </div>

      {/* Error ─────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle size={16} className="shrink-0"/>{error}
        </div>
      )}

      {/* Vista móvil: cards ─────────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {loading
          ? Array.from({length: 5}).map((_, i) => <SkeletonCard key={i}/>)
          : productos.length === 0
            ? <div className="bg-white rounded-xl border border-slate-200 py-14 flex flex-col items-center gap-2 text-slate-400">
                <Search size={28} className="text-slate-300"/>
                <p className="text-sm">No se encontraron productos.</p>
              </div>
            : productos.map(p =>
                <ProductoCard key={p.id} p={p}
                  onEdit={x => { setEditItem(x); setShowForm(true) }}
                  onToggle={handleToggle}
                  onEtiqueta={setEtiqueta}/>
              )
        }
      </div>

      {/* Vista tablet/desktop: tabla ──────────────────────── */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-700">
                {COLS.map(c => (
                  <th key={c.label}
                    className={`px-3 py-3 text-${c.align} text-white font-semibold uppercase tracking-wide whitespace-nowrap
                      ${!c.tablet ? 'hidden lg:table-cell' : ''}`}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({length:8}).map((_, i) => <SkeletonRow key={i} idx={i}/>)
                : productos.length === 0
                  ? <tr><td colSpan={COLS.length} className="text-center py-16 text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={28} className="text-slate-300"/>
                        <span>No se encontraron productos.</span>
                      </div>
                    </td></tr>
                  : productos.map((p, idx) => {
                      const pvpIva  = (p.pvp * (1 + p.iva / 100)).toFixed(2)
                      const invTotal = (parseFloat(p.inv_bodega) + parseFloat(p.inv_muestra)).toFixed(2)
                      return (
                        <tr key={p.id}
                          className={`border-t border-slate-100 hover:bg-slate-100 transition-colors ${idx%2===0?'bg-white':'bg-slate-50'}`}>
                          <td className="px-3 py-2.5 text-center text-slate-400">{idx+1}</td>
                          <td className="px-3 py-2.5 font-mono font-semibold text-slate-700 whitespace-nowrap">{p.codigo}</td>
                          <td className="px-3 py-2.5 text-slate-800 font-medium max-w-44 truncate" title={p.nombre}>{p.nombre}</td>
                          <td className="px-3 py-2.5 text-right hidden lg:table-cell">${fmt(p.pvd)}</td>
                          <td className="px-3 py-2.5 text-right text-slate-700">${fmt(p.pvp)}</td>
                          <td className="px-3 py-2.5 text-right font-semibold text-slate-800">${pvpIva}</td>
                          <td className="px-3 py-2.5 text-right hidden lg:table-cell">${fmt(p.costo)}</td>
                          <td className="px-3 py-2.5 hidden lg:table-cell text-slate-600 whitespace-nowrap">{p.marca||'—'}</td>
                          <td className="px-3 py-2.5 text-right hidden lg:table-cell">{fmt(p.inv_bodega)}</td>
                          <td className="px-3 py-2.5 text-right hidden lg:table-cell">{fmt(p.inv_muestra)}</td>
                          <td className="px-3 py-2.5 text-right font-semibold">{invTotal}</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              p.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${p.activo?'bg-emerald-500':'bg-rose-500'}`}/>
                              {p.activo?'Activo':'Inactivo'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center justify-center gap-1">
                              <Tip text={p.activo?'Inactivar':'Activar'}>
                                <button onClick={()=>handleToggle(p)}
                                  className={`p-1.5 rounded-md transition-colors ${p.activo?'text-rose-500 hover:bg-rose-50':'text-emerald-600 hover:bg-emerald-50'}`}>
                                  <Power size={13}/>
                                </button>
                              </Tip>
                              <Tip text="Editar">
                                <button onClick={()=>{setEditItem(p);setShowForm(true)}}
                                  className="p-1.5 rounded-md text-amber-500 hover:bg-amber-50 transition-colors">
                                  <Pencil size={13}/>
                                </button>
                              </Tip>
                              <Tip text="Etiquetas">
                                <button onClick={()=>setEtiqueta(p)}
                                  className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors">
                                  <Tag size={13}/>
                                </button>
                              </Tip>
                            </div>
                          </td>
                        </tr>
                      )
                    })
              }
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <ProductoForm producto={editItem} onSaved={handleSaved} onClose={()=>{setShowForm(false);setEditItem(null)}}/>
      )}
      {etiquetaItem && (
        <EtiquetaModal producto={etiquetaItem} onClose={()=>setEtiqueta(null)}/>
      )}
    </div>
  )
}
