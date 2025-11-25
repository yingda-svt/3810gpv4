const Assignment = require('../models/Assignment');
const Course = require('../models/Course');

async function listAssignments(req, res) {
  const filters = {};
  if (req.query.course) {
    filters.course = req.query.course;
  }
  const [assignments, courses] = await Promise.all([
    Assignment.find(filters).populate('course').sort({ dueDate: 1 }),
    Course.find().sort({ title: 1 }),
  ]);

  res.render('assignments/index', {
    title: 'Assignment Management',
    assignments,
    courses,
    query: req.query,
  });
}

async function createAssignment(req, res) {
  const payload = {
    title: req.body.title,
    course: req.body.course,
    description: req.body.description,
    dueDate: req.body.dueDate,
    maxScore: Number(req.body.maxScore) || 100,
  };

  if (payload.dueDate) {
    payload.dueDate = new Date(payload.dueDate);
  }

  try {
    await Assignment.create(payload);
    res.redirect('/assignments');
  } catch (error) {
    const [assignments, courses] = await Promise.all([
      Assignment.find().populate('course').sort({ dueDate: 1 }),
      Course.find().sort({ title: 1 }),
    ]);
    res.render('assignments/index', {
      title: 'Assignment Management',
      assignments,
      courses,
      query: req.query,
      error: error.message,
    });
  }
}

async function deleteAssignment(req, res) {
  await Assignment.findByIdAndDelete(req.params.id);
  res.redirect('/assignments');
}

module.exports = {
  listAssignments,
  createAssignment,
  deleteAssignment,
};

