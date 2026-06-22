import Navbar from '../../components/layout/Navbar'

function Reports() {
  return (
    <div className="dashboard">
      <Navbar />

      <section className="title">
        <h1>REPORTES</h1>
        <p>Resumen de lecturas del sistema</p>
      </section>

      <section className="panel">
        <h2>Reportes disponibles próximamente</h2>
      </section>
    </div>
  )
}

export default Reports