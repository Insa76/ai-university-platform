import { useState } from 'react';
import { useRouter } from 'next/router';

export default function MainLayout({ children, user, logout }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `
          
          url('/images/hero-background.jpg')
        `,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center'
      }}
    >
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => router.push('/dashboard')}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">AI University</h1>
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <nav className="hidden md:flex space-x-1">
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      router.pathname === '/dashboard' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => router.push('/courses')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      router.pathname.startsWith('/courses') 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    Cursos
                  </button>
                  <button 
                    onClick={() => router.push('/tutor')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      router.pathname === '/tutor' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    Tutor
                  </button>
                </nav>
                
                <div className="relative">
                  <div className="flex items-center space-x-2">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face" 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-200"
                    />
                    <span className="hidden md:inline text-sm font-medium text-gray-700">
                      {user.name?.split(' ')[0] || 'Estudiante'}
                    </span>
                  </div>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 hidden">
                    <button 
                      onClick={() => router.push('/profile')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Mi Perfil
                    </button>
                    <button 
                      onClick={() => router.push('/settings')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Configuración
                    </button>
                    <hr className="my-1" />
                    <button 
                      onClick={() => {
                        logout();
                        router.push('/login');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/30  border-t border-gray-100/50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">AI University</h3>
              </div>
              <p className="text-sm text-gray-600">
                La primera universidad basada en inteligencia artificial que democratiza la educación superior.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Plataforma</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Cursos</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Tutor Virtual</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Certificaciones</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Comunidad</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Cookies</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Licencias</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-500">
              © 2024 AI University Global. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}