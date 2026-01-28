// Resume templates

function generateProfessionalTemplate(data) {
  let resume = `
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                    ${data.personalInfo.fullName.toUpperCase().padStart(40)}                    ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}
${data.personalInfo.linkedin ? 'LinkedIn: ' + data.personalInfo.linkedin : ''}
${data.personalInfo.portfolio ? 'Portfolio: ' + data.personalInfo.portfolio : ''}

${'═'.repeat(80)}

CAREER OBJECTIVE
${data.careerObjective || 'Seeking opportunities to leverage my skills and contribute to organizational success.'}

${'═'.repeat(80)}

EDUCATION
`;
  
  data.education?.forEach(edu => {
    resume += `
${edu.degree}
${edu.institution} | Graduating ${edu.graduationYear}
${edu.gpa ? 'GPA: ' + edu.gpa : ''}
`;
  });

  resume += `
${'═'.repeat(80)}

TECHNICAL SKILLS
${data.skills.technical?.join(' • ') || 'N/A'}

SOFT SKILLS
${data.skills.soft?.join(' • ') || 'N/A'}

${'═'.repeat(80)}

PROJECTS
`;

  data.projects?.forEach(proj => {
    resume += `
▸ ${proj.title}
  ${proj.description}
  Technologies: ${proj.technologies?.join(', ')}
  ${proj.link ? 'Link: ' + proj.link : ''}
`;
  });

  if (data.experience?.length > 0) {
    resume += `
${'═'.repeat(80)}

EXPERIENCE
`;
    data.experience.forEach(exp => {
      resume += `
▸ ${exp.role} | ${exp.company}
  ${exp.duration}
`;
      exp.responsibilities?.forEach(resp => {
        resume += `  • ${resp}\n`;
      });
    });
  } else {
    resume += `
${'═'.repeat(80)}

EXPERIENCE
Status: Fresher - Eager to learn and contribute
`;
  }

  if (data.certifications?.length > 0) {
    resume += `
${'═'.repeat(80)}

CERTIFICATIONS & ACHIEVEMENTS
`;
    data.certifications.forEach(cert => {
      resume += `• ${cert}\n`;
    });
  }

  return resume;
}

function generateModernTemplate(data) {
  let resume = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ${data.personalInfo.fullName.toUpperCase()}
    ${data.targetJob || 'Professional'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 ${data.personalInfo.email}  |  📱 ${data.personalInfo.phone}  |  📍 ${data.personalInfo.location}
${data.personalInfo.linkedin ? '🔗 ' + data.personalInfo.linkedin : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💼 PROFESSIONAL SUMMARY

${data.careerObjective || 'Dynamic professional with strong technical skills and passion for innovation.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎓 EDUCATION
`;

  data.education?.forEach(edu => {
    resume += `
   ${edu.degree}
   ${edu.institution} • ${edu.graduationYear}
   ${edu.gpa ? 'GPA: ' + edu.gpa : ''}
`;
  });

  resume += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💻 TECHNICAL EXPERTISE

${data.skills.technical?.map(skill => `   ▪ ${skill}`).join('\n') || '   N/A'}

🤝 CORE COMPETENCIES

${data.skills.soft?.map(skill => `   ▪ ${skill}`).join('\n') || '   N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 KEY PROJECTS
`;

  data.projects?.forEach(proj => {
    resume += `
   ► ${proj.title}
     ${proj.description}
     Tech Stack: ${proj.technologies?.join(', ')}
`;
  });

  if (data.experience?.length > 0) {
    resume += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💼 PROFESSIONAL EXPERIENCE
`;
    data.experience.forEach(exp => {
      resume += `
   ► ${exp.role} @ ${exp.company}
     ${exp.duration}
${exp.responsibilities?.map(r => `     • ${r}`).join('\n')}
`;
    });
  }

  return resume;
}

function generateMinimalTemplate(data) {
  let resume = `
${data.personalInfo.fullName.toUpperCase()}
${data.personalInfo.email} • ${data.personalInfo.phone} • ${data.personalInfo.location}
${data.personalInfo.linkedin || ''}

────────────────────────────────────────────────────────────────────────────────

OBJECTIVE
${data.careerObjective || 'Seeking challenging opportunities to apply my skills.'}

────────────────────────────────────────────────────────────────────────────────

EDUCATION
`;

  data.education?.forEach(edu => {
    resume += `${edu.degree} | ${edu.institution} | ${edu.graduationYear}\n`;
  });

  resume += `
────────────────────────────────────────────────────────────────────────────────

SKILLS
Technical: ${data.skills.technical?.join(', ') || 'N/A'}
Soft Skills: ${data.skills.soft?.join(', ') || 'N/A'}

────────────────────────────────────────────────────────────────────────────────

PROJECTS
`;

  data.projects?.forEach(proj => {
    resume += `
${proj.title}
${proj.description}
Technologies: ${proj.technologies?.join(', ')}
`;
  });

  if (data.experience?.length > 0) {
    resume += `
────────────────────────────────────────────────────────────────────────────────

EXPERIENCE
`;
    data.experience.forEach(exp => {
      resume += `
${exp.role} - ${exp.company} (${exp.duration})
${exp.responsibilities?.map(r => `• ${r}`).join('\n')}
`;
    });
  }

  return resume;
}

function generateTemplate(data, templateName = 'professional') {
  switch (templateName) {
    case 'modern':
      return generateModernTemplate(data);
    case 'minimal':
      return generateMinimalTemplate(data);
    case 'professional':
    default:
      return generateProfessionalTemplate(data);
  }
}

module.exports = {
  generateTemplate,
  generateProfessionalTemplate,
  generateModernTemplate,
  generateMinimalTemplate
};
