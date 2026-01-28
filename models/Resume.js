const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    portfolio: String
  },
  education: [{
    degree: String,
    institution: String,
    graduationYear: Number,
    gpa: String
  }],
  skills: {
    technical: [String],
    soft: [String]
  },
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    link: String
  }],
  experience: [{
    role: String,
    company: String,
    duration: String,
    responsibilities: [String]
  }],
  certifications: [String],
  careerObjective: String,
  targetJob: String,
  template: {
    type: String,
    default: 'professional'
  },
  aiOptimized: {
    type: Boolean,
    default: false
  },
  keywords: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
