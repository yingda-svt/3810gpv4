const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, default: '' },
    teacher: { type: String, required: true },
    schedule: { type: String, default: '' },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

courseSchema.index({ title: 'text', description: 'text', teacher: 'text' });

module.exports = mongoose.model('Course', courseSchema);

