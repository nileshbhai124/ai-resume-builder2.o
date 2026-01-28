// AI-powered keyword optimization and job matching

const jobKeywords = {
  'software developer': ['javascript', 'python', 'java', 'react', 'node.js', 'git', 'api', 'database', 'agile', 'testing'],
  'web developer': ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'responsive', 'frontend', 'backend', 'rest api'],
  'data analyst': ['python', 'sql', 'excel', 'tableau', 'power bi', 'statistics', 'data visualization', 'pandas', 'numpy'],
  'frontend developer': ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'typescript', 'responsive design', 'ui/ux'],
  'backend developer': ['node.js', 'python', 'java', 'database', 'api', 'mongodb', 'postgresql', 'microservices', 'docker'],
  'full stack developer': ['javascript', 'react', 'node.js', 'mongodb', 'express', 'rest api', 'git', 'docker', 'aws'],
  'mobile developer': ['react native', 'flutter', 'swift', 'kotlin', 'android', 'ios', 'mobile ui', 'api integration'],
  'devops engineer': ['docker', 'kubernetes', 'aws', 'ci/cd', 'jenkins', 'linux', 'automation', 'monitoring', 'git'],
  'ui/ux designer': ['figma', 'adobe xd', 'sketch', 'wireframing', 'prototyping', 'user research', 'design systems'],
  'data scientist': ['python', 'machine learning', 'tensorflow', 'scikit-learn', 'statistics', 'data analysis', 'sql']
};

const actionVerbs = [
  'developed', 'created', 'designed', 'implemented', 'built', 'engineered',
  'optimized', 'improved', 'enhanced', 'automated', 'integrated', 'deployed',
  'managed', 'led', 'collaborated', 'achieved', 'delivered', 'maintained'
];

function extractKeywords(resumeData) {
  const keywords = new Set();
  
  // Extract from skills
  if (resumeData.skills) {
    resumeData.skills.technical?.forEach(skill => keywords.add(skill.toLowerCase()));
    resumeData.skills.soft?.forEach(skill => keywords.add(skill.toLowerCase()));
  }
  
  // Extract from projects
  resumeData.projects?.forEach(project => {
    project.technologies?.forEach(tech => keywords.add(tech.toLowerCase()));
  });
  
  return Array.from(keywords);
}

function calculateJobMatch(resumeData, targetJob) {
  const targetJobLower = targetJob.toLowerCase();
  const resumeKeywords = extractKeywords(resumeData);
  
  let matchedKeywords = [];
  let missingKeywords = [];
  let matchScore = 0;
  
  // Find matching job category
  for (const [job, keywords] of Object.entries(jobKeywords)) {
    if (targetJobLower.includes(job)) {
      keywords.forEach(keyword => {
        if (resumeKeywords.some(rk => rk.includes(keyword) || keyword.includes(rk))) {
          matchedKeywords.push(keyword);
          matchScore += 10;
        } else {
          missingKeywords.push(keyword);
        }
      });
      break;
    }
  }
  
  // Calculate percentage
  const totalKeywords = matchedKeywords.length + missingKeywords.length;
  const matchPercentage = totalKeywords > 0 ? Math.round((matchedKeywords.length / totalKeywords) * 100) : 0;
  
  return {
    matchPercentage,
    matchScore,
    matchedKeywords,
    missingKeywords,
    suggestions: generateSuggestions(missingKeywords)
  };
}

function generateSuggestions(missingKeywords) {
  const suggestions = [];
  
  if (missingKeywords.length > 0) {
    suggestions.push(`Add these skills to improve your match: ${missingKeywords.slice(0, 5).join(', ')}`);
  }
  
  suggestions.push('Use action verbs like: ' + actionVerbs.slice(0, 6).join(', '));
  suggestions.push('Quantify your achievements with numbers and metrics');
  suggestions.push('Tailor your career objective to match the target role');
  
  return suggestions;
}

function optimizeResumeContent(resumeData, targetJob) {
  const optimized = { ...resumeData };
  const jobMatch = calculateJobMatch(resumeData, targetJob);
  
  // Optimize career objective
  if (targetJob && !optimized.careerObjective.toLowerCase().includes(targetJob.toLowerCase())) {
    optimized.careerObjective = `Motivated professional seeking ${targetJob} position to leverage ${
      resumeData.skills.technical?.slice(0, 3).join(', ') || 'technical skills'
    } and contribute to innovative projects.`;
  }
  
  // Add keywords to optimize
  optimized.keywords = jobMatch.matchedKeywords;
  optimized.aiOptimized = true;
  
  return {
    optimizedResume: optimized,
    jobMatch
  };
}

function generateATSScore(resumeData) {
  let score = 0;
  
  // Check essential sections
  if (resumeData.personalInfo?.fullName) score += 10;
  if (resumeData.personalInfo?.email) score += 10;
  if (resumeData.personalInfo?.phone) score += 10;
  if (resumeData.education?.length > 0) score += 15;
  if (resumeData.skills?.technical?.length > 0) score += 20;
  if (resumeData.projects?.length > 0) score += 15;
  if (resumeData.careerObjective) score += 10;
  
  // Bonus for experience
  if (resumeData.experience?.length > 0) score += 10;
  
  return Math.min(score, 100);
}

module.exports = {
  extractKeywords,
  calculateJobMatch,
  optimizeResumeContent,
  generateATSScore,
  actionVerbs
};
