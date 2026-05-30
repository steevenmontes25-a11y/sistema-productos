import { useState } from 'react'
import Layout from './components/layout/Layout'
import ProductoList from './components/productos/ProductoList'
import GrupoList from './components/grupos/GrupoList'

// ── Módulo Productos (Antony) ─────────────────────────────
// Rutas: producto-terminado | grupo-familia
// ── Módulo Clientes (Darío) — pendiente de merge ──────────

export default function App() {
  const [activeModule, setActiveModule] = useState('producto-terminado')

  function renderModule() {
    switch (activeModule) {
      case 'producto-terminado': return <ProductoList/>
      case 'grupo-familia':      return <GrupoList/>
      default:                   return <ProductoList/>
    }
  }

  return (
    <Layout activeModule={activeModule} onNavigate={setActiveModule}>
      {renderModule()}
    </Layout>
  )
}
