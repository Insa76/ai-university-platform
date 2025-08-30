import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../../services/api';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Verificar token decodificándolo
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(decodeURIComponent(escape(atob(base64))));
          
          // Verificar expiración
          if (payload.exp && payload.exp * 1000 > Date.now()) {
            // Obtener perfil del usuario
            try {
              const response = await authAPI.getProfile();
              setUser(response.data.data);
            } catch (error) {
              console.error('Error al obtener perfil:', error);
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
            }
          } else {
            // Token expirado, intentar renovar
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              try {
                const response = await authAPI.refreshToken(refreshToken);
                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                
                // Obtener perfil
                const profileResponse = await authAPI.getProfile();
                setUser(profileResponse.data.data);
              } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
              }
            } else {
              localStorage.removeItem('accessToken');
            }
          }
        } catch (error) {
          console.error('Token inválido:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (tokens) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      // Decodificar token para obtener datos del usuario
      try {
        const base64Url = tokens.accessToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(decodeURIComponent(escape(atob(base64))));
        setUser({
          id: payload.userId,
          email: payload.email,
          role: payload.role,
          name: payload.name || 'Usuario'
        });
      } catch (error) {
        console.error('Error al decodificar token:', error);
      }
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const enhancedPageProps = {
    ...pageProps,
    user: isClient && !loading ? user : null,
    login: isClient ? login : () => {},
    logout: isClient ? logout : () => {}
  };

  if (!isClient || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <Component {...enhancedPageProps} />;
}

export default MyApp;