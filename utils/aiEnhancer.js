// Advanced AI Enhancement Features

const actionVerbs = [
  'Developed', 'Created', 'Designed', 'Implemented', 'Built', 'Engineered',
  'Optimized', 'Improved', 'Enhanced', 'Automated', 'Integrated', 'Deployed',
  'Managed', 'Led', 'Collaborated', 'Achieved', 'Delivered', 'Maintained',
  'Established', 'Streamlined', 'Coordinated', 'Executed', 'Spearheaded'
];

const impactWords = [
  'significantly', 'successfully', 'effectively', 'efficiently',
  'substantially', 'dramatically', 'consistently', 'proactively'
];

// Rewrite bullet points to be more impactful
function rewriteBullet(bullet) {
  let enhanced = bullet.trim();
  
  // Ensure it starts with an action verb
  const startsWithActionVerb = actionVerbs.some(verb => 
    enhanced.toLowerCase().startsWith(verb.toLowerCase())
  );
  
  if (!startsWithActionVerb) {
    const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
    enhanced = `${randomVerb} ${enhanced}`;
  }
  
  // Add impact words if missing
  const hasImpactWord = impactWords.some(word => 
    enhanced.toLowerCase().includes(word)
  );
  
  if (!hasImpactWord && Math.random() > 0.5) {
    const randomImpact = impactWords[Math.floor(Math.random() * impactWords.length)];
    enhanced = enhanced.replace(/^(\w+)/, `$1 ${randomImpact}`);
  }
  
  // Add quantification suggestion if no numbers present
  if (!/\d/.test(enhanced)) {
    enhanced += ' [Add metrics: X%, X users, X hours saved]';
  }
  
  return enhanced;
}

// Generate professional summary based on user data
function generateSummary(resumeData) {
  const { personalInfo, skills, experience, education, targetJob } = resumeData;
  
  const yearsExp = experience?.length > 0 ? 'experienced' : 'motivated';
  const role = targetJob || 'professional';
  const topSkills = skills?.technical?.slice(0, 3).join(', ') || 'technical skills';
  const degree = education?.[0]?.degree || 'degree';
  
  const summaries = [
    `${yearsExp.charAt(0).toUpperCase() + yearsExp.slice(1)} ${role} with strong expertise in ${topSkills}. ${degree} graduate with proven ability to deliver high-quality solutions and drive project success.`,
    
    `Results-driven ${role} specializing in ${topSkills}. Combines technical proficiency with strong problem-solving skills to create innovative solutions. ${degree} background with hands-on experience in modern development practices.`,
    
    `Dynamic ${role} with comprehensive knowledge of ${topSkills}. Passionate about leveraging technology to solve complex problems. ${degree} holder with demonstrated success in collaborative team environments.`
  ];
  
  return summaries[Math.floor(Math.random() * summaries.length)];
}

// Generate relevant skills based on target job
function generateSkills(targetJob, existingSkills = []) {
  const skillDatabase = {
    'software developer': [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Git', 'REST APIs',
      'SQL', 'MongoDB', 'Docker', 'AWS', 'Agile', 'Testing', 'CI/CD'
    ],
    'web developer': [
      'HTML5', 'CSS3', 'JavaScript', 'React', 'Vue.js', 'Angular', 'TypeScript',
      'Responsive Design', 'Bootstrap', 'Webpack', 'REST APIs', 'Git'
    ],
    'frontend developer': [
      'HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'TypeScript', 'Sass',
      'Webpack', 'Redux', 'Responsive Design', 'UI/UX', 'Accessibility'
    ],
    'backend developer': [
      'Node.js', 'Python', 'Java', 'Express', 'Django', 'Spring Boot',
      'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Microservices', 'GraphQL'
    ],
    'full stack developer': [
      'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL',
      'REST APIs', 'Git', 'Docker', 'AWS', 'TypeScript', 'Redux'
    ],
    'data analyst': [
      'Python', 'SQL', 'Excel', 'Tableau', 'Power BI', 'Pandas', 'NumPy',
      'Data Visualization', 'Statistics', 'R', 'Machine Learning Basics'
    ],
    'mobile developer': [
      'React Native', 'Flutter', 'Swift', 'Kotlin', 'Android', 'iOS',
      'Mobile UI/UX', 'REST APIs', 'Firebase', 'App Store Deployment'
    ],
    'devops engineer': [
      'Docker', 'Kubernetes', 'AWS', 'Jenkins', 'CI/CD', 'Linux', 'Terraform',
      'Ansible', 'Monitoring', 'Git', 'Python', 'Bash Scripting'
    ]
  };
  
  const jobLower = targetJob.toLowerCase();
  let suggestedSkills = [];
  
  // Find matching job category
  for (const [job, skills] of Object.entries(skillDatabase)) {
    if (jobLower.includes(job)) {
      suggestedSkills = skills;
      break;
    }
  }
  
  // Filter out skills user already has
  const existingLower = existingSkills.map(s => s.toLowerCase());
  const newSkills = suggestedSkills.filter(skill => 
    !existingLower.some(existing => existing.includes(skill.toLowerCase()))
  );
  
  return {
    suggested: newSkills.slice(0, 8),
    all: suggestedSkills
  };
}

// Check grammar and provide suggestions
function checkGrammar(text) {
  const issues = [];
  
  // Check for common grammar issues
  const patterns = [
    { pattern: /\bi\b/g, message: 'Avoid using "I" in resume bullets', severity: 'high' },
    { pattern: /\bme\b/g, message: 'Avoid using "me" in resume bullets', severity: 'high' },
    { pattern: /\bmy\b/g, message: 'Avoid using "my" in resume bullets', severity: 'medium' },
    { pattern: /\.\./g, message: 'Double period found', severity: 'high' },
    { pattern: /\s{2,}/g, message: 'Multiple spaces found', severity: 'low' },
    { pattern: /[a-z]\.[A-Z]/g, message: 'Missing space after period', severity: 'medium' },
    { pattern: /\b(very|really|just|actually)\b/gi, message: 'Remove filler words', severity: 'low' }
  ];
  
  patterns.forEach(({ pattern, message, severity }) => {
    const matches = text.match(pattern);
    if (matches) {
      issues.push({
        message,
        severity,
        count: matches.length,
        examples: matches.slice(0, 3)
      });
    }
  });
  
  // Check capitalization
  const sentences = text.split(/[.!?]+/);
  sentences.forEach((sentence, index) => {
    const trimmed = sentence.trim();
    if (trimmed && !/^[A-Z]/.test(trimmed)) {
      issues.push({
        message: `Sentence ${index + 1} should start with capital letter`,
        severity: 'medium',
        example: trimmed.substring(0, 50)
      });
    }
  });
  
  return {
    issueCount: issues.length,
    issues,
    score: Math.max(0, 100 - (issues.length * 5))
  };
}

// Enhance entire resume with AI
function enhanceResume(resumeData) {
  const enhanced = { ...resumeData };
  
  // Enhance career objective/summary
  if (!enhanced.careerObjective || enhanced.careerObjective.length < 50) {
    enhanced.careerObjective = generateSummary(resumeData);
  }
  
  // Enhance project descriptions
  if (enhanced.projects) {
    enhanced.projects = enhanced.projects.map(project => ({
      ...project,
      description: project.description.split('.')[0] + '. ' + 
        'Implemented using modern best practices and design patterns.'
    }));
  }
  
  // Enhance experience bullets
  if (enhanced.experience) {
    enhanced.experience = enhanced.experience.map(exp => ({
      ...exp,
      responsibilities: exp.responsibilities.map(bullet => rewriteBullet(bullet))
    }));
  }
  
  // Add suggested skills
  if (enhanced.targetJob) {
    const { suggested } = generateSkills(enhanced.targetJob, enhanced.skills?.technical || []);
    enhanced.suggestedSkills = suggested;
  }
  
  return enhanced;
}

// Tailor resume for specific job description
function tailorForJob(resumeData, jobDescription) {
  const keywords = extractKeywordsFromJobDescription(jobDescription);
  const enhanced = { ...resumeData };
  
  // Update career objective to match job
  enhanced.careerObjective = `Seeking ${resumeData.targetJob || 'position'} role to leverage expertise in ${keywords.slice(0, 3).join(', ')} and contribute to organizational success.`;
  
  // Prioritize matching skills
  if (enhanced.skills?.technical) {
    const matchingSkills = enhanced.skills.technical.filter(skill =>
      keywords.some(keyword => skill.toLowerCase().includes(keyword.toLowerCase()))
    );
    const otherSkills = enhanced.skills.technical.filter(skill =>
      !matchingSkills.includes(skill)
    );
    enhanced.skills.technical = [...matchingSkills, ...otherSkills];
  }
  
  return {
    enhanced,
    matchedKeywords: keywords.slice(0, 10),
    suggestions: [
      'Reorder skills to prioritize job-relevant ones',
      'Add quantifiable achievements',
      'Use keywords from job description',
      'Highlight relevant projects first'
    ]
  };
}

function extractKeywordsFromJobDescription(description) {
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  const words = description.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  
  const wordFreq = {};
  words.forEach(word => {
    if (!commonWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);
}

module.exports = {
  rewriteBullet,
  generateSummary,
  generateSkills,
  checkGrammar,
  enhanceResume,
  tailorForJob
};
