const express = require('express');
const { Assessment } = require('../models');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Get assessments for a course
router.get('/course/:courseId', authenticate, async (req, res) => {
  try {
    const assessments = await Assessment.findAll({
      where: { courseId: req.params.courseId }
    });
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit assessment
router.post('/submit', authenticate, async (req, res) => {
  try {
    const { assessmentId, answers } = req.body;
    
    // Mock assessment submission and grading
    const result = {
      score: 85,
      maxScore: 100,
      passed: true,
      feedback: "¡Buen trabajo! Tienes un buen entendimiento del tema.",
      timestamp: new Date().toISOString()
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;