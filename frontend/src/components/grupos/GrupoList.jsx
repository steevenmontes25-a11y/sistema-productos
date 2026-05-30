import { useState, useEffect } from 'react'
import { Search, Plus, Pencil, Trash2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getGrupos, deleteGrupo } from '../../services/api'
import GrupoForm from './GrupoForm'

function Chip({ active, label }) {
  return (
    <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${
      active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400 line-through'
    }`}>{label}</span>
  )
}

function SkeletonRow({ idx }) {
  return (
    <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
      {[20,130,60,110,150,120].map((w,i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-200 rounded animate-pulse" style={{width: w}}/>
        </td>
      ))}
    </tr>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="flex gap-2"><div className="h-5 w-32 bg-slate-200 rounded"/><div className="h-5 w-12 bg-slate-200 rounded-md"/></div>
        <div className="flex gap-1"><div className="w-10 h-10 bg-slate-200 rounded-lg"/><div className="w-10 h-10 bg-slate-200 rounded-lg"/></div>
      </div>
      <div className="h-3 w-1/3 bg-slate-200 rounded"/>
      <div className="flex gap-1"><div className="h-5 w-16 bg-slate-200 rounded"/><div className="h-5 w-16 bg-slate-200 rounded"/></div>
    </div>
  )
}

function GrupoCard({ g, onEdit, onDelete, deleting }) {
  const RELACION = { tipo: 'Tipo', familia_proveedor: 'Familia / Proveedor' }
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="font-bold text-slate-800 text-sm">{g.nombre}</span>
          <span className="font-mono text-xs bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-semibold shrink-0">
            {g.siglas}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onEdit(g)} aria-label="Editar"
            className="w-11 h-11 flex items-center justify-center rounded-lg text-amber-500 hover:bg-amber-50 transition-colors">
            <Pencil size={17}/>
          </button>
          <button onClick={() => onDelete(g)} aria-label="Eliminar"
            disabled={deleting === g.id || g.productos_count > 0}
            title={g.productos_count > 0 ? `Tiene ${g.productos_count} producto(s)` : 'Eliminar'}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50
              transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            {deleting === g.id ? <Loader2 size={17} className="animate-spin"/> : <Trash2 size={17}/>}
          </button>
        </div>
      </div>
      <p className="text-xs">
        <span className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
          {RELACION[g.relacion] ?? g.relacion}
        </span>
        {g.productos_count > 0 && (
          <span className="ml-2 text-slate-400">{g.productos_count} producto{g.productos_count!==1?'s':''}</span>
        )}
      </p>
      <div className="flex gap-1 flex-wrap">
        <Chip active={g.para_venta}   label="Venta"/>
        <Chip active={g.para_consumo} label="Consumo"/>
        <Chip active={g.para_otros}   label="Otros"/>
      </div>
      {g.observacion && <p className="text-xs text-slate-500 truncate" title={g.observacion}>{g.observacion}</p>}
    </div>
  )
}

export default function GrupoList() {
  const [grupos, setGrupos]       = useState([])
  const [buscar, setBuscar]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [deleteMsg, setDeleteMsg] = useState(null)
  const [showForm, setShowForm]   = useState(false)
  const [editItem, setEditItem]   = useState(null)
  const [deleting, setDeleting]   = useState(null)

  const RELACION = { tipo: 'Tipo', familia_proveedor: 'Familia / Proveedor' }

  useEffect(() => { cargar() }, []) // eslint-disable-line

  async function cargar(q = buscar) {
    setLoading(true); setError(null); setDeleteMsg(null)
    try { setGrupos(await getGrupos(q ? { buscar: q } : {})) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function handleDelete(g) {
    if (!window.confirm(`¿Está seguro?\n\nEliminará el grupo "${g.nombre}".\nEsta acción no se puede deshacer.`)) return
    setDeleting(g.id)
    try {
      await deleteGrupo(g.id)
      cargar()
    } catch (e) {
      setDeleteMsg(e.message || 'Error al eliminar.')
    } finally {
      setDeleting(null)
    }
  }

  function handleSaved() { setShowForm(false); setEditItem(null); cargar() }

  return (
    <div className="space-y-4">

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-800">Grupo / Familia</h1>
          {!loading && <p className="text-xs md:text-sm text-slate-500 mt-0.5">{grupos.length} grupo{grupos.length!==1?'s':''}</p>}
        </div>
        <button onClick={() => { setEditItem(null); setShowForm(true) }}
          className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
            px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shrink-0">
          <Plus size={16}/>Nuevo Grupo
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 md:p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input type="text" placeholder="Nombre o siglas..." value={buscar}
              onChange={e => setBuscar(e.target.value)} onKeyDown={e => e.key==='Enter'&&cargar()}
              className="w-full pl-9 pr-3 py-2.5 md:py-2 text-sm border border-slate-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
            <button onClick={() => cargar()} disabled={loading}
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

      {/* Alertas */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle size={16} className="shrink-0"/>{error}
        </div>
      )}
      {deleteMsg && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle size={16} className="shrink-0"/>{deleteMsg}
        </div>
      )}

      {/* Móvil: cards */}
      <div className="md:hidden space-y-3">
        {loading
          ? Array.from({length:4}).map((_,i)=><SkeletonCard key={i}/>)
          : grupos.length===0
            ? <div className="bg-white rounded-xl border border-slate-200 py-14 flex flex-col items-center gap-2 text-slate-400">
                <Search size={28} className="text-slate-300"/>
                <p className="text-sm">No se encontraron grupos.</p>
              </div>
            : grupos.map(g =>
                <GrupoCard key={g.id} g={g}
                  onEdit={x=>{setEditItem(x);setShowForm(true)}}
                  onDelete={handleDelete} deleting={deleting}/>
              )
        }
      </div>

      {/* Tablet/Desktop: tabla */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-700">
                {['No','Nombre','Siglas','Relación','Tipo de Uso','Observación','Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-white font-semibold uppercase text-xs tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({length:5}).map((_,i)=><SkeletonRow key={i} idx={i}/>)
                : grupos.length===0
                  ? <tr><td colSpan={7} className="text-center py-14 text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={28} className="text-slate-300"/>
                        <span>No se encontraron grupos.</span>
                      </div>
                    </td></tr>
                  : grupos.map((g, idx) => (
                    <tr key={g.id} className={`border-t border-slate-100 hover:bg-slate-100 transition-colors ${idx%2===0?'bg-white':'bg-slate-50'}`}>
                      <td className="px-4 py-3 text-slate-400 text-xs text-center">{idx+1}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{g.nombre}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-600">{g.siglas}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap">
                          {RELACION[g.relacion]??g.relacion}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          <Chip active={g.para_venta}   label="Venta"/>
                          <Chip active={g.para_consumo} label="Consumo"/>
                          <Chip active={g.para_otros}   label="Otros"/>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-48 truncate text-xs" title={g.observacion}>{g.observacion||'—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={()=>{setEditItem(g);setShowForm(true)}}
                            className="p-1.5 rounded-md text-amber-500 hover:bg-amber-50 transition-colors" title="Editar">
                            <Pencil size={14}/>
                          </button>
                          <button onClick={()=>handleDelete(g)}
                            disabled={deleting===g.id||g.productos_count>0}
                            title={g.productos_count>0?`Tiene ${g.productos_count} producto(s) — no se puede eliminar`:'Eliminar'}
                            className="p-1.5 rounded-md text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                            {deleting===g.id ? <Loader2 size={14} className="animate-spin"/> : <Trash2 size={14}/>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <GrupoForm grupo={editItem} onSaved={handleSaved} onClose={()=>{setShowForm(false);setEditItem(null)}}/>
      )}
    </div>
  )
}
