const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const {
  listCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

router.get('/', ensureAuthenticated, listCourses);
router.post('/', ensureAuthenticated, createCourse);
router.get('/:id', ensureAuthenticated, getCourse);
router.put('/:id', ensureAuthenticated, updateCourse);
router.delete('/:id', ensureAuthenticated, deleteCourse);

module.exports = router;

