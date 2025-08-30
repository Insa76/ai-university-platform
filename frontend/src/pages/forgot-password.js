import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AuthCard from '../components/auth/AuthCard';
import AuthInput from '../components/auth/AuthInput';
import Button from '../components/ui/Button';
import { FiMail, FiSend } from 'react-icons/fi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Simulación de envío de correo
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div>
      <Head>
        <title>Recuperar Contraseña - AI University</title>
        <meta name="description" content="Recupera tu contraseña de AI University" />
      </Head>

      <AuthCard
        title="¿Olvidaste tu contraseña?"
        subtitle="Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña"
        footerText="¿Recordaste tu contraseña?"
        footerLink="/login"
        footerLinkText="Inicia sesión aquí"
      >
        {success ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <FiSend className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instrucciones enviadas</h3>
            <p className="text-gray-600 mb-6">
              Hemos enviado instrucciones para restablecer tu contraseña a <span className="font-semibold">{email}</span>
            </p>
            <Button
              onClick={() => router.push('/login')}
              className="w-full"
              variant="outline"
            >
              Volver al inicio de sesión
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <AuthInput
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<FiMail />}
              placeholder="tu@email.com"
              autoComplete="email"
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
              icon={<FiSend />}
            >
              Enviar Instrucciones
            </Button>
          </form>
        )}
      </AuthCard>
    </div>
  );
}