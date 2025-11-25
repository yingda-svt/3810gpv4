const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const { listGrades, upsertGrade, deleteGrade } = require('../controllers/gradeController');

router.get('/', ensureAuthenticated, listGrades);
router.post('/', ensureAuthenticated, upsertGrade);
router.delete('/:id', ensureAuthenticated, deleteGrade);

module.exports = router;

