const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const {
  listStudents,
  createStudent,
  updateStudentStatus,
  deleteStudent,
} = require('../controllers/studentController');

router.get('/', ensureAuthenticated, listStudents);
router.post('/', ensureAuthenticated, createStudent);
router.post('/:id/status', ensureAuthenticated, updateStudentStatus);
router.delete('/:id', ensureAuthenticated, deleteStudent);

module.exports = router;

