const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const { listTeachers, createTeacher, deleteTeacher } = require('../controllers/teacherController');

router.get('/', ensureAuthenticated, listTeachers);
router.post('/', ensureAuthenticated, createTeacher);
router.delete('/:id', ensureAuthenticated, deleteTeacher);

module.exports = router;

