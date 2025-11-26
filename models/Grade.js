const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    score: { type: Number, required: true, min: 0 },
    feedback: { type: String, default: '' },
  },
  { timestamps: true }
);

gradeSchema.index({ student: 1, assignment: 1 }, { unique: true });

module.exports = mongoose.model('Grade', gradeSchema);

