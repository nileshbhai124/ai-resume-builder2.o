const fs = require('fs');

console.log('Checking deployment files...\n');

const files = [
    'server.js',
    'package.json',
    'public/app-unified.html',
    'public/unified-styles.css',
    'public/unified-app.js',
    'public/resume-templates.html',
    'public/resume-templates.css',
    'public/resume-templates.js'
];

let allGood = true;

files.forEach(file => {
    if (fs.existsSync(file)) {
        console.log('✅', file);
    } else {
        console.log('❌', file);
        allGood = false;
    }
});

console.log('\n' + (allGood ? '🎉 All files present!' : '⚠️ Some files missing'));
