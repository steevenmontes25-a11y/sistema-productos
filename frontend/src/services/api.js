const BASE = 'http://localhost:8000/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(data?.message || `Error ${res.status}`)
    err.status = res.status
    err.errors = data?.errors || {}
    throw err
  }
  return data
}

// ── Productos ──────────────────────────────────────────────
export const productosApi = {
  listar: (buscar = '', estado = 'todos') => {
    const params = new URLSearchParams()
    if (buscar) params.set('buscar', buscar)
    if (estado !== 'todos') params.set('estado', estado)
    const qs = params.toString()
    return request(`/productos${qs ? '?' + qs : ''}`)
  },
  crear: (data) => request('/productos', { method: 'POST', body: JSON.stringify(data) }),
  actualizar: (id, data) => request(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleEstado: (id) => request(`/productos/${id}/estado`, { method: 'PATCH' }),
  generarEtiquetas: (id, data) => request(`/productos/${id}/etiquetas`, { method: 'POST', body: JSON.stringify(data) }),
  siguienteCodigo: (grupoId) => request(`/productos/siguiente-codigo/${grupoId}`),
}

// ── Grupos / Familias ──────────────────────────────────────
export const gruposApi = {
  listar: (buscar = '') => {
    const qs = buscar ? `?buscar=${encodeURIComponent(buscar)}` : ''
    return request(`/grupos${qs}`)
  },
  crear: (data) => request('/grupos', { method: 'POST', body: JSON.stringify(data) }),
  actualizar: (id, data) => request(`/grupos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  eliminar: (id) => request(`/grupos/${id}`, { method: 'DELETE' }),
}
