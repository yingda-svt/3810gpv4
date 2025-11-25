const express = require('express');
const router = express.Router();
const {
  listCoursesApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
} = require('../controllers/courseController');

router.get('/courses', listCoursesApi);
router.post('/courses', createCourseApi);
router.put('/courses/:id', updateCourseApi);
router.delete('/courses/:id', deleteCourseApi);

module.exports = router;

