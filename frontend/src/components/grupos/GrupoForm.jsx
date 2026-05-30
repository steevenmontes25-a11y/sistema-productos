import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { createGrupo, updateGrupo } from '../../services/api'

function Field({ label, req, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
        {label}{req && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  )
}

const inp = (err) =>
  `w-full px-3 py-2.5 md:py-2 text-sm border rounded-lg focus:outline-none focus:ring-2
   focus:ring-blue-500 focus:border-transparent ${err ? 'border-rose-400 bg-rose-50' : 'border-slate-300'}`

export default function GrupoForm({ grupo, onSaved, onClose }) {
  const isEdit = !!grupo

  const [form, setForm] = useState({
    nombre: '', siglas: '', relacion: 'tipo',
    para_venta: false, para_consumo: false, para_otros: false,
    observacion: '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    setForm({
      nombre:       grupo.nombre       ?? '',
      siglas:       grupo.siglas       ?? '',
      relacion:     grupo.relacion     ?? 'tipo',
      para_venta:   !!grupo.para_venta,
      para_consumo: !!grupo.para_consumo,
      para_otros:   !!grupo.para_otros,
      observacion:  grupo.observacion  ?? '',
    })
  }, [isEdit, grupo])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : (name === 'siglas' ? value.toUpperCase() : value)
    setForm(p => ({ ...p, [name]: val }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: null }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true); setErrors({})
    try {
      if (isEdit) await updateGrupo(grupo.id, form)
      else        await createGrupo(form)
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
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center md:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}/>

      <div className="relative bg-white flex flex-col z-10
        w-full rounded-t-2xl max-h-[90dvh]
        md:rounded-2xl md:w-[90vw] md:max-w-lg md:shadow-2xl">

        <div className="flex items-center justify-between px-4 md:px-6 py-4 bg-slate-800 rounded-t-2xl shrink-0">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-600 rounded-full md:hidden"/>
          <h2 className="text-white font-bold text-base">{isEdit ? 'Editar Grupo / Familia' : 'Nuevo Grupo / Familia'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700">
            <X size={20}/>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-4 md:px-6 py-4">
          <form id="grupo-form" onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <Field label="Nombre" req error={errors.nombre}>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange}
                  placeholder="Ej: ILUMINACION" className={inp(errors.nombre)}/>
              </Field>
              <Field label="Siglas (máx. 5)" req error={errors.siglas}>
                <input type="text" name="siglas" value={form.siglas} onChange={handleChange}
                  placeholder="Ej: ILM" maxLength={5}
                  className={`${inp(errors.siglas)} font-mono uppercase tracking-widest`}/>
              </Field>
            </div>

            <Field label="Relación" req error={errors.relacion}>
              <div className="flex flex-col sm:flex-row gap-3 mt-1">
                {[['tipo','Tipo'], ['familia_proveedor','Familia / Proveedor']].map(([v, l]) => (
                  <label key={v} className="flex items-center gap-2.5 cursor-pointer">
                    <input type="radio" name="relacion" value={v}
                      checked={form.relacion === v} onChange={handleChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"/>
                    <span className="text-sm text-slate-700">{l}</span>
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Tipo de uso">
              <div className="flex flex-wrap gap-4 mt-1">
                {[['para_venta','Para Venta'], ['para_consumo','Para Consumo'], ['para_otros','Otros']].map(([n, l]) => (
                  <label key={n} className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" name={n} checked={form[n]} onChange={handleChange}
                      className="w-5 h-5 md:w-4 md:h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"/>
                    <span className="text-sm text-slate-700">{l}</span>
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Observación" error={errors.observacion}>
              <textarea name="observacion" value={form.observacion} onChange={handleChange} rows={3}
                placeholder="Notas adicionales..."
                className={`${inp(errors.observacion)} resize-none`}/>
            </Field>
          </form>
        </div>

        <div className="shrink-0 flex gap-3 px-4 md:px-6 py-4 border-t border-slate-100 bg-white rounded-b-2xl">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 md:py-2 text-sm font-medium bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg">
            Cancelar
          </button>
          <button type="submit" form="grupo-form" disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 md:py-2
              text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg">
            {saving && <Loader2 size={14} className="animate-spin"/>}
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
