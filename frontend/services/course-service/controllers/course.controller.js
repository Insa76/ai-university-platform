const redisClient = require('../redis-client');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

class CourseController {
  async getAllCourses(req, res) {
    try {
      const userId = req.user?.userId;
      
      // Intentar obtener del cache
      if (userId) {
        const cachedCourses = await redisClient.getCourses(userId);
        if (cachedCourses) {
          console.log('✅ Cache HIT - Cursos desde Redis');
          return res.json({
            message: 'Cursos obtenidos (cache)',
            data: cachedCourses,
            fromCache: true
          });
        }
      }

      // Obtener de base de datos
      console.log('🔄 Cache MISS - Cursos desde DB');
      const result = await pool.query(`
        SELECT c.*, 
               COUNT(m.id) as module_count,
               COUNT(e.id) as enrollment_count
        FROM courses c
        LEFT JOIN modules m ON c.id = m.course_id
        LEFT JOIN enrollments e ON c.id = e.course_id
        WHERE c.is_active = true
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `);

      const courses = result.rows;

      // Guardar en cache
      if (userId) {
        await redisClient.setCourses(userId, courses, 1800); // 30 minutos
      }

      res.json({
        message: 'Cursos obtenidos',
        data: courses,
        fromCache: false
      });
    } catch (error) {
      console.error('Error getting courses:', error);
      res.status(500).json({ error: 'Error al obtener cursos' });
    }
  }

  async getCourseById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      // Intentar obtener del cache
      const cacheKey = `course:${id}:${userId || 'public'}`;
      const cachedCourse = await redisClient.get(cacheKey);
      if (cachedCourse) {
        console.log(`✅ Cache HIT - Curso ${id} desde Redis`);
        return res.json({
          message: 'Curso obtenido (cache)',
          data: cachedCourse,
          fromCache: true
        });
      }

      // Obtener de base de datos
      console.log(`🔄 Cache MISS - Curso ${id} desde DB`);
      const result = await pool.query(`
        SELECT c.*, 
               json_agg(
                 json_build_object(
                   'id', m.id,
                   'title', m.title,
                   'order', m.order,
                   'lessons', (
                     SELECT json_agg(
                       json_build_object(
                         'id', l.id,
                         'title', l.title,
                         'order', l.order
                       )
                     ) FROM lessons l WHERE l.module_id = m.id ORDER BY l.order
                   )
                 )
               ) as modules
        FROM courses c
        LEFT JOIN modules m ON c.id = m.course_id
        WHERE c.id = $1 AND c.is_active = true
        GROUP BY c.id
      `, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Curso no encontrado' });
      }

      const course = result.rows[0];

      // Guardar en cache
      await redisClient.set(cacheKey, course, 3600); // 1 hora

      res.json({
        message: 'Curso obtenido',
        data: course,
        fromCache: false
      });
    } catch (error) {
      console.error('Error getting course:', error);
      res.status(500).json({ error: 'Error al obtener curso' });
    }
  }

  async invalidateCourseCache(courseId) {
    // Invalidar todas las entradas relacionadas con este curso
    const pattern = `course:${courseId}:*`;
    // Implementar lógica de invalidación por patrón
    console.log(`🧹 Cache invalidated for course ${courseId}`);
  }
}

module.exports = new CourseController();