import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:8000/api/productos'

const emptyForm = {
  codigo: '', nombre: '', grupo: '', familia: '',
  tipo: '', proveedor: '', precio_costo: '', precio_venta: '', stock: '',
}

export default function App() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchProductos() }, [])

  async function fetchProductos() {
    setLoading(true)
    try {
      const res = await fetch(API_BASE)
      const data = await res.json()
      setProductos(data)
    } catch {
      alert('Error al conectar con la API.')
    } finally {
      setLoading(false)
    }
  }

  function handleNuevo() {
    setForm(emptyForm)
    setEditId(null)
    setErrors({})
    setShowForm(true)
  }

  function handleEditar(p) {
    setForm({
      codigo: p.codigo, nombre: p.nombre, grupo: p.grupo ?? '',
      familia: p.familia ?? '', tipo: p.tipo ?? '', proveedor: p.proveedor ?? '',
      precio_costo: p.precio_costo, precio_venta: p.precio_venta, stock: p.stock,
    })
    setEditId(p.id)
    setErrors({})
    setShowForm(true)
  }

  function handleCancelar() {
    setShowForm(false)
    setEditId(null)
    setErrors({})
  }

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
      const url = editId ? `${API_BASE}/${editId}` : API_BASE
      const method = editId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 422) setErrors(data.errors ?? {})
        else alert(data.message ?? 'Error al guardar.')
        return
      }
      setShowForm(false)
      setEditId(null)
      await fetchProductos()
    } catch {
      alert('Error de conexión con la API.')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(p) {
    try {
      const res = await fetch(`${API_BASE}/${p.id}/estado`, {
        method: 'PATCH',
        headers: { 'Accept': 'application/json' },
      })
      if (!res.ok) { alert('No se pudo cambiar el estado.'); return }
      await fetchProductos()
    } catch {
      alert('Error de conexión con la API.')
    }
  }

  const inputCls = (field) =>
    `border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[field] ? 'border-red-400' : 'border-gray-300'}`

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Gestión de Productos</h1>
          <span className="text-blue-200 text-sm">Equipos de Sonido</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">

        {showForm && (
          <div className="bg-white rounded-lg shadow-md mb-6 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {editId ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {[
                  { name: 'codigo', label: 'Código *' },
                  { name: 'nombre', label: 'Nombre *' },
                  { name: 'grupo', label: 'Grupo' },
                  { name: 'familia', label: 'Familia' },
                  { name: 'tipo', label: 'Tipo' },
                  { name: 'proveedor', label: 'Proveedor' },
                  { name: 'precio_costo', label: 'Precio Costo', type: 'number' },
                  { name: 'precio_venta', label: 'Precio Venta *', type: 'number' },
                  { name: 'stock', label: 'Stock', type: 'number' },
                ].map(({ name, label, type = 'text' }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      step={type === 'number' ? '0.01' : undefined}
                      className={inputCls(name)}
                    />
                    {errors[name] && (
                      <p className="text-red-500 text-xs mt-1">{errors[name][0]}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium disabled:opacity-50"
                >
                  {saving ? 'Guardando…' : editId ? 'Actualizar' : 'Crear Producto'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelar}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-800">
              Listado de Productos
              {!loading && <span className="ml-2 text-gray-400 font-normal text-sm">({productos.length})</span>}
            </h2>
            {!showForm && (
              <button
                onClick={handleNuevo}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
              >
                + Nuevo Producto
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <svg className="animate-spin h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Cargando productos…
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">No hay productos registrados.</p>
              <p className="text-sm mt-1">Haz clic en "Nuevo Producto" para comenzar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-600 uppercase text-xs tracking-wider">
                    {['Código', 'Nombre', 'Grupo', 'Familia', 'Precio Venta', 'Stock', 'Estado', 'Acciones'].map(h => (
                      <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productos.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-gray-700">{p.codigo}</td>
                      <td className="px-4 py-3 text-gray-800 font-medium max-w-xs truncate">{p.nombre}</td>
                      <td className="px-4 py-3 text-gray-600">{p.grupo ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{p.familia ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-800">
                        S/ {parseFloat(p.precio_venta).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{p.stock}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                          {p.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleEditar(p)}
                          className="text-blue-600 hover:text-blue-800 mr-3 text-sm font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleToggle(p)}
                          className={`text-sm font-medium ${p.activo ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'}`}
                        >
                          {p.activo ? 'Inactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
