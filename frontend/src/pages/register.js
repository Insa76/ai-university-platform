import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthCard from '../components/auth/AuthCard';
import AuthInput from '../components/auth/AuthInput';

export default function Register({ login }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!acceptedTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
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
      // Simulación - reemplazar con llamada real a API
      setTimeout(() => {
        // Crear un payload válido para el token
        const payload = {
          userId: 'test123',
          name: formData.name,
          email: formData.email,
          exp: Math.floor(Date.now() / 1000) + 3600 // 1 hora de expiración
        };
        
        // Codificar el payload en base64 (simulando JWT)
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const encodedPayload = btoa(JSON.stringify(payload));
        // Crear un token simulado (header.payload.signature)
        const fakeToken = `${header}.${encodedPayload}.fake-signature`;
        
        login(fakeToken);
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setErrors({ general: 'Error al registrarse' });
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
    <AuthCard
      title="Crear una cuenta"
      subtitle="Únete a la primera universidad basada en IA"
      footerText="¿Ya tienes cuenta?"
      footerLink="/login"
      footerLinkText="Inicia sesión aquí"
    >
      {errors.general && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <AuthInput
          label="Nombre Completo"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Tu nombre completo"
        />

        <AuthInput
          label="Correo Electrónico"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="tu@email.com"
        />

        <AuthInput
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
        />

        <AuthInput
          label="Confirmar Contraseña"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="••••••••"
        />

        <div className="mb-5">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  if (errors.terms) {
                    setErrors(prev => ({ ...prev, terms: '' }));
                  }
                }}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-offset-2"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                Acepto los <a href="#" className="text-blue-600 hover:text-blue-500">Términos de Servicio</a> y la <a href="#" className="text-blue-600 hover:text-blue-500">Política de Privacidad</a>
              </label>
            </div>
          </div>
          {errors.terms && (
            <div className="mt-1 text-red-600 text-sm">{errors.terms}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary py-3"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registrando...
            </span>
          ) : (
            'Crear Cuenta'
          )}
        </button>
      </form>
    </AuthCard>
  );
}