const fs = require('fs');

function checkFile(filepath) {
  console.log('Checking:', filepath);
  const html = fs.readFileSync(filepath, 'utf8');
  const scriptMatches = [...html.matchAll(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi)];
  console.log('Found script blocks:', scriptMatches.length);
  scriptMatches.forEach((m, idx) => {
    const code = m[1];
    try {
      new Function(code);
      console.log('Script block ' + (idx + 1) + ' syntax: OK! Length: ' + code.length);
    } catch (err) {
      console.error('Script block ' + (idx + 1) + ' syntax error:', err);
    }
  });
}

checkFile('index.html');
checkFile('google_apps_script/index.html');
