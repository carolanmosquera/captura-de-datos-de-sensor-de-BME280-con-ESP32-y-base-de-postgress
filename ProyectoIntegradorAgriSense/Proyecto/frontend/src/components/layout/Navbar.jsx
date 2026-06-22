import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="topbar">
      <div className="logo">AGRISENSE</div>

      <nav className="nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/sensors">Sensores</NavLink>
        <NavLink to="/reports">Reportes</NavLink>
        <NavLink to="/alerts">Alertas</NavLink>
      </nav>

      <div className="user-menu">
        <span>{user?.name || user?.email}</span>
        <button type="button" onClick={handleLogout} className="logout-button">
          Salir
        </button>
      </div>
    </header>
  )
}

export default Navbar