import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import BackgroundWrapper from '../components/layout/BackgroundWrapper';

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <BackgroundWrapper >
    <div className="min-h-screen ">
      <Head>
        <title>AI University Global</title>
        <meta name="description" content="La primera universidad basada en IA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header con navegación */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-600">AI University</h1>
            <nav className="flex space-x-6">
              {user ? (
                <>
                  <Link href="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="nav-link text-red-600 hover:text-red-700"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="nav-link">
                    Iniciar Sesión
                  </Link>
                  <Link href="/register">
                    <Button>Registrarse</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            AI <span className="text-primary-600">University</span> Global
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            La primera universidad basada en inteligencia artificial que democratiza 
            la educación superior con profesores virtuales personalizados 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" icon="🎓">
                  Ir a mi Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" icon="🚀">
                    Comenzar Ahora
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" icon="🔑">
                    Ya tengo cuenta
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-8 hover:shadow-xl">
            <div className="text-4xl mb-4 text-primary-600 animate-float">🤖</div>
            <h3 className="text-2xl font-bold mb-4">Profesores Virtuales</h3>
            <p className="text-gray-600">
              Aprende con profesores de IA personalizados que se adaptan a tu ritmo 
              y estilo de aprendizaje.
            </p>
          </Card>

          <Card className="text-center p-8 hover:shadow-xl">
            <div className="text-4xl mb-4 text-secondary-600 animate-float">💰</div>
            <h3 className="text-2xl font-bold mb-4">Accesible</h3>
            <p className="text-gray-600">
              Educación de calidad a una fracción del costo de las universidades 
              tradicionales.
            </p>
          </Card>

          <Card className="text-center p-8 hover:shadow-xl">
            <div className="text-4xl mb-4 text-accent-500 animate-float">🌍</div>
            <h3 className="text-2xl font-bold mb-4">Global</h3>
            <p className="text-gray-600">
              Accede desde cualquier lugar del mundo, sin restricciones 
              geográficas ni horarias.
            </p>
          </Card>
        </div>

        <Card className="max-w-4xl mx-auto p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Cursos Disponibles
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-2 border-primary-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-primary-600">Ciencias de Datos e IA</h3>
                  <Badge variant="primary">Nuevo</Badge>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Aprende las habilidades más demandadas del siglo XXI con profesores 
                virtuales especializados.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">3 años</span>
                <Link href="/courses">
                  <Button size="sm">Explorar</Button>
                </Link>
              </div>
            </Card>

            <Card className="p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-700">Desarrollo de Software</h3>
                  <Badge variant="neutral">Próximamente</Badge>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Conviértete en desarrollador full-stack con nuestro programa 
                práctico e interactivo.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">2.5 años</span>
                <Button size="sm" variant="ghost" disabled>
                  Próximamente
                </Button>
              </div>
            </Card>
          </div>
          
          {!user && (
            <div className="text-center mt-8">
              <Link href="/courses" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
                Explorar todos los cursos →
              </Link>
            </div>
          )}
        </Card>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">© 2024 AI University Global. Todos los derechos reservados.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="hover:text-primary-400 transition duration-300">Términos</a>
            <a href="#" className="hover:text-primary-400 transition duration-300">Privacidad</a>
            <a href="#" className="hover:text-primary-400 transition duration-300">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
    </BackgroundWrapper>
  );
}