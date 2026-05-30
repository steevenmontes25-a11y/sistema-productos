import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProductoList from './components/productos/ProductoList'
import GrupoList from './components/grupos/GrupoList'

// ── Módulo Productos (Antony) ─────────────────────────────
// Rutas: /productos  |  /grupos-familias
// ── Módulo Clientes (Darío) — pendiente de merge ──────────
// import ClienteList from './components/clientes/ClienteList'

const ROUTE_TO_MODULE = {
  '/productos':       'producto-terminado',
  '/grupos-familias': 'grupo-familia',
}

export default function App() {
  const { pathname } = useLocation()
  const activeModule = ROUTE_TO_MODULE[pathname] ?? 'producto-terminado'

  function handleNavigate(moduleId) {
    const path = Object.entries(ROUTE_TO_MODULE).find(([, v]) => v === moduleId)?.[0]
    if (path) window.history.pushState({}, '', path)
  }

  return (
    <Layout activeModule={activeModule} onNavigate={handleNavigate}>
      <Routes>
        <Route path="/"                element={<Navigate to="/productos" replace />} />
        <Route path="/productos"       element={<ProductoList />} />
        <Route path="/grupos-familias" element={<GrupoList />} />
        {/* Módulo Clientes (Darío) — pendiente de merge */}
        {/* <Route path="/clientes" element={<ClienteList />} /> */}
        <Route path="*"                element={<Navigate to="/productos" replace />} />
      </Routes>
    </Layout>
  )
}
