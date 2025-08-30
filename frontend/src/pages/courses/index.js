import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { coursesAPI } from '../../../services/api';

export default function Courses({ user }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchCourses();
  }, [user, router]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getAll();
      setCourses(response.data);
    } catch (err) {
      setError('Error al cargar los cursos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Cursos - AI University</title>
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">AI University</h1>
            <Link href="/dashboard" className="text-primary hover:text-blue-700">
              ← Volver al Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Todos los Cursos</h2>
          <p className="text-gray-600">Explora nuestra oferta académica</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
                  <div className="text-4xl text-white">📚</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {course.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">
                      {course.credits} créditos
                    </span>
                    <span className="text-sm text-gray-500">
                      {course.duration} meses
                    </span>
                  </div>
                  <Link 
                    href={`/courses/${course.id}`}
                    className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-center transition duration-300 block"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}