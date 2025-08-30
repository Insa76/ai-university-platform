import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../../services/api';

export default function Login({ login }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      login(response.data.data);
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      const errorType = err.response?.data?.error || 'UnknownError';
      
      switch (errorType) {
        case 'Unauthorized':
          setErrors({ general: 'Credenciales inválidas' });
          break;
        case 'TooManyRequests':
          setErrors({ general: 'Demasiados intentos. Por favor, espera 15 minutos.' });
          break;
        default:
          setErrors({ general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 mb-4 shadow-lg">
            <span className="text-2xl text-white">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido de vuelta</h1>
          <p className="text-gray-600">Inicia sesión en tu cuenta para continuar</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-100/50">
          {errors.general && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                  errors.email 
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                }`}
                placeholder="tu@email.com"
                autoComplete="email"
              />
              {errors.email && (
                <div className="mt-1 text-red-600 text-sm">{errors.email}</div>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                  errors.password 
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                }`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && (
                <div className="mt-1 text-red-600 text-sm">{errors.password}</div>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-offset-2"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="remember-me" className="font-medium text-gray-700">
                    Recordarme
                  </label>
                </div>
              </div>
              
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}