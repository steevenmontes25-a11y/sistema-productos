import { useState } from 'react'
import { X, Tag, Loader2, CheckCircle2 } from 'lucide-react'
import { generarEtiquetas } from '../../services/api'

export default function EtiquetaModal({ producto, onClose }) {
  const [cantidad, setCantidad] = useState(1)
  const [reimpr, setReimp]      = useState(false)
  const [saving, setSaving]     = useState(false)
  const [result, setResult]     = useState(null)
  const [error, setError]       = useState(null)

  // Valores derivados — calculados directamente, sin estado propio
  const n     = parseInt(cantidad) || 0
  const desde = reimpr ? Math.max(1, producto.ultima_etiqueta - n + 1) : producto.ultima_etiqueta + 1
  const hasta = reimpr ? producto.ultima_etiqueta : producto.ultima_etiqueta + n

  async function handleGenerar() {
    const n = parseInt(cantidad)
    if (!n || n < 1) { setError('Ingrese una cantidad válida.'); return }
    setSaving(true); setError(null)
    try {
      setResult(await generarEtiquetas(producto.id, { cantidad: n, reimprimir: reimpr }))
    } catch (e) {
      setError(e.message || 'Error al generar etiquetas.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center md:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}/>

      <div className="relative bg-white flex flex-col z-10
        w-full rounded-t-2xl max-h-[85dvh]
        md:rounded-2xl md:w-full md:max-w-md md:shadow-2xl">

        {/* Header ────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-800 rounded-t-2xl shrink-0">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-600 rounded-full md:hidden"/>
          <div className="flex items-center gap-2">
            <Tag size={17} className="text-blue-400"/>
            <h2 className="text-white font-bold text-base">Generar Etiquetas</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700">
            <X size={20}/>
          </button>
        </div>

        {/* Body ───────────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {/* Info producto */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-0.5">Producto</p>
            <p className="font-mono font-bold text-blue-700 text-sm">{producto.codigo}</p>
            <p className="text-slate-700 text-sm truncate">{producto.nombre}</p>
          </div>

          {!result ? (
            <>
              {/* Última etiqueta */}
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Última etiqueta</span>
                <span className="text-2xl font-bold text-amber-800 font-mono">{producto.ultima_etiqueta}</span>
              </div>

              {/* # Etiquetas */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
                  # Etiquetas <span className="text-rose-500">*</span>
                </label>
                <input type="number" min="1" max="9999" value={cantidad}
                  onChange={e => { setCantidad(e.target.value); setError(null) }}
                  className="w-full px-3 py-3 md:py-2 text-lg font-bold font-mono text-center
                    border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>

              {/* Reimprimir */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={reimpr} onChange={e => setReimp(e.target.checked)}
                  className="w-5 h-5 md:w-4 md:h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"/>
                <span className="text-sm text-slate-700 font-medium">Re-imprimir (no avanza el secuencial)</span>
              </label>

              {/* Desde / Hasta */}
              <div className="grid grid-cols-2 gap-3">
                {[['Desde', desde], ['Hasta', hasta]].map(([lbl, val]) => (
                  <div key={lbl} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide">{lbl}</p>
                    <p className="text-2xl font-bold text-slate-800 font-mono mt-1">{val}</p>
                  </div>
                ))}
              </div>

              {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-2 py-4">
                <CheckCircle2 size={40} className="text-emerald-500"/>
                <p className="text-slate-700 font-semibold text-center">Etiquetas generadas</p>
                {result.reimprimir && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    Reimpresión — secuencial sin cambios
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[['Desde', result.desde], ['Hasta', result.hasta]].map(([lbl, val]) => (
                  <div key={lbl} className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                    <p className="text-xs text-emerald-600 uppercase font-semibold tracking-wide">{lbl}</p>
                    <p className="text-2xl font-bold text-emerald-800 font-mono mt-1">{val}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{result.cantidad}</span> etiqueta{result.cantidad!==1?'s':''} · última: <span className="font-mono font-bold">{result.ultima_etiqueta}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer ─────────────────────────────────────────── */}
        <div className="shrink-0 flex gap-3 px-5 py-4 border-t border-slate-100 bg-white rounded-b-2xl">
          {!result ? (
            <>
              <button onClick={onClose}
                className="flex-1 py-2.5 md:py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg">
                Cancelar
              </button>
              <button onClick={handleGenerar} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 md:py-2
                  text-sm font-medium bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg">
                {saving ? <><Loader2 size={14} className="animate-spin"/>Generando...</> : <><Tag size={14}/>Generar</>}
              </button>
            </>
          ) : (
            <button onClick={onClose}
              className="flex-1 py-2.5 md:py-2 text-sm font-medium bg-slate-800 hover:bg-slate-900 text-white rounded-lg">
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
