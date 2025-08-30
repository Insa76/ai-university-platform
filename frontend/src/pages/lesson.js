import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { coursesAPI } from '../../services/api';

export default function LessonPage({ user }) {
  const router = useRouter();
  const { courseId, moduleId } = router.query;

  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (courseId && moduleId) {
      // Simular datos de lección
      setTimeout(() => {
        const mockData = {
          course: { id: courseId, title: `Curso ${courseId?.slice(0,8)}` },
          module: { id: moduleId, title: `Módulo ${moduleId?.slice(0,8)}` },
          lesson: {
            id: 'lesson1',
            title: 'Lección de Ejemplo',
            content: `
              <h2>Bienvenido a la Lección</h2>
              <p>Esta es una lección de ejemplo del curso.</p>
              
              <h3>Contenido de Aprendizaje</h3>
              <ul>
                <li><strong>Concepto 1</strong>: Explicación detallada</li>
                <li><strong>Concepto 2</strong>: Ejemplos prácticos</li>
              </ul>
            `,
            duration: 30,
            completed: false
          }
        };
        setLessonData(mockData);
        setLoading(false);
      }, 500);
    }
  }, [user, courseId, moduleId, router]);

  const handleCompleteLesson = () => {
    alert('¡Lección completada!');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{lessonData?.lesson?.title || 'Lección'} - AI University</title>
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">AI University</h1>
            <div className="flex space-x-4">
              <Link 
                href={`/courses/${courseId}`} 
                className="text-primary hover:text-blue-700 flex items-center"
              >
                ← Volver al Curso
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">{lessonData?.lesson?.title}</h1>
                <p className="text-blue-100">
                  {lessonData?.course?.title} → {lessonData?.module?.title}
                </p>
                <div className="flex items-center text-blue-100 mt-1">
                  <span>⏱️ {lessonData?.lesson?.duration} minutos</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  lessonData?.lesson?.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-yellow-500 text-white'
                }`}>
                  {lessonData?.lesson?.completed ? 'Completada' : 'En progreso'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="prose max-w-none mb-8">
              {lessonData?.lesson?.content && (
                <div dangerouslySetInnerHTML={{ __html: lessonData.lesson.content }} />
              )}
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-blue-800 mb-3">💡 ¿Necesitas ayuda?</h3>
              <p className="text-blue-700 mb-4">
                Puedes preguntarle al tutor virtual sobre cualquier concepto de esta lección.
              </p>
              <Link 
                href="/tutor"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
              >
                Hablar con el Tutor Virtual
              </Link>
            </div>

            <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
              <button 
                onClick={handleCompleteLesson}
                className={`font-bold py-3 px-8 rounded-lg transition duration-300 ${
                  lessonData?.lesson?.completed
                    ? 'bg-green-500 text-white'
                    : 'bg-primary hover:bg-blue-700 text-white'
                }`}
              >
                {lessonData?.lesson?.completed ? '✓ Lección Completada' : 'Marcar como Completada'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}