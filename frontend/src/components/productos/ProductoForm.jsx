import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { productosApi, gruposApi } from '../../services/api'

const UNIDADES = ['unidad', 'caja', 'par', 'kit']

function Field({ label, required, error, span2, children }) {
  return (
    <div className={span2 ? 'col-span-1 md:col-span-2' : ''}>
      <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  )
}

const inputCls = (err) =>
  `w-full px-3 py-2.5 md:py-2 text-sm border rounded-lg focus:outline-none focus:ring-2
   focus:ring-blue-500 focus:border-transparent transition-colors ${
     err ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'
   }`

export default function ProductoForm({ producto, onSaved, onClose }) {
  const isEdit = !!producto

  const [grupos, setGrupos]           = useState([])
  const [form, setForm]               = useState({
    grupo_id: '', nombre: '', unidad: 'unidad',
    pvp: '', pvd: '', descuento: '0', iva: '12',
    marca: '', descripcion: '', costo: '0', ref_importacion: '',
  })
  const [codigoPreview, setCodigoPreview] = useState('')
  const [pvpIvaPreview, setPvpIvaPreview] = useState('')
  const [errors, setErrors]           = useState({})
  const [saving, setSaving]           = useState(false)
  const [loadingGrupos, setLoadingGrupos] = useState(true)

  useEffect(() => {
    gruposApi.listar().then(data => { setGrupos(data); setLoadingGrupos(false) })
  }, [])

  useEffect(() => {
    if (isEdit && producto) {
      setForm({
        grupo_id:        String(producto.grupo_id),
        nombre:          producto.nombre || '',
        unidad:          producto.unidad || 'unidad',
        pvp:             String(producto.pvp),
        pvd:             String(producto.pvd),
        descuento:       String(producto.descuento),
        iva:             String(producto.iva),
        marca:           producto.marca || '',
        descripcion:     producto.descripcion || '',
        costo:           String(producto.costo),
        ref_importacion: producto.ref_importacion || '',
      })
      setCodigoPreview(producto.codigo)
    }
  }, [isEdit, producto])

  useEffect(() => {
    if (isEdit || !form.grupo_id) return
    productosApi.siguienteCodigo(form.grupo_id)
      .then(d => setCodigoPreview(d.codigo))
      .catch(() => setCodigoPreview(''))
  }, [form.grupo_id, isEdit])

  useEffect(() => {
    const pvp = parseFloat(form.pvp) || 0
    const iva = parseFloat(form.iva) || 0
    setPvpIvaPreview((pvp * (1 + iva / 100)).toFixed(2))
  }, [form.pvp, form.iva])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      const payload = {
        ...form,
        grupo_id:  parseInt(form.grupo_id),
        pvp:       parseFloat(form.pvp),
        pvd:       parseFloat(form.pvd),
        descuento: parseFloat(form.descuento),
        iva:       parseFloat(form.iva),
        costo:     parseFloat(form.costo),
      }
      if (isEdit) await productosApi.actualizar(producto.id, payload)
      else        await productosApi.crear(payload)
      onSaved()
    } catch (e) {
      if (e.errors && Object.keys(e.errors).length) {
        const flat = {}
        for (const [k, v] of Object.entries(e.errors)) flat[k] = Array.isArray(v) ? v[0] : v
        setErrors(flat)
      } else {
        alert(e.message || 'Error al guardar.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    /* ── Overlay ───────────────────────────────────────────── */
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center md:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* ── Panel del modal ────────────────────────────────── */}
      <div className={[
        'relative bg-white flex flex-col z-10',
        // Móvil: bottom sheet (ocupa toda la pantalla como sheet)
        'w-full rounded-t-2xl max-h-[95dvh]',
        // Tablet/Desktop: modal centrado
        'md:rounded-2xl md:w-[90vw] md:max-w-2xl md:max-h-[90vh] md:shadow-2xl',
      ].join(' ')}>

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 bg-slate-800
          rounded-t-2xl shrink-0">
          {/* Pill indicador — solo móvil (bottom sheet) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-600 rounded-full md:hidden" />
          <h2 className="text-white font-bold text-base">
            {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Cuerpo con scroll ──────────────────────────── */}
        <div className="overflow-y-auto flex-1 px-4 md:px-6 py-4">
          <form id="prod-form" onSubmit={handleSubmit}>
            {/* Grid: 1 col en móvil, 2 cols en tablet+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">

              <Field label="Tipo" required error={errors.grupo_id}>
                <select
                  name="grupo_id" value={form.grupo_id}
                  onChange={handleChange} disabled={loadingGrupos}
                  className={inputCls(errors.grupo_id)}
                >
                  <option value="">— Seleccione —</option>
                  {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                </select>
              </Field>

              <Field label="Código" required>
                <input
                  readOnly
                  value={codigoPreview || (isEdit ? '' : '(auto-generado)')}
                  className="w-full px-3 py-2.5 md:py-2 text-sm border border-slate-200
                    rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed font-mono"
                />
              </Field>

              {/* Nombre — 2 columnas en tablet+ */}
              <Field label="Producto" required error={errors.nombre} span2>
                <input
                  type="text" name="nombre" value={form.nombre}
                  onChange={handleChange} placeholder="Nombre del producto"
                  className={inputCls(errors.nombre)}
                />
              </Field>

              <Field label="Unidad" required error={errors.unidad}>
                <select name="unidad" value={form.unidad} onChange={handleChange} className={inputCls(errors.unidad)}>
                  {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </Field>

              <Field label="Marca" required error={errors.marca}>
                <input
                  type="text" name="marca" value={form.marca}
                  onChange={handleChange} placeholder="Ej: CHAUVET, JBL..."
                  className={inputCls(errors.marca)}
                />
              </Field>

              <Field label="PVP (Precio Público)" required error={errors.pvp}>
                <input
                  type="number" name="pvp" value={form.pvp} min="0" step="0.01"
                  onChange={handleChange} placeholder="0.00"
                  className={inputCls(errors.pvp)}
                />
              </Field>

              <Field label="PVD (Precio Distribuidor)" required error={errors.pvd}>
                <input
                  type="number" name="pvd" value={form.pvd} min="0" step="0.01"
                  onChange={handleChange} placeholder="0.00"
                  className={inputCls(errors.pvd)}
                />
              </Field>

              <Field label="IVA (%)" required error={errors.iva}>
                <input
                  type="number" name="iva" value={form.iva} min="0" max="100" step="0.01"
                  onChange={handleChange} placeholder="12"
                  className={inputCls(errors.iva)}
                />
              </Field>

              <Field label="PVP + IVA (calculado)">
                <input
                  readOnly value={pvpIvaPreview ? `$${pvpIvaPreview}` : ''}
                  className="w-full px-3 py-2.5 md:py-2 text-sm border border-slate-200
                    rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed font-semibold"
                />
              </Field>

              <Field label="Descuento (%)" required error={errors.descuento}>
                <input
                  type="number" name="descuento" value={form.descuento} min="0" max="100" step="0.01"
                  onChange={handleChange} placeholder="0"
                  className={inputCls(errors.descuento)}
                />
              </Field>

              <Field label="Costo" required error={errors.costo}>
                <input
                  type="number" name="costo" value={form.costo} min="0" step="0.01"
                  onChange={handleChange} placeholder="0.00"
                  className={inputCls(errors.costo)}
                />
              </Field>

              {/* Ref. importación — 2 columnas en tablet+ */}
              <Field label="Ref. Importación" required error={errors.ref_importacion} span2>
                <input
                  type="text" name="ref_importacion" value={form.ref_importacion}
                  onChange={handleChange} placeholder="Código del proveedor"
                  className={inputCls(errors.ref_importacion)}
                />
              </Field>

              {/* Descripción — 2 columnas en tablet+ */}
              <Field label="Descripción" required error={errors.descripcion} span2>
                <textarea
                  name="descripcion" value={form.descripcion}
                  onChange={handleChange} rows={3}
                  placeholder="Descripción detallada del producto..."
                  className={`${inputCls(errors.descripcion)} resize-none`}
                />
              </Field>
            </div>
          </form>
        </div>

        {/* ── Footer fijo ────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-t border-slate-100
          shrink-0 bg-white rounded-b-2xl">
          <button
            type="button" onClick={onClose}
            className="flex-1 md:flex-none px-5 py-2.5 md:py-2 text-sm font-medium
              bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit" form="prod-form" disabled={saving}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 md:py-2
              text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
              text-white rounded-lg transition-colors"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
