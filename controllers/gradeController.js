const Grade = require('../models/Grade');
const Student = require('../models/Student');
const Assignment = require('../models/Assignment');

async function listGrades(req, res) {
  const filters = {};
  if (req.query.assignment) {
    filters.assignment = req.query.assignment;
  }
  if (req.query.student) {
    filters.student = req.query.student;
  }

  const [grades, students, assignments] = await Promise.all([
    Grade.find(filters).populate('student').populate('assignment').sort({ updatedAt: -1 }),
    Student.find().sort({ name: 1 }),
    Assignment.find().populate('course').sort({ dueDate: 1 }),
  ]);

  res.render('grades/index', {
    title: 'Grade Management',
    grades,
    students,
    assignments,
    query: req.query,
  });
}

async function upsertGrade(req, res) {
  const payload = {
    student: req.body.student,
    assignment: req.body.assignment,
    score: Number(req.body.score),
    feedback: req.body.feedback,
  };

  if (Number.isNaN(payload.score)) {
    payload.score = 0;
  }

  await Grade.findOneAndUpdate(
    { student: payload.student, assignment: payload.assignment },
    payload,
    { upsert: true, runValidators: true }
  );

  res.redirect('/grades');
}

async function deleteGrade(req, res) {
  await Grade.findByIdAndDelete(req.params.id);
  res.redirect('/grades');
}

module.exports = {
  listGrades,
  upsertGrade,
  deleteGrade,
};

