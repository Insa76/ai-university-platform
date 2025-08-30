import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { coursesAPI } from '../../../services/api';

export default function CourseDetail({ user }) {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (id) {
      fetchCourseData();
    }
  }, [user, id, router]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [courseResponse, modulesResponse] = await Promise.all([
        coursesAPI.getById(id),
        coursesAPI.getModules(id)
      ]);

      setCourse(courseResponse.data);
      setModules(modulesResponse.data || []);
    } catch (err) {
      console.error('Error fetching course data:', err);
      setError('Error al cargar los datos del curso');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = () => {
    alert('¡Inscripción exitosa! Próximamente se implementará el sistema completo.');
    // Aquí iría la lógica real de inscripción
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <div className="mt-4">
              <button 
                onClick={() => router.push('/courses')}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Volver a Cursos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{course?.title || 'Curso'} - AI University</title>
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">AI University</h1>
            <div className="flex space-x-4">
              <Link href="/courses" className="text-primary hover:text-blue-700">
                ← Todos los Cursos
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-primary">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {course && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                  <p className="text-blue-100 mb-4 max-w-2xl">{course.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      {course.credits} créditos
                    </span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      {course.duration} meses
                    </span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      {course.difficulty}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={handleEnroll}
                  className="bg-white text-primary hover:bg-blue-50 font-bold py-3 px-6 rounded-lg transition duration-300 whitespace-nowrap"
                >
                  Inscribirse al Curso
                </button>
              </div>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contenido del Curso</h2>
              
              {modules.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-gray-100 rounded-lg p-8">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Contenido en Desarrollo</h3>
                    <p className="text-gray-600 mb-4">
                      Este curso está siendo actualizado con contenido interactivo y lecciones detalladas.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                        Notificarme cuando esté listo
                      </button>
                      <Link 
                        href="/tutor" 
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                      >
                        Preguntar al Tutor
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {modules.map((module, index) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">
                          Módulo {module.order}: {module.title}
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {module.duration} horas
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{module.description}</p>
                      
                      {module.Lessons && module.Lessons.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-700 mb-3">Lecciones:</h4>
                          <div className="space-y-2">
                            {module.Lessons.map((lesson) => (
                              <div 
                                key={lesson.id} 
                                className="flex justify-between items-center p-3 bg-white rounded border hover:bg-blue-50 transition duration-300 cursor-pointer"
                                onClick={() => router.push(`/courses/${id}/modules/${module.id}/lessons/${lesson.id}`)}
                              >
                                <div className="flex items-center">
                                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm mr-3">
                                    {lesson.order}
                                  </span>
                                  <span className="font-medium">{lesson.title}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500">
                                    {lesson.duration} min
                                  </span>
                                  <span className="text-blue-500">→</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {(!module.Lessons || module.Lessons.length === 0) && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-center">
                          <p className="text-yellow-700 text-sm">
                            Lecciones próximamente disponibles
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}