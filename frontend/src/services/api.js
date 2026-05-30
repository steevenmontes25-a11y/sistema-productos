const BASE = 'http://localhost:8000/api'

// Helper: lanza error con los datos del servidor para manejo uniforme
async function req(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(data?.message ?? `HTTP ${res.status}`)
    err.status = res.status
    err.errors = data?.errors ?? {}
    throw err
  }
  return data
}

// ── Productos (Antony) ────────────────────────────────────
export const getProductos = (params = {}) =>
  req(`${BASE}/productos?${new URLSearchParams(params)}`)

export const getProducto = (id) =>
  req(`${BASE}/productos/${id}`)

export const createProducto = (data) =>
  req(`${BASE}/productos`, { method: 'POST', body: JSON.stringify(data) })

export const updateProducto = (id, data) =>
  req(`${BASE}/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) })

export const toggleProducto = (id) =>
  req(`${BASE}/productos/${id}/estado`, { method: 'PATCH' })

export const generarEtiquetas = (id, data) =>
  req(`${BASE}/productos/${id}/etiquetas`, { method: 'POST', body: JSON.stringify(data) })

export const getSiguienteCodigo = (grupoId) =>
  req(`${BASE}/productos/siguiente-codigo/${grupoId}`)

// ── Grupos / Familias (Antony) ────────────────────────────
export const getGrupos = (params = {}) =>
  req(`${BASE}/grupos-familias?${new URLSearchParams(params)}`)

export const createGrupo = (data) =>
  req(`${BASE}/grupos-familias`, { method: 'POST', body: JSON.stringify(data) })

export const updateGrupo = (id, data) =>
  req(`${BASE}/grupos-familias/${id}`, { method: 'PUT', body: JSON.stringify(data) })

export const deleteGrupo = (id) =>
  req(`${BASE}/grupos-familias/${id}`, { method: 'DELETE' })

// ── Clientes (Darío) — pendiente de merge ─────────────────
