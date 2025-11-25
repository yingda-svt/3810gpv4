const Course = require('../models/Course');

function buildSearchFilters(query = {}) {
  const filters = {};
  if (query.keyword) {
    filters.$text = { $search: query.keyword };
  }
  if (query.teacher) {
    filters.teacher = new RegExp(query.teacher, 'i');
  }
  if (query.isActive === 'false') {
    filters.isActive = false;
  }
  if (query.isActive === 'true') {
    filters.isActive = true;
  }
  return filters;
}

async function listCourses(req, res) {
  const filters = buildSearchFilters(req.query);
  const courses = await Course.find(filters).sort({ createdAt: -1 });
  res.render('courses/index', {
    title: 'Course Management',
    courses,
    query: req.query,
  });
}

async function createCourse(req, res) {
  const payload = {
    title: req.body.title,
    code: req.body.code,
    description: req.body.description,
    teacher: req.body.teacher,
    schedule: req.body.schedule,
    tags: req.body.tags ? req.body.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
    createdBy: req.session?.user?.id,
  };

  try {
    await Course.create(payload);
    res.redirect('/courses');
  } catch (error) {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.render('courses/index', {
      title: 'Course Management',
      courses,
      query: req.query,
      error: error.message,
    });
  }
}

async function getCourse(req, res) {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).render('404', { title: 'Course Not Found' });
  }
  res.render('courses/detail', { title: `Course - ${course.title}`, course });
}

async function updateCourse(req, res) {
  const payload = {
    title: req.body.title,
    description: req.body.description,
    teacher: req.body.teacher,
    schedule: req.body.schedule,
    isActive: req.body.isActive === 'on',
    tags: req.body.tags ? req.body.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
  };

  await Course.findByIdAndUpdate(req.params.id, payload, { runValidators: true });
  res.redirect(`/courses/${req.params.id}`);
}

async function deleteCourse(req, res) {
  await Course.findByIdAndDelete(req.params.id);
  res.redirect('/courses');
}

// API handlers
async function listCoursesApi(req, res) {
  const filters = buildSearchFilters(req.query);
  const courses = await Course.find(filters).sort({ createdAt: -1 });
  res.json(courses);
}

async function createCourseApi(req, res) {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updateCourseApi(req, res) {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteCourseApi(req, res) {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  res.json({ success: true });
}

module.exports = {
  listCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  listCoursesApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
};

