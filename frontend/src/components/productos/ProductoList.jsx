import { useState, useEffect } from 'react'
import {
  Search, Plus, Pencil, Tag, Power,
  Loader2, AlertCircle, ChevronDown, ChevronUp,
} from 'lucide-react'
import { productosApi } from '../../services/api'
import ProductoForm from './ProductoForm'
import EtiquetaModal from './EtiquetaModal'

// Columnas tablet (md): ocultar las no prioritarias en < lg
// Columnas desktop (lg): todas visibles
const COLS = [
  { label: 'No',              cls: 'w-10 text-center',                     hide: false },
  { label: 'CÓDIGO',          cls: 'min-w-28',                             hide: false },
  { label: 'PRODUCTO',        cls: 'min-w-44',                             hide: false },
  { label: 'PVD',             cls: 'text-right min-w-20',                  hide: true  }, // oculto en tablet
  { label: 'PVP',             cls: 'text-right min-w-20',                  hide: false },
  { label: 'PVP+IVA',        cls: 'text-right min-w-24',                  hide: false },
  { label: 'COSTO',           cls: 'text-right min-w-20',                  hide: true  },
  { label: 'MARCA',           cls: 'min-w-24',                             hide: true  },
  { label: 'DESCRIPCIÓN',     cls: 'min-w-48',                             hide: true  },
  { label: 'REF. IMPORTACIÓN',cls: 'min-w-36',                             hide: true  },
  { label: 'INV.BODEGA',     cls: 'text-right min-w-24',                  hide: true  },
  { label: 'INV.MUESTRA',    cls: 'text-right min-w-24',                  hide: true  },
  { label: 'INV.TOTAL',      cls: 'text-right min-w-20',                  hide: false },
  { label: 'ESTADO',          cls: 'text-center min-w-20',                 hide: false },
  { label: 'ACCIONES',        cls: 'text-center min-w-28 sticky right-0 bg-inherit', hide: false },
]

function fmt(n) { return Number(n || 0).toFixed(2) }

// ─── Skeleton tabla ─────────────────────────────────────────
function SkeletonTableRow({ idx }) {
  return (
    <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
      {COLS.map((c, i) => (
        <td key={i} className={`px-3 py-3 ${c.hide ? 'hidden lg:table-cell' : ''}`}>
          <div
            className="h-4 bg-slate-200 rounded animate-pulse"
            style={{ width: i === 0 ? 24 : i === 8 ? '90%' : '70%' }}
          />
        </td>
      ))}
    </tr>
  )
}

// ─── Skeleton card móvil ─────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="h-5 w-24 bg-slate-200 rounded-md" />
          <div className="h-5 w-14 bg-slate-200 rounded-full" />
        </div>
        <div className="flex gap-1">
          {[0,1,2].map(i => <div key={i} className="w-10 h-10 bg-slate-200 rounded-lg" />)}
        </div>
      </div>
      <div className="h-4 w-3/4 bg-slate-200 rounded" />
      <div className="h-3 w-1/2 bg-slate-200 rounded" />
    </div>
  )
}

// ─── Tooltip ────────────────────────────────────────────────
function Tooltip({ text, children }) {
  return (
    <div className="relative group/tip">
      {children}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1
        bg-slate-800 text-white text-xs rounded whitespace-nowrap
        opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-50">
        {text}
      </span>
    </div>
  )
}

// ─── Card móvil por producto ─────────────────────────────────
function ProductCard({ p, onEdit, onToggle, onEtiqueta }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
      {/* Cabecera: código + estado + acciones */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-semibold shrink-0">
            {p.codigo}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
            p.activo
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
              : 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${p.activo ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            {p.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        {/* Botones acción — mínimo 44×44px táctil */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggle(p)}
            className={`w-11 h-11 flex items-center justify-center rounded-lg transition-colors ${
              p.activo ? 'text-rose-500 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
            }`}
            aria-label={p.activo ? 'Inactivar' : 'Activar'}
          >
            <Power size={17} />
          </button>
          <button
            onClick={() => onEdit(p)}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Editar"
          >
            <Pencil size={17} />
          </button>
          <button
            onClick={() => onEtiqueta(p)}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Etiquetas"
          >
            <Tag size={17} />
          </button>
        </div>
      </div>

      {/* Nombre */}
      <p className="font-semibold text-slate-800 text-sm leading-snug">{p.nombre}</p>

      {/* Info rápida */}
      <p className="text-xs text-slate-500">
        {p.marca && <span className="font-medium text-slate-600">{p.marca}</span>}
        {p.marca && ' · '}
        PVP: <span className="font-semibold text-slate-700">${fmt(p.pvp)}</span>
        {' · '}
        Stock: <span className="font-semibold text-slate-700">{p.inv_total}</span>
      </p>

      {/* Ver más / menos */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
      >
        {expanded ? <><ChevronUp size={12} />Ver menos</> : <><ChevronDown size={12} />Ver más</>}
      </button>

      {expanded && (
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <div><span className="text-slate-400">PVD:</span> <span className="text-slate-700 font-medium">${fmt(p.pvd)}</span></div>
          <div><span className="text-slate-400">PVP+IVA:</span> <span className="text-slate-700 font-medium">${fmt(p.pvp_iva)}</span></div>
          <div><span className="text-slate-400">Costo:</span> <span className="text-slate-700 font-medium">${fmt(p.costo)}</span></div>
          <div><span className="text-slate-400">Inv.Bodega:</span> <span className="text-slate-700 font-medium">{p.inv_bodega}</span></div>
          <div><span className="text-slate-400">Inv.Muestra:</span> <span className="text-slate-700 font-medium">{p.inv_muestra}</span></div>
          {p.ref_importacion && (
            <div className="col-span-2">
              <span className="text-slate-400">Ref.Imp:</span>{' '}
              <span className="text-slate-700 font-medium">{p.ref_importacion}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Componente principal ────────────────────────────────────
export default function ProductoList() {
  const [productos, setProductos]       = useState([])
  const [buscar, setBuscar]             = useState('')
  const [estado, setEstado]             = useState('activo')
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)
  const [showForm, setShowForm]         = useState(false)
  const [editProduct, setEditProduct]   = useState(null)
  const [etiquetaProd, setEtiquetaProd] = useState(null)
  const [hasSearched, setHasSearched]   = useState(false)

  useEffect(() => { buscarProductos() }, []) // eslint-disable-line

  async function buscarProductos() {
    setLoading(true)
    setError(null)
    try {
      const data = await productosApi.listar(buscar, estado)
      setProductos(data)
      setHasSearched(true)
    } catch (e) {
      setError(e.message || 'Error al obtener productos.')
    } finally {
      setLoading(false)
    }
  }

  function handleEditar(p) { setEditProduct(p); setShowForm(true) }
  async function handleToggle(p) {
    try { await productosApi.toggleEstado(p.id); buscarProductos() }
    catch (e) { alert(e.message) }
  }
  function handleSaved() { setShowForm(false); setEditProduct(null); buscarProductos() }

  return (
    <div className="space-y-4">

      {/* ── Encabezado ───────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-800">Producto Terminado</h1>
          {!loading && hasSearched && (
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              {productos.length} registro{productos.length !== 1 ? 's' : ''} encontrado{productos.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {/* Botón nuevo — visible en desktop junto al buscador, en móvil por separado */}
        <button
          onClick={() => { setEditProduct(null); setShowForm(true) }}
          className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
            px-3 py-2 md:px-4 rounded-lg text-sm font-medium transition-colors shadow-sm shrink-0"
        >
          <Plus size={16} />
          <span className="hidden lg:inline">Nuevo Producto</span>
          <span className="lg:hidden">Nuevo</span>
        </button>
      </div>

      {/* ── Barra de búsqueda ────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 md:p-4">
        {/* Móvil: apilado */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">

          {/* Input — full width en móvil, flex-1 en tablet+ */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Código / Descripción / Marca"
              value={buscar}
              onChange={e => setBuscar(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscarProductos()}
              className="w-full pl-9 pr-3 py-2.5 md:py-2 text-sm border border-slate-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Segunda fila en móvil / inline en tablet+ */}
          <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:gap-2">
            <select
              value={estado}
              onChange={e => setEstado(e.target.value)}
              className="text-sm border border-slate-300 rounded-lg px-3 py-2.5 md:py-2
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="todos">Todos</option>
            </select>

            <button
              onClick={buscarProductos}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
                disabled:bg-blue-400 text-white px-4 py-2.5 md:py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {loading
                ? <><Loader2 size={14} className="animate-spin" /><span>Buscando...</span></>
                : <><Search size={14} /><span>Buscar</span></>}
            </button>

            {/* Botón Nuevo — solo en móvil (el de desktop está en el header) */}
            <button
              onClick={() => { setEditProduct(null); setShowForm(true) }}
              className="md:hidden flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800
                text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={14} />
              Nuevo
            </button>
          </div>
        </div>
      </div>

      {/* ── Error ────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {/* ── Vista MÓVIL: cards ───────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : productos.length === 0 && hasSearched
            ? (
              <div className="bg-white rounded-xl border border-slate-200 py-14 flex flex-col items-center gap-2 text-slate-400">
                <Search size={32} className="text-slate-300" />
                <p className="text-sm">No se encontraron productos.</p>
              </div>
            )
            : productos.map(p => (
              <ProductCard
                key={p.id}
                p={p}
                onEdit={handleEditar}
                onToggle={handleToggle}
                onEtiqueta={setEtiquetaProd}
              />
            ))
        }
      </div>

      {/* ── Vista TABLET/DESKTOP: tabla ──────────────────────── */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-700">
                {COLS.map(c => (
                  <th
                    key={c.label}
                    className={[
                      'px-3 py-3 text-left text-white font-semibold uppercase tracking-wide whitespace-nowrap',
                      c.cls,
                      c.hide ? 'hidden lg:table-cell' : '',
                    ].join(' ')}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonTableRow key={i} idx={i} />)
              ) : productos.length === 0 ? (
                <tr>
                  <td colSpan={COLS.length} className="text-center py-16 text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={28} className="text-slate-300" />
                      <span className="text-sm">No se encontraron productos.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                productos.map((p, idx) => (
                  <tr
                    key={p.id}
                    className={`border-t border-slate-100 hover:bg-blue-50 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                    }`}
                  >
                    <td className="px-3 py-2.5 text-slate-400 text-center">{idx + 1}</td>
                    <td className="px-3 py-2.5 font-mono font-semibold text-slate-700 whitespace-nowrap">{p.codigo}</td>
                    <td className="px-3 py-2.5 text-slate-800 font-medium max-w-44 truncate" title={p.nombre}>{p.nombre}</td>
                    {/* PVD — oculto en tablet */}
                    <td className="px-3 py-2.5 text-right text-slate-700 whitespace-nowrap hidden lg:table-cell">${fmt(p.pvd)}</td>
                    <td className="px-3 py-2.5 text-right text-slate-700 whitespace-nowrap">${fmt(p.pvp)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-slate-800 whitespace-nowrap">${fmt(p.pvp_iva)}</td>
                    {/* Costo — oculto en tablet */}
                    <td className="px-3 py-2.5 text-right text-slate-600 whitespace-nowrap hidden lg:table-cell">${fmt(p.costo)}</td>
                    {/* Marca — oculto en tablet */}
                    <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap hidden lg:table-cell">{p.marca || '—'}</td>
                    {/* Descripción — oculto en tablet */}
                    <td className="px-3 py-2.5 text-slate-600 max-w-48 truncate hidden lg:table-cell" title={p.descripcion}>{p.descripcion || '—'}</td>
                    {/* Ref. importación — oculto en tablet */}
                    <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap hidden lg:table-cell">{p.ref_importacion || '—'}</td>
                    {/* Inv.Bodega — oculto en tablet */}
                    <td className="px-3 py-2.5 text-right text-slate-700 hidden lg:table-cell">{p.inv_bodega}</td>
                    {/* Inv.Muestra — oculto en tablet */}
                    <td className="px-3 py-2.5 text-right text-slate-700 hidden lg:table-cell">{p.inv_muestra}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-slate-800">{p.inv_total}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.activo
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                          : 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.activo ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 sticky right-0 bg-inherit">
                      <div className="flex items-center justify-center gap-1">
                        <Tooltip text={p.activo ? 'Inactivar' : 'Activar'}>
                          <button
                            onClick={() => handleToggle(p)}
                            className={`p-1.5 rounded-md transition-colors ${
                              p.activo ? 'text-rose-500 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            <Power size={14} />
                          </button>
                        </Tooltip>
                        <Tooltip text="Editar">
                          <button
                            onClick={() => handleEditar(p)}
                            className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                        </Tooltip>
                        <Tooltip text="Generar etiquetas">
                          <button
                            onClick={() => setEtiquetaProd(p)}
                            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
                          >
                            <Tag size={14} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modales ───────────────────────────────────────────── */}
      {showForm && (
        <ProductoForm
          producto={editProduct}
          onSaved={handleSaved}
          onClose={() => { setShowForm(false); setEditProduct(null) }}
        />
      )}
      {etiquetaProd && (
        <EtiquetaModal
          producto={etiquetaProd}
          onClose={() => setEtiquetaProd(null)}
        />
      )}
    </div>
  )
}
