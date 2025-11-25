const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const {
  listAssignments,
  createAssignment,
  deleteAssignment,
} = require('../controllers/assignmentController');

router.get('/', ensureAuthenticated, listAssignments);
router.post('/', ensureAuthenticated, createAssignment);
router.delete('/:id', ensureAuthenticated, deleteAssignment);

module.exports = router;

