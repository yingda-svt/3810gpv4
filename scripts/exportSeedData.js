const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const fs = require('fs');
const mongoose = require('mongoose');

const Course = require('../models/Course');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Assignment = require('../models/Assignment');
const Grade = require('../models/Grade');

async function exportData() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not set. Please check .env');
  }

  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB, starting data export');

  const [courses, students, teachers, assignments, grades] = await Promise.all([
    Course.find().lean(),
    Student.find().populate('enrolledCourses', 'title code').lean(),
    Teacher.find().lean(),
    Assignment.find().populate('course', 'title code').lean(),
    Grade.find()
      .populate('student', 'name studentId')
      .populate('assignment', 'title')
      .lean(),
  ]);

  const sections = [
    ['Courses', courses],
    ['Students', students],
    ['Teachers', teachers],
    ['Assignments', assignments],
    ['Grades', grades],
  ];

  const lines = sections.map(([label, data]) => {
    return `=== ${label} (${data.length}) ===\n${JSON.stringify(data, null, 2)}`;
  });

  const outputPath = path.join(__dirname, '..', 'seed-data.txt');
  fs.writeFileSync(outputPath, lines.join('\n\n'), 'utf8');

  await mongoose.disconnect();
  console.log(`📝 Seed data exported to ${outputPath}`);
}

exportData().catch((err) => {
  console.error('❌ Export failed:', err);
  process.exit(1);
});

