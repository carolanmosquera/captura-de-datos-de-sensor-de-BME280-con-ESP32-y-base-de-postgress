import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';
import styles from './Auth.module.css'; 

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate('/home');
    } catch (err) {
      if (err.response?.status === 401) setError('Correo o contraseña incorrectos');
      else if (err.response?.status === 403) setError('El usuario está inactivo');
      else setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.authHeader}>
        <h1 className={styles.brand}>AGRISENSE</h1>
        <h2 className={styles.title}>Bienvenido de nuevo</h2>
        <p className={styles.subtitle}>Ingresa tus credenciales para continuar</p>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Correo Electrónico</label>
          <input name="email" type="email" placeholder="tu@correo.com" value={form.email} onChange={handleChange} required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Contraseña</label>
          <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required className={styles.input} />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Verificando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p className={styles.footerText}>
        ¿No tienes cuenta? <Link to="/register" className={styles.link}>Regístrate aquí</Link>
      </p>
    </AuthLayout>
  );
}

export default Login;