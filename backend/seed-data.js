const { sequelize, User, Course, Module, Lesson } = require('./src/models');

async function seedDatabase() {
  try {
    // Sincronizar base de datos
    await sequelize.sync({ force: true });
    console.log('Base de datos sincronizada');

    // Crear cursos de ejemplo
    const courses = await Course.bulkCreate([
      {
        title: 'Ciencias de Datos e IA',
        description: 'Programa completo de ciencia de datos e inteligencia artificial',
        duration: 36,
        credits: 180,
        difficulty: 'intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'
      },
      {
        title: 'Desarrollo de Software',
        description: 'Aprende a desarrollar software full-stack moderno',
        duration: 30,
        credits: 150,
        difficulty: 'beginner',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'
      },
      {
        title: 'Marketing Digital',
        description: 'Estrategias de marketing en el entorno digital',
        duration: 24,
        credits: 120,
        difficulty: 'beginner',
        thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400'
      }
    ]);

    console.log('Cursos creados:', courses.length);

    // Crear módulos para el primer curso
    const modules = await Module.bulkCreate([
      {
        courseId: courses[0].id,
        title: 'Fundamentos de Matemáticas',
        description: 'Conceptos matemáticos esenciales para ciencia de datos',
        order: 1,
        duration: 4
      },
      {
        courseId: courses[0].id,
        title: 'Introducción a Python',
        description: 'Programación en Python para análisis de datos',
        order: 2,
        duration: 6
      },
      {
        courseId: courses[0].id,
        title: 'Machine Learning Básico',
        description: 'Conceptos fundamentales de machine learning',
        order: 3,
        duration: 8
      }
    ]);

    console.log('Módulos creados:', modules.length);

    // Crear lecciones para los módulos
    const lessons = await Lesson.bulkCreate([
      {
        moduleId: modules[0].id,
        title: 'Álgebra Lineal',
        content: 'Introducción a vectores y matrices...',
        order: 1,
        duration: 2
      },
      {
        moduleId: modules[0].id,
        title: 'Estadística Descriptiva',
        content: 'Medidas de tendencia central y dispersión...',
        order: 2,
        duration: 2
      },
      {
        moduleId: modules[1].id,
        title: 'Sintaxis Básica de Python',
        content: 'Variables, tipos de datos y estructuras de control...',
        order: 1,
        duration: 3
      }
    ]);

    console.log('Lecciones creadas:', lessons.length);

    console.log('✅ Base de datos poblada con datos de prueba');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

seedDatabase();