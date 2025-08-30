const express = require('express');
const { Course, Module, Lesson } = require('../models');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { isActive: true }
    });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Error al obtener el curso' });
  }
});

// Get course modules with lessons
router.get('/:id/modules', async (req, res) => {
  try {
    const modules = await Module.findAll({
      where: { courseId: req.params.id },
      include: [{
        model: Lesson,
        order: [['order', 'ASC']]
      }],
      order: [['order', 'ASC']]
    });
    
    if (modules.length === 0) {
      // Devolver array vacío en lugar de error
      return res.json([]);
    }
    
    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ error: 'Error al obtener módulos' });
  }
});

module.exports = router;