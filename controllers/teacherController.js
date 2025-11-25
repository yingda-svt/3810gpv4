const Teacher = require('../models/Teacher');

async function listTeachers(req, res) {
  const filters = {};
  if (req.query.keyword) {
    filters.$or = [
      { name: new RegExp(req.query.keyword, 'i') },
      { expertise: new RegExp(req.query.keyword, 'i') },
    ];
  }

  const teachers = await Teacher.find(filters).sort({ createdAt: -1 });
  res.render('teachers/index', {
    title: 'Teacher Management',
    teachers,
    query: req.query,
  });
}

async function createTeacher(req, res) {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    office: req.body.office,
    expertise: req.body.expertise ? req.body.expertise.split(',').map((it) => it.trim()).filter(Boolean) : [],
    bio: req.body.bio,
  };

  try {
    await Teacher.create(payload);
    res.redirect('/teachers');
  } catch (error) {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.render('teachers/index', {
      title: 'Teacher Management',
      teachers,
      query: req.query,
      error: error.message,
    });
  }
}

async function deleteTeacher(req, res) {
  await Teacher.findByIdAndDelete(req.params.id);
  res.redirect('/teachers');
}

module.exports = {
  listTeachers,
  createTeacher,
  deleteTeacher,
};

