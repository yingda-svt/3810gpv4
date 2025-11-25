const Student = require('../models/Student');
const Course = require('../models/Course');

async function listStudents(req, res) {
  const filters = {};
  if (req.query.keyword) {
    filters.$or = [
      { name: new RegExp(req.query.keyword, 'i') },
      { studentId: new RegExp(req.query.keyword, 'i') },
    ];
  }
  if (req.query.status) {
    filters.status = req.query.status;
  }

  const [students, courses] = await Promise.all([
    Student.find(filters).populate('enrolledCourses').sort({ createdAt: -1 }),
    Course.find().sort({ title: 1 }),
  ]);

  res.render('students/index', {
    title: 'Student Management',
    students,
    courses,
    query: req.query,
  });
}

async function createStudent(req, res) {
  const payload = {
    name: req.body.name,
    studentId: req.body.studentId,
    email: req.body.email,
    major: req.body.major,
    enrolledCourses: req.body.enrolledCourses || [],
  };

  if (!Array.isArray(payload.enrolledCourses)) {
    payload.enrolledCourses = [payload.enrolledCourses].filter(Boolean);
  }

  try {
    await Student.create(payload);
    res.redirect('/students');
  } catch (error) {
    const [students, courses] = await Promise.all([
      Student.find().populate('enrolledCourses').sort({ createdAt: -1 }),
      Course.find().sort({ title: 1 }),
    ]);
    res.render('students/index', {
      title: 'Student Management',
      students,
      courses,
      query: req.query,
      error: error.message,
    });
  }
}

async function updateStudentStatus(req, res) {
  await Student.findByIdAndUpdate(req.params.id, {
    status: req.body.status,
  });
  res.redirect('/students');
}

async function deleteStudent(req, res) {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect('/students');
}

module.exports = {
  listStudents,
  createStudent,
  updateStudentStatus,
  deleteStudent,
};

