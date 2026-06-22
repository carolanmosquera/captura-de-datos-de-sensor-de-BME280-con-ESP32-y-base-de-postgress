import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';
import styles from './Auth.module.css'; 

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      })

      navigate('/home')
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Ya existe un usuario con ese correo')
      } else {
        setError('No se pudo registrar el usuario. Revisa que el backend esté encendido.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className={styles.authHeader}>
        <h1 className={styles.brand}>AGRISENSE</h1>
        <h2 className={styles.title}>Crear cuenta</h2>
        <p className={styles.subtitle}>Registra un usuario para administrar el sistema.</p>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.inputGroup}>
          <label>Nombre</label>
          <input name="name" type="text" value={form.name} onChange={handleChange} required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label>Correo</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label>Teléfono</label>
          <input name="phone" type="text" value={form.phone} onChange={handleChange} className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label>Contraseña</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label>Confirmar contraseña</label>
          <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required className={styles.input} />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarme'}
        </button>
      </form>

      <p className={styles.footerText}>
        ¿Ya tienes cuenta? <Link to="/login" className={styles.link}>Inicia sesión</Link>
      </p>
    </AuthLayout>
  );
}

export default Register;