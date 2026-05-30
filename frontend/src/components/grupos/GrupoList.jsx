import { useState, useEffect } from 'react'
import { Search, Plus, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react'
import { gruposApi } from '../../services/api'
import GrupoForm from './GrupoForm'

const RELACION_LABEL = {
  tipo:              'TIPO',
  familia_proveedor: 'FAMILIA / PROV.',
}

function BadgeUso({ active, label }) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
      active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400 line-through'
    }`}>
      {label}
    </span>
  )
}

// ── Skeleton tabla ─────────────────────────────────────────
function SkeletonTableRow({ idx }) {
  return (
    <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
      {[20, 140, 110, 60, 180, 90].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-200 rounded animate-pulse" style={{ width: w }} />
        </td>
      ))}
    </tr>
  )
}

// ── Skeleton card móvil ────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="h-5 w-32 bg-slate-200 rounded" />
          <div className="h-5 w-12 bg-slate-200 rounded-md" />
        </div>
        <div className="flex gap-1">
          <div className="w-10 h-10 bg-slate-200 rounded-lg" />
          <div className="w-10 h-10 bg-slate-200 rounded-lg" />
        </div>
      </div>
      <div className="h-3 w-1/3 bg-slate-200 rounded" />
      <div className="flex gap-1">
        <div className="h-5 w-16 bg-slate-200 rounded" />
        <div className="h-5 w-16 bg-slate-200 rounded" />
      </div>
    </div>
  )
}

// ── Card móvil por grupo ────────────────────────────────────
function GrupoCard({ g, onEdit, onDelete, deleting }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <span className="font-bold text-slate-800 text-sm">{g.nombre}</span>
          <span className="font-mono text-xs bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-semibold shrink-0">
            {g.siglas}
          </span>
        </div>
        {/* Acciones — mínimo 44×44px */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(g)}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Editar"
          >
            <Pencil size={17} />
          </button>
          <button
            onClick={() => onDelete(g)}
            disabled={deleting === g.id || g.productos_count > 0}
            title={g.productos_count > 0 ? `${g.productos_count} producto(s) asociado(s)` : 'Eliminar'}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50
              transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Eliminar"
          >
            {deleting === g.id ? <Loader2 size={17} className="animate-spin" /> : <Trash2 size={17} />}
          </button>
        </div>
      </div>

      {/* Relación */}
      <p className="text-xs text-slate-500">
        <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
          {RELACION_LABEL[g.relacion] || g.relacion}
        </span>
        {g.productos_count > 0 && (
          <span className="ml-2 text-slate-400">{g.productos_count} producto{g.productos_count !== 1 ? 's' : ''}</span>
        )}
      </p>

      {/* Tipo de uso */}
      <div className="flex gap-1 flex-wrap">
        <BadgeUso active={g.tipo_consumo} label="Consumo" />
        <BadgeUso active={g.tipo_venta}   label="Venta"   />
        <BadgeUso active={g.tipo_otros}   label="Otros"   />
      </div>

      {/* Observación */}
      {g.observacion && (
        <p className="text-xs text-slate-500 truncate" title={g.observacion}>{g.observacion}</p>
      )}
    </div>
  )
}

// ── Componente principal ──────────────────────────────────
export default function GrupoList() {
  const [grupos, setGrupos]         = useState([])
  const [buscar, setBuscar]         = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [showForm, setShowForm]     = useState(false)
  const [editGrupo, setEditGrupo]   = useState(null)
  const [deleting, setDeleting]     = useState(null)

  useEffect(() => { cargarGrupos() }, []) // eslint-disable-line

  async function cargarGrupos(q = buscar) {
    setLoading(true); setError(null)
    try { setGrupos(await gruposApi.listar(q)) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  function handleEditar(g) { setEditGrupo(g); setShowForm(true) }

  async function handleEliminar(g) {
    if (!window.confirm(`¿Eliminar el grupo "${g.nombre}"?`)) return
    setDeleting(g.id)
    try { await gruposApi.eliminar(g.id); cargarGrupos() }
    catch (e) { alert(e.message || 'No se pudo eliminar.') }
    finally { setDeleting(null) }
  }

  function handleSaved() { setShowForm(false); setEditGrupo(null); cargarGrupos() }

  return (
    <div className="space-y-4">

      {/* ── Encabezado ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-800">Grupo / Familia</h1>
          {!loading && (
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              {grupos.length} grupo{grupos.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button
          onClick={() => { setEditGrupo(null); setShowForm(true) }}
          className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
            px-3 py-2 md:px-4 rounded-lg text-sm font-medium transition-colors shadow-sm shrink-0"
        >
          <Plus size={16} />
          <span className="hidden lg:inline">Nuevo Grupo</span>
          <span className="lg:hidden">Nuevo</span>
        </button>
      </div>

      {/* ── Búsqueda ───────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 md:p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide md:whitespace-nowrap">
            Buscar por:
          </span>
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" placeholder="Nombre o siglas..."
              value={buscar}
              onChange={e => setBuscar(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && cargarGrupos()}
              className="w-full pl-9 pr-3 py-2.5 md:py-2 text-sm border border-slate-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
            <button
              onClick={() => cargarGrupos()} disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
                disabled:bg-blue-400 text-white px-4 py-2.5 md:py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {loading
                ? <><Loader2 size={14} className="animate-spin" />Buscando...</>
                : <><Search size={14} />Buscar</>}
            </button>
            {/* Botón Nuevo — solo móvil */}
            <button
              onClick={() => { setEditGrupo(null); setShowForm(true) }}
              className="md:hidden flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800
                text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={14} />Nuevo
            </button>
          </div>
        </div>
      </div>

      {/* ── Error ──────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle size={16} className="shrink-0" />{error}
        </div>
      )}

      {/* ── Vista MÓVIL: cards ──────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : grupos.length === 0
            ? (
              <div className="bg-white rounded-xl border border-slate-200 py-14
                flex flex-col items-center gap-2 text-slate-400">
                <Search size={28} className="text-slate-300" />
                <p className="text-sm">No se encontraron grupos.</p>
              </div>
            )
            : grupos.map(g => (
              <GrupoCard
                key={g.id} g={g}
                onEdit={handleEditar}
                onDelete={handleEliminar}
                deleting={deleting}
              />
            ))
        }
      </div>

      {/* ── Vista TABLET/DESKTOP: tabla ─────────────────────── */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-700">
                {['No', 'Nombre', 'Relación', 'Siglas', 'Tipo de Uso', 'Observaciones', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-white font-semibold uppercase text-xs tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} idx={i} />)
              ) : grupos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-14 text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={28} className="text-slate-300" />
                      <span>No se encontraron grupos.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                grupos.map((g, idx) => (
                  <tr
                    key={g.id}
                    className={`border-t border-slate-100 hover:bg-blue-50 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-slate-400 text-center text-xs">{idx + 1}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{g.nombre}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap">
                        {RELACION_LABEL[g.relacion] || g.relacion}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-600 text-sm">{g.siglas}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        <BadgeUso active={g.tipo_consumo} label="Consumo" />
                        <BadgeUso active={g.tipo_venta}   label="Venta"   />
                        <BadgeUso active={g.tipo_otros}   label="Otros"   />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-48 truncate text-xs" title={g.observacion}>
                      {g.observacion || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditar(g)}
                          className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleEliminar(g)}
                          disabled={deleting === g.id || g.productos_count > 0}
                          title={g.productos_count > 0 ? `${g.productos_count} producto(s) asociado(s)` : 'Eliminar'}
                          className="p-1.5 rounded-md text-rose-500 hover:bg-rose-50 transition-colors
                            disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {deleting === g.id
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <GrupoForm
          grupo={editGrupo}
          onSaved={handleSaved}
          onClose={() => { setShowForm(false); setEditGrupo(null) }}
        />
      )}
    </div>
  )
}
