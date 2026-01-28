const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');
const { optimizeResumeContent, calculateJobMatch, generateATSScore } = require('../utils/aiOptimizer');
const { generateTemplate } = require('../utils/templates');
const { rewriteBullet, generateSummary, generateSkills, checkGrammar, enhanceResume, tailorForJob } = require('../utils/aiEnhancer');

// Create or update resume
router.post('/', auth, async (req, res) => {
  try {
    const resumeData = { ...req.body, userId: req.userId, updatedAt: Date.now() };
    
    let resume = await Resume.findOne({ userId: req.userId });
    
    if (resume) {
      resume = await Resume.findOneAndUpdate(
        { userId: req.userId },
        resumeData,
        { new: true }
      );
    } else {
      resume = new Resume(resumeData);
      await resume.save();
    }

    res.json({ message: 'Resume saved successfully', resume });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's resume
router.get('/', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate resume with template
router.post('/generate', auth, async (req, res) => {
  try {
    const { template } = req.body;
    const resume = await Resume.findOne({ userId: req.userId });
    
    if (!resume) {
      return res.status(404).json({ message: 'Please save your details first' });
    }

    const generatedResume = generateTemplate(resume, template || resume.template);
    res.json({ content: generatedResume });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// AI Optimize resume
router.post('/optimize', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });
    
    if (!resume) {
      return res.status(404).json({ message: 'Please save your details first' });
    }

    const targetJob = req.body.targetJob || resume.targetJob || 'software developer';
    const { optimizedResume, jobMatch } = optimizeResumeContent(resume, targetJob);
    
    // Update resume with optimized data
    await Resume.findOneAndUpdate(
      { userId: req.userId },
      { 
        careerObjective: optimizedResume.careerObjective,
        keywords: optimizedResume.keywords,
        aiOptimized: true,
        targetJob: targetJob
      }
    );

    res.json({
      message: 'Resume optimized successfully',
      jobMatch,
      optimizedObjective: optimizedResume.careerObjective
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get job match score
router.post('/job-match', auth, async (req, res) => {
  try {
    const { targetJob } = req.body;
    const resume = await Resume.findOne({ userId: req.userId });
    
    if (!resume) {
      return res.status(404).json({ message: 'Please save your details first' });
    }

    const jobMatch = calculateJobMatch(resume, targetJob);
    const atsScore = generateATSScore(resume);

    res.json({
      jobMatch,
      atsScore,
      targetJob
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get ATS score
router.get('/ats-score', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });
    
    if (!resume) {
      return res.status(404).json({ message: 'Please save your details first' });
    }

    const atsScore = generateATSScore(resume);
    res.json({ atsScore });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Rewrite bullet point
router.post('/rewrite-bullet', auth, async (req, res) => {
  try {
    const { bullet } = req.body;
    const enhanced = rewriteBullet(bullet);
    res.json({ original: bullet, enhanced });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate professional summary
router.post('/generate-summary', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'Please save your details first' });
    }
    
    const summary = generateSummary(resume);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate skills suggestions
router.post('/suggest-skills', auth, async (req, res) => {
  try {
    const { targetJob } = req.body;
    const resume = await Resume.findOne({ userId: req.userId });
    
    const existingSkills = resume?.skills?.technical || [];
    const { suggested, all } = generateSkills(targetJob, existingSkills);
    
    res.json({ suggested, all });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check grammar
router.post('/check-grammar', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const result = checkGrammar(text);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// One-click enhance
router.post('/enhance', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'Please save your details first' });
    }
    
    const enhanced = enhanceResume(resume);
    
    // Update resume with enhanced data
    await Resume.findOneAndUpdate(
      { userId: req.userId },
      enhanced
    );
    
    res.json({ 
      message: 'Resume enhanced successfully',
      enhanced,
      improvements: [
        'Professional summary generated',
        'Bullet points rewritten',
        'Skills suggestions added',
        'Project descriptions enhanced'
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Tailor resume for job
router.post('/tailor', auth, async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const resume = await Resume.findOne({ userId: req.userId });
    
    if (!resume) {
      return res.status(404).json({ message: 'Please save your details first' });
    }
    
    const result = tailorForJob(resume, jobDescription);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
