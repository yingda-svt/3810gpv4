const Course = require('../models/Course');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Assignment = require('../models/Assignment');

async function getDashboard(req, res) {
  const [courseCount, studentCount, teacherCount, assignmentCount] = await Promise.all([
    Course.countDocuments(),
    Student.countDocuments(),
    Teacher.countDocuments(),
    Assignment.countDocuments(),
  ]);

  res.render('dashboard', {
    title: 'OLE Dashboard',
    stats: {
      courses: courseCount,
      students: studentCount,
      teachers: teacherCount,
      assignments: assignmentCount,
    },
  });
}

module.exports = {
  getDashboard,
};

